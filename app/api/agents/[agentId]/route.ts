import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { AGENT_SYSTEM_PROMPTS, getUsageLimit, type AgentId } from "@/lib/agents";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest, { params }: { params: { agentId: string } }) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const agentId = params.agentId as AgentId;
  if (!AGENT_SYSTEM_PROMPTS[agentId]) {
    return new Response("Invalid agent", { status: 400 });
  }

  const { message } = await req.json();
  if (!message?.trim()) return new Response("Message required", { status: 400 });

  // Get user
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return new Response("User not found", { status: 404 });

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
      return new Response(JSON.stringify({ error: "Monthly usage limit reached. Upgrade to Pro for more calls." }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // Get active project for context injection
  const activeProject = await prisma.project.findFirst({
    where: { userId: user.id, isActive: true },
  });

  let fullMessage = message;
  if (agentId !== "brain" && activeProject?.contextBrief) {
    fullMessage = `[PROJECT CONTEXT: ${activeProject.contextBrief}]\n\n${message}`;
  }

  // Log usage
  await prisma.usageLog.create({
    data: { userId: user.id, agentId },
  });

  // Stream from Claude
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let fullText = "";

        const anthropicStream = anthropic.messages.stream({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: AGENT_SYSTEM_PROMPTS[agentId],
          messages: [{ role: "user", content: fullMessage }],
        });

        for await (const event of anthropicStream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            const text = event.delta.text;
            fullText += text;
            controller.enqueue(encoder.encode(text));
          }
        }

        // After brain completes, save context brief to project
        if (agentId === "brain" && activeProject) {
          const briefMatch = fullText.match(/## ⚡ Session Context Brief\s*([\s\S]+?)(?=##|$)/);
          if (briefMatch) {
            await prisma.project.update({
              where: { id: activeProject.id },
              data: { contextBrief: briefMatch[1].trim() },
            });
          }
        }

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
    },
  });
}
