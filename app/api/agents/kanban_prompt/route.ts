import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getUser } from "@/lib/supabase/server";

const SYSTEM = `You are a senior software engineer writing implementation prompts for AI coding assistants (Cursor, Claude Code, v0).

Given a task title, description, and optional project context, produce a detailed, ready-to-use implementation prompt that a developer can paste directly into their AI coding tool.

Your prompt must include:
1. **Goal** — precise statement of what needs to be built
2. **Files to create or modify** — list with brief reason for each
3. **Implementation steps** — numbered, specific, actionable
4. **Key patterns to follow** — code style, naming, architecture decisions
5. **Edge cases & error handling** — what could go wrong and how to handle it
6. **Definition of done** — how to verify the task is complete

Write the prompt as if you're giving instructions directly to a skilled AI coder. Be specific, not vague. Reference actual file paths, function names, and data structures where relevant.

Output only the prompt text, no preamble, no explanation. Start directly with the content.`;

export async function POST(req: NextRequest) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const { title, description, projectContext } = await req.json();
  if (!title?.trim()) return new Response("Missing title", { status: 400 });

  const userMessage = [
    `Task: ${title}`,
    description ? `Description: ${description}` : null,
    projectContext ? `\nProject context:\n${projectContext}` : null,
  ].filter(Boolean).join("\n");

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        const streamMsg = await anthropic.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 2000,
          system: SYSTEM,
          messages: [{ role: "user", content: userMessage }],
        });

        for await (const event of streamMsg) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(new TextEncoder().encode(event.delta.text));
          }
        }
      } catch {
        // stream ends
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Transfer-Encoding": "chunked" },
  });
}
