import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MEMORY_EXTRACTION_PROMPT = `You are a memory extractor for an AI Cofounder system. Analyze this conversation exchange and extract any notable information worth remembering long-term.

Return a JSON array of memories. Each memory:
{
  "memoryType": "decision" | "risk" | "user_preference" | "pattern" | "learned_behavior" | "constraint" | "blocker",
  "content": { "summary": "...", "detail": "..." },
  "confidence": 0.0–1.0
}

Only extract memories that are:
- Decisions made (tech choices, architecture, scope)
- Risks identified or concerns raised
- User preferences (how they like to work, what they hate)
- Patterns observed (how they approach problems)
- Blockers they hit
- Constraints (budget, time, team size)

Return [] if there is nothing worth remembering.
Return ONLY valid JSON array. No explanation, no markdown.`;

export async function extractAndSaveMemories(
  agentId: string,
  userMessage: string,
  assistantResponse: string
): Promise<void> {
  try {
    const result = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: MEMORY_EXTRACTION_PROMPT,
      messages: [
        {
          role: "user",
          content: `USER: ${userMessage}\n\nASSISTANT: ${assistantResponse}`,
        },
      ],
    });

    const text = result.content[0].type === "text" ? result.content[0].text.trim() : "[]";
    const memories = JSON.parse(text) as Array<{
      memoryType: string;
      content: Record<string, string>;
      confidence: number;
    }>;

    if (!Array.isArray(memories) || memories.length === 0) return;

    await prisma.agentMemory.createMany({
      data: memories.map(m => ({
        agentId,
        memoryType: m.memoryType,
        content: m.content,
        confidence: Math.max(0, Math.min(1, m.confidence)),
      })),
    });
  } catch {
    // Memory extraction is non-critical — fail silently
  }
}
