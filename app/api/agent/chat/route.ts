import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";
import { loadAgentContext, buildAgentSystemPrompt } from "@/lib/context-loader";
import { extractAndSaveMemories } from "@/lib/memory-writer";
import { getUsageLimit } from "@/lib/agents";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const { message, projectId } = await req.json();
  if (!message?.trim()) return new Response("Message required", { status: 400 });
  if (!projectId) return new Response("projectId required", { status: 400 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return new Response("User not found", { status: 404 });

  // Verify project ownership
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) return new Response("Project not found", { status: 404 });

  // Check usage limits
  const limit = getUsageLimit(user.plan);
  if (limit !== -1) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const usageCount = await prisma.usageLog.count({
      where: { userId: user.id, createdAt: { gte: startOfMonth } },
    });
    if (usageCount >= limit) {
      return new Response(
        JSON.stringify({ error: "Monthly usage limit reached. Upgrade to Pro for more." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // Ensure agent exists for this project
  let agent = await prisma.aiAgent.findUnique({ where: { projectId } });
  if (!agent) {
    agent = await prisma.aiAgent.create({ data: { projectId } });
  }

  // Load full context
  const ctx = await loadAgentContext(projectId);
  if (!ctx) return new Response("Project context unavailable", { status: 500 });

  const systemPrompt = buildAgentSystemPrompt(ctx);

  // Build messages from conversation history
  const historyMessages = ctx.conversationHistory.map(m => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  // Save the user message
  await prisma.conversationMessage.create({
    data: { projectId, role: "user", content: message },
  });

  await prisma.usageLog.create({ data: { userId: user.id, agentId: "cofounder" } });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        let fullResponse = "";

        const anthropicStream = anthropic.messages.stream({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          system: systemPrompt,
          messages: [
            ...historyMessages,
            { role: "user", content: message },
          ],
        });

        for await (const event of anthropicStream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            const text = event.delta.text;
            fullResponse += text;
            controller.enqueue(encoder.encode(text));
          }
        }

        // Persist the assistant response
        await prisma.conversationMessage.create({
          data: { projectId, role: "assistant", content: fullResponse },
        });

        // Update agent interaction count + lastActiveAt
        await prisma.aiAgent.update({
          where: { id: agent!.id },
          data: {
            lastActiveAt: new Date(),
            totalInteractions: { increment: 1 },
          },
        });

        // Async memory extraction (fire and forget — don't block the stream)
        extractAndSaveMemories(agent!.id, message, fullResponse).catch(() => {});

        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Agent-Project": projectId,
    },
  });
}
