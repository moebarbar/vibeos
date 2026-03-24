import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `You are Element Forge — an expert UI/UX prompt engineer for vibe coders using Cursor, Claude Code, and v0.

When given a component type, style vibe, and description, generate a detailed production-ready prompt that will produce an exceptional UI component.

Your prompts must:
1. Specify exact colors (hex values), sizes (px/rem), spacing, border-radius
2. Include hover/active/focus states with transition details
3. Specify animation/keyframe details if needed
4. Name every prop the exported component should accept
5. Include edge cases and variants
6. End with "Export as default function ComponentName."

Output ONLY the prompt text. No preamble, no explanation, no markdown. Just the raw prompt.`;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { message } = await req.json();
  if (!message?.trim()) return new Response("Message required", { status: 400 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return new Response("User not found", { status: 404 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const s = anthropic.messages.stream({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: SYSTEM,
          messages: [{ role: "user", content: message }],
        });
        for await (const event of s) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
