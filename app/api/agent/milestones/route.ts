import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MILESTONE_SYSTEM_PROMPT = `You are a senior technical project manager breaking a software project into a clear build plan.

Given a project description, generate an ordered list of milestones that take the project from zero to launch.

Output a JSON array. Each milestone:
{
  "name": "short milestone name",
  "description": "1-2 sentence description of what gets built",
  "estimatedHours": number (realistic engineering hours),
  "specs": [
    {
      "specName": "specific task name",
      "specContent": "detailed description of exactly what to implement",
      "acceptanceCriteria": ["criterion 1", "criterion 2", "criterion 3"]
    }
  ]
}

Rules:
- 5–10 milestones total, ordered by dependency
- Each milestone has 2–5 specs
- Be specific to the actual project, not generic
- Specs should be small enough for a single AI coding session
- Start with foundation (auth, DB, core data model), end with launch (billing, polish)
- Output ONLY valid JSON array. No markdown, no explanation.`;

export async function POST(req: NextRequest) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const { projectId } = await req.json();
  if (!projectId) return new Response("projectId required", { status: 400 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return new Response("User not found", { status: 404 });

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) return new Response("Project not found", { status: 404 });

  const projectDescription = [
    `Project: ${project.name}`,
    project.description ? `Description: ${project.description}` : null,
    project.vision ? `Vision: ${project.vision}` : null,
    project.industry ? `Industry: ${project.industry}` : null,
    project.targetUsers ? `Target users: ${project.targetUsers}` : null,
    project.businessModel ? `Business model: ${project.businessModel}` : null,
    project.stack ? `Tech stack: ${project.stack}` : null,
    project.builtFeatures ? `Already built: ${project.builtFeatures}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const result = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: MILESTONE_SYSTEM_PROMPT,
    messages: [{ role: "user", content: projectDescription }],
  });

  const text = result.content[0].type === "text" ? result.content[0].text.trim() : "[]";

  let milestoneData: Array<{
    name: string;
    description: string;
    estimatedHours: number;
    specs: Array<{
      specName: string;
      specContent: string;
      acceptanceCriteria: string[];
    }>;
  }>;

  try {
    milestoneData = JSON.parse(text);
  } catch {
    return new Response(JSON.stringify({ error: "Failed to parse AI response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Delete existing milestones if regenerating
  await prisma.milestone.deleteMany({ where: { projectId } });

  // Create all milestones + specs
  const created = await Promise.all(
    milestoneData.map((m, i) =>
      prisma.milestone.create({
        data: {
          projectId,
          name: m.name,
          description: m.description,
          milestoneOrder: i,
          estimatedHours: m.estimatedHours,
          specs: {
            create: m.specs.map(s => ({
              specName: s.specName,
              specContent: s.specContent,
              acceptanceCriteria: s.acceptanceCriteria,
            })),
          },
        },
        include: { specs: true },
      })
    )
  );

  // Log to progress
  await prisma.progressLog.create({
    data: {
      projectId,
      logType: "milestone_complete",
      content: { event: "milestones_generated", count: created.length },
    },
  });

  return new Response(JSON.stringify({ milestones: created }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(req: NextRequest) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) return new Response("projectId required", { status: 400 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return new Response("User not found", { status: 404 });

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) return new Response("Project not found", { status: 404 });

  const milestones = await prisma.milestone.findMany({
    where: { projectId },
    orderBy: { milestoneOrder: "asc" },
    include: { specs: { orderBy: { createdAt: "asc" } } },
  });

  return new Response(JSON.stringify({ milestones }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function PATCH(req: NextRequest) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const { milestoneId, status } = await req.json();
  if (!milestoneId || !status) return new Response("milestoneId and status required", { status: 400 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return new Response("User not found", { status: 404 });

  const milestone = await prisma.milestone.findFirst({
    where: { id: milestoneId, project: { userId: user.id } },
  });
  if (!milestone) return new Response("Milestone not found", { status: 404 });

  const updated = await prisma.milestone.update({
    where: { id: milestoneId },
    data: { status },
    include: { specs: true },
  });

  if (status === "done") {
    await prisma.progressLog.create({
      data: {
        projectId: milestone.projectId,
        milestoneId: milestone.id,
        logType: "milestone_complete",
        content: { milestoneName: milestone.name },
      },
    });
  }

  return new Response(JSON.stringify({ milestone: updated }), {
    headers: { "Content-Type": "application/json" },
  });
}
