import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PROMPT_SYSTEM = `You are a senior engineer writing implementation prompts for an AI coding assistant (Cursor/Claude Code/Bolt).

Given a task spec and project context, produce a dense, ready-to-use implementation prompt that includes:
- Exact goal in one sentence
- Files to create or modify (with paths)
- Step-by-step implementation approach
- Key interfaces, types, or data shapes to use
- Edge cases and error handling to consider
- Expected output/behavior when done

Write it as if briefing a smart AI that has no prior context — include everything it needs.
Output ONLY the prompt text. No preamble, no "here's your prompt:", just the prompt.`;

export async function POST(req: NextRequest) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const { specId, projectId } = await req.json();
  if (!specId) return new Response("specId required", { status: 400 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return new Response("User not found", { status: 404 });

  const spec = await prisma.milestoneSpec.findFirst({
    where: { id: specId, milestone: { project: { userId: user.id } } },
    include: { milestone: { include: { project: true } } },
  });
  if (!spec) return new Response("Spec not found", { status: 404 });

  const project = spec.milestone.project;
  const contextLines = [
    `Project: ${project.name}`,
    project.stack ? `Stack: ${project.stack}` : null,
    project.builtFeatures ? `Already built: ${project.builtFeatures}` : null,
    `Milestone: ${spec.milestone.name}`,
    `Task: ${spec.specName}`,
    `Description: ${spec.specContent}`,
    Array.isArray(spec.acceptanceCriteria) && spec.acceptanceCriteria.length > 0
      ? `Acceptance criteria:\n${(spec.acceptanceCriteria as string[]).map(c => `- ${c}`).join("\n")}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let fullPrompt = "";

      const anthropicStream = anthropic.messages.stream({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: PROMPT_SYSTEM,
        messages: [{ role: "user", content: contextLines }],
      });

      for await (const event of anthropicStream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          fullPrompt += event.delta.text;
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }

      // Persist the generated prompt to the spec
      await prisma.milestoneSpec.update({
        where: { id: specId },
        data: { generatedPrompt: fullPrompt, promptModel: "claude-sonnet-4-20250514" },
      });

      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Transfer-Encoding": "chunked" },
  });
}
