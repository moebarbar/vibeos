import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";

function buildSystem(userPlan: string): string {
  const planGuidance = userPlan === "FOUNDER"
    ? `The user is a FOUNDER building a serious, scalable product. Generate 14–18 cards covering: core infrastructure, all major features, billing/subscriptions, analytics & monitoring, team/multi-user features, performance optimization, security hardening, and scale-readiness. Include enterprise-grade tasks.`
    : userPlan === "PRO"
    ? `The user is PRO building a polished SaaS. Generate 12–15 cards covering: core features, auth & billing, key integrations, polish & UX, error handling, analytics, and a few growth features.`
    : `The user is early-stage (FREE plan). Generate 8–12 cards laser-focused on the core MVP value proposition. Skip nice-to-haves. Prioritize what gets them to a working, shippable product.`;

  return `You are an expert software project manager working with vibe coders building SaaS products.

Given a project name and description, break it down into a realistic Kanban board.

${planGuidance}

IMPORTANT — Cover progression from basic to advanced:
- Foundation cards (importance 8–10): auth, database schema, core infrastructure — these MUST ship first
- Core MVP cards (importance 6–9): the features that define what the product IS
- Enhancement cards (importance 4–7): polish, integrations, analytics
- Advanced cards (importance 2–5, FOUNDER/PRO only): scale, team features, monitoring

Distribute cards across three columns:
- "plan": tasks not yet started
- "in_progress": tasks actively being built
- "done": tasks typically completed early (initial setup, boilerplate)

For each card, write an "aiPrompt" — a detailed, ready-to-use implementation prompt a developer can paste directly into Cursor or Claude Code. Include: exact goal, files to create/modify, step-by-step approach, key patterns, edge cases.

Respond ONLY with valid JSON array, no markdown, no explanation:
[
  {
    "title": "Short task title",
    "description": "1–2 sentence description",
    "column": "plan" | "in_progress" | "done",
    "importance": <1-10 integer>,
    "effort": "quick-win" | "medium" | "heavy-lift",
    "tags": "optional,comma,separated,tags",
    "aiPrompt": "Full detailed implementation prompt..."
  }
]`;
}

export async function POST(req: NextRequest) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return new Response("Not found", { status: 404 });

  const { projectId, projectDescription, projectName, userPlan } = await req.json();
  if (!projectDescription?.trim()) return new Response("Missing project description", { status: 400 });

  // Verify project ownership
  if (projectId) {
    const project = await prisma.project.findFirst({ where: { id: projectId, userId: user.id } });
    if (!project) return new Response("Project not found", { status: 404 });
  }

  try {
    const plan = (userPlan as string | undefined) ?? "FREE";
    const message = await new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }).messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      system: buildSystem(plan),
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
      importance?: number;
      effort?: string;
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
          // Encode importance and effort into tags
          const tagParts = (c.tags ?? "").split(",").map((t: string) => t.trim()).filter(Boolean);
          if (c.importance) tagParts.push(`importance:${c.importance}`);
          if (c.effort) tagParts.push(`effort:${c.effort}`);
          const tags = tagParts.join(",") || null;

          return prisma.kanbanCard.create({
            data: {
              projectId,
              title: c.title,
              description: c.description,
              column: col,
              position,
              aiPrompt: c.aiPrompt,
              tags,
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
