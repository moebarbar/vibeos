import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";
import { loadAgentContext } from "@/lib/context-loader";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CHECKIN_SYSTEM = `You are the AI Cofounder doing a weekly progress check-in.

Your tone: warm but direct. You know this project deeply. You care about their success.

Analyze what was shared and output exactly three sections:

## ✅ What You Built (Logged)
Summarize what they built this week. Confirm it against the plan.

## 📊 Progress Analysis
- Are they on track? Behind? Ahead?
- What blockers exist?
- What's the biggest risk right now?

## 🎯 This Week's Single Priority
One specific thing to build next. Not a list — ONE thing with:
- Exactly what it is
- Why this before anything else
- The exact prompt to give Cursor/Claude to build it

Be direct. Be specific. Get them moving.`;

export async function POST(req: NextRequest) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const { projectId, update } = await req.json();
  if (!projectId || !update?.trim()) {
    return new Response("projectId and update required", { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return new Response("User not found", { status: 404 });

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) return new Response("Project not found", { status: 404 });

  // Log the check-in to progress
  await prisma.progressLog.create({
    data: {
      projectId,
      logType: "check_in",
      content: { update, timestamp: new Date().toISOString() },
    },
  });

  // Load context for the agent's analysis
  const ctx = await loadAgentContext(projectId);
  const contextSummary = ctx
    ? `Project: ${ctx.project.name}\nProgress: ${ctx.stats.progressPercentage}% (${ctx.stats.completedMilestones}/${ctx.stats.totalMilestones} milestones)\nDays active: ${ctx.stats.totalDays}\nCurrent milestone: ${ctx.currentMilestone?.name ?? "None"}`
    : `Project: ${project.name}`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let fullResponse = "";

      const anthropicStream = anthropic.messages.stream({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: CHECKIN_SYSTEM,
        messages: [
          {
            role: "user",
            content: `${contextSummary}\n\nWeekly update from founder:\n${update}`,
          },
        ],
      });

      for await (const event of anthropicStream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          fullResponse += event.delta.text;
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }

      // Create notification for the check-in response
      await prisma.notification.create({
        data: {
          userId: user.id,
          projectId,
          notificationType: "check_in",
          title: `Weekly check-in — ${project.name}`,
          content: fullResponse.slice(0, 500),
          actionUrl: `/dashboard/agent?project=${projectId}`,
        },
      });

      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Transfer-Encoding": "chunked" },
  });
}
