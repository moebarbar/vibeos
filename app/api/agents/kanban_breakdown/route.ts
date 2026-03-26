import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";

const SYSTEM = `You are an expert software project manager working with vibe coders building SaaS products.

Given a project name and description, break it down into a realistic Kanban board with 8–15 cards.

Distribute cards across three columns:
- "plan": tasks not yet started (architecture, design decisions, setup)
- "in_progress": tasks actively being built (core features, integrations)
- "done": tasks typically completed early (initial setup, boilerplate, basic config)

For each card, write an "aiPrompt" — a detailed, ready-to-use implementation prompt a developer can paste directly into Cursor or Claude Code to implement that specific task. The prompt should include:
- The exact goal
- Files to create or modify
- Step-by-step implementation approach
- Key patterns or interfaces to follow
- Edge cases and error handling

Respond ONLY with valid JSON array, no markdown, no explanation:
[
  {
    "title": "Short task title",
    "description": "1–2 sentence description of what this task covers",
    "column": "plan" | "in_progress" | "done",
    "tags": "optional,comma,separated,tags",
    "aiPrompt": "Full detailed implementation prompt..."
  }
]`;

export async function POST(req: NextRequest) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return new Response("Not found", { status: 404 });

  const { projectId, projectDescription, projectName } = await req.json();
  if (!projectDescription?.trim()) return new Response("Missing project description", { status: 400 });

  // Verify project ownership
  if (projectId) {
    const project = await prisma.project.findFirst({ where: { id: projectId, userId: user.id } });
    if (!project) return new Response("Project not found", { status: 404 });
  }

  try {
    const message = await new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }).messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      system: SYSTEM,
      messages: [{
        role: "user",
        content: `Project name: ${projectName ?? "My Project"}\n\nProject description:\n${projectDescription}`,
      }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "[]";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return Response.json({ cards: [] });

    const rawCards = JSON.parse(jsonMatch[0]) as {
      title: string;
      description?: string;
      column?: string;
      tags?: string;
      aiPrompt?: string;
    }[];

    // Persist to DB if projectId provided
    let createdCards: object[] = [];
    if (projectId) {
      // Get current max positions per column
      const existing = await prisma.kanbanCard.findMany({
        where: { projectId },
        select: { column: true, position: true },
      });
      const maxPos: Record<string, number> = {};
      existing.forEach(c => {
        maxPos[c.column] = Math.max(maxPos[c.column] ?? -1, c.position);
      });

      const colCounters: Record<string, number> = {};
      createdCards = await Promise.all(
        rawCards.map(async (c) => {
          const col = ["plan", "in_progress", "done"].includes(c.column ?? "") ? c.column! : "plan";
          colCounters[col] = (colCounters[col] ?? 0) + 1;
          const position = (maxPos[col] ?? -1) + colCounters[col];
          return prisma.kanbanCard.create({
            data: {
              projectId,
              title: c.title,
              description: c.description,
              column: col,
              position,
              aiPrompt: c.aiPrompt,
              tags: c.tags,
            },
          });
        })
      );
    } else {
      createdCards = rawCards;
    }

    return Response.json({ cards: createdCards });
  } catch {
    return Response.json({ cards: [] });
  }
}
