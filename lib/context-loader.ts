import { prisma } from "@/lib/prisma";

/**
 * Loads the full project context for the AI agent in a single optimized query.
 * Assembles everything the agent needs to have a fully-informed conversation.
 */
export async function loadAgentContext(projectId: string) {
  const [project, milestones, recentProgress, recentMessages, recentFiles] =
    await Promise.all([
      prisma.project.findUnique({
        where: { id: projectId },
        include: { aiAgent: true },
      }),
      prisma.milestone.findMany({
        where: { projectId },
        orderBy: { milestoneOrder: "asc" },
        include: { specs: { orderBy: { createdAt: "asc" } } },
      }),
      prisma.progressLog.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.conversationMessage.findMany({
        where: { projectId },
        orderBy: { createdAt: "asc" },
        take: 30,
      }),
      prisma.projectFile.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  if (!project) return null;

  const completedMilestones = milestones.filter(m => m.status === "done").length;
  const currentMilestone = milestones.find(m => m.status === "in_progress") ??
    milestones.find(m => m.status === "pending") ?? null;

  const totalDays = Math.floor(
    (Date.now() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  const lastActivity = recentProgress[0]?.createdAt ?? recentMessages.at(-1)?.createdAt ?? project.updatedAt;
  const daysSinceLastActivity = Math.floor(
    (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Get agent memories - need to go through agent
  const agentMemories = project.aiAgent
    ? await prisma.agentMemory.findMany({
        where: { agentId: project.aiAgent.id },
        orderBy: { confidence: "desc" },
        take: 20,
      })
    : [];

  return {
    project: {
      id: project.id,
      name: project.name,
      description: project.description,
      vision: project.vision,
      industry: project.industry,
      targetUsers: project.targetUsers,
      businessModel: project.businessModel,
      stack: project.stack,
      status: project.status,
      builtFeatures: project.builtFeatures,
      decisions: project.decisions,
    },
    agent: project.aiAgent
      ? {
          id: project.aiAgent.id,
          totalInteractions: project.aiAgent.totalInteractions,
          lastActiveAt: project.aiAgent.lastActiveAt,
          agentPersonality: project.aiAgent.agentPersonality,
        }
      : null,
    memory: agentMemories.map(m => ({
      type: m.memoryType,
      content: m.content,
      confidence: m.confidence,
    })),
    milestones: milestones.map(m => ({
      id: m.id,
      name: m.name,
      description: m.description,
      order: m.milestoneOrder,
      status: m.status,
      estimatedHours: m.estimatedHours,
      specsCount: m.specs.length,
      specsCompleted: m.specs.filter(s => s.status === "done").length,
    })),
    currentMilestone: currentMilestone
      ? {
          ...currentMilestone,
          specs: currentMilestone.specs,
        }
      : null,
    recentProgress: recentProgress.map(p => ({
      type: p.logType,
      content: p.content,
      date: p.createdAt,
    })),
    conversationHistory: recentMessages.map(m => ({
      role: m.role,
      content: m.content,
      date: m.createdAt,
    })),
    recentFiles: recentFiles.map(f => ({
      name: f.fileName,
      type: f.fileType,
      analysis: f.analysisResult,
      date: f.createdAt,
    })),
    stats: {
      totalDays,
      completedMilestones,
      totalMilestones: milestones.length,
      progressPercentage:
        milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0,
      daysSinceLastActivity,
    },
  };
}

export type AgentContext = Awaited<ReturnType<typeof loadAgentContext>>;

/**
 * Builds the system prompt string injected before every agent conversation.
 */
export function buildAgentSystemPrompt(ctx: NonNullable<AgentContext>): string {
  const { project, memory, milestones, currentMilestone, stats } = ctx;

  const memoryBlock =
    memory.length > 0
      ? memory
          .map(m => `[${m.type.toUpperCase()}] ${JSON.stringify(m.content)}`)
          .join("\n")
      : "No memories yet.";

  const milestonesBlock =
    milestones.length > 0
      ? milestones
          .map(
            m =>
              `${m.order}. ${m.name} [${m.status}] — ${m.specsCompleted}/${m.specsCount} specs done`
          )
          .join("\n")
      : "No milestones generated yet.";

  const currentBlock = currentMilestone
    ? `Current milestone: "${currentMilestone.name}"\nSpecs:\n${currentMilestone.specs
        .map(s => `  - ${s.specName} [${s.status}]`)
        .join("\n")}`
    : "No active milestone.";

  return `You are the AI Cofounder for the project "${project.name}".

You are NOT a generic AI assistant. You are the dedicated, persistent intelligence that has been with this project from day one. You remember everything, you know what was built, what broke, what was decided, and what comes next.

## PROJECT CONTEXT
- **Project**: ${project.name}
- **Vision**: ${project.vision ?? project.description}
- **Industry**: ${project.industry ?? "Not specified"}
- **Target Users**: ${project.targetUsers ?? "Not specified"}
- **Business Model**: ${project.businessModel ?? "Not specified"}
- **Stack**: ${project.stack ?? "Not specified"}
- **Status**: ${project.status}
- **Days Active**: ${stats.totalDays}
- **Progress**: ${stats.progressPercentage}% (${stats.completedMilestones}/${stats.totalMilestones} milestones)
- **Days Since Last Activity**: ${stats.daysSinceLastActivity}

## WHAT'S BEEN BUILT
${project.builtFeatures ?? "Nothing logged yet."}

## KEY DECISIONS
${project.decisions ?? "No decisions logged yet."}

## AGENT MEMORY (what I know about this founder)
${memoryBlock}

## BUILD PLAN
${milestonesBlock}

## RIGHT NOW
${currentBlock}

## YOUR PERSONALITY
You speak like a brilliant technical cofounder — direct, confident, zero fluff. You give sharp answers, not long explanations. You remember the project deeply. You push the founder to keep moving. You celebrate wins quickly and get right back to what matters.

When the founder asks what to build next, you know — because you have the full context.
When they share code or errors, you diagnose with precision.
When they're stuck, you break it down into the single next action.

Never say "as an AI" or "I don't have access to". You have full context. Act like it.`;
}
