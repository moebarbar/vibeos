import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";

/**
 * POST /api/agent/onboard
 * Saves enriched project data from the onboarding intake form,
 * initializes the AI agent for the project, and queues milestone generation.
 */
export async function POST(req: NextRequest) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const {
    projectId,
    vision,
    industry,
    targetUsers,
    businessModel,
    launchTimeline,
    stack,
    builtFeatures,
  } = await req.json();

  if (!projectId) return new Response("projectId required", { status: 400 });

  const user = await prisma.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return new Response("User not found", { status: 404 });

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) return new Response("Project not found", { status: 404 });

  // Update project with onboarding data
  const updated = await prisma.project.update({
    where: { id: projectId },
    data: {
      vision: vision ?? project.vision,
      industry: industry ?? project.industry,
      targetUsers: targetUsers ?? project.targetUsers,
      businessModel: businessModel ?? project.businessModel,
      launchTimeline: launchTimeline ?? project.launchTimeline,
      stack: stack ?? project.stack,
      builtFeatures: builtFeatures ?? project.builtFeatures,
    },
  });

  // Initialize AI agent if not exists
  const agent = await prisma.aiAgent.upsert({
    where: { projectId },
    create: { projectId },
    update: { lastActiveAt: new Date() },
  });

  // Seed first agent memory with project context
  const existingMemories = await prisma.agentMemory.count({ where: { agentId: agent.id } });
  if (existingMemories === 0) {
    await prisma.agentMemory.create({
      data: {
        agentId: agent.id,
        memoryType: "constraint",
        content: {
          summary: "Initial project setup",
          detail: `Project "${project.name}" onboarded. Vision: ${vision ?? "not set"}. Stack: ${stack ?? "not set"}. Launch timeline: ${launchTimeline ?? "not set"}.`,
        },
        confidence: 1.0,
      },
    });
  }

  // Log onboarding to progress
  await prisma.progressLog.create({
    data: {
      projectId,
      logType: "check_in",
      content: { event: "onboarding_complete", timestamp: new Date().toISOString() },
    },
  });

  return new Response(
    JSON.stringify({ project: updated, agent, message: "Project onboarded successfully" }),
    { headers: { "Content-Type": "application/json" } }
  );
}
