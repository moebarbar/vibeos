import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getUser } from "@/lib/supabase/server";

const SYSTEM = `You are a senior product strategist and engineer. Given a Kanban card (task) and project context, provide a structured value analysis.

Respond ONLY with valid JSON — no markdown, no explanation:
{
  "importanceScore": <1-10 integer, where 10 = existential to the product>,
  "impactLevel": "critical" | "high" | "medium" | "low",
  "valueStatement": "<1–2 sentences: WHY this feature matters to the product's success>",
  "effortLevel": "quick-win" | "medium" | "heavy-lift",
  "effortHours": "<estimate like '2–4 hrs', '1–2 days', '3–5 days'>",
  "businessImpact": "<What this concretely unlocks or enables for users/revenue/retention>",
  "suggestedPriority": "high" | "medium" | "low",
  "unlocksNext": "<What features or capabilities become possible AFTER this is built>",
  "blockedBy": "<What must exist BEFORE this can be built, or 'Nothing — can start immediately'>",
  "recommendation": "<1 sentence actionable recommendation: should they build this now, defer it, or skip it?>"
}`;

export async function POST(req: NextRequest) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const { title, description, projectContext, projectStack, userPlan } = await req.json();
  if (!title) return new Response("Missing title", { status: 400 });

  const planContext = userPlan === "FOUNDER"
    ? "The user is a FOUNDER — they are building a serious, scalable product. Prioritize features that establish competitive moat, team collaboration, and enterprise readiness."
    : userPlan === "PRO"
    ? "The user is PRO — they are building a polished SaaS product. Prioritize features that drive retention, monetization, and product quality."
    : "The user is on the FREE plan — they are likely early-stage. Prioritize features that validate the core value proposition and get to a shippable MVP.";

  const userMessage = [
    `Task: ${title}`,
    description ? `Description: ${description}` : null,
    projectContext ? `Project context: ${projectContext}` : null,
    projectStack ? `Tech stack: ${projectStack}` : null,
    `User plan: ${userPlan ?? "FREE"}. ${planContext}`,
  ].filter(Boolean).join("\n\n");

  try {
    const message = await new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }).messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "{}";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return Response.json({ error: "Parse error" }, { status: 500 });

    return Response.json(JSON.parse(jsonMatch[0]));
  } catch {
    return Response.json({ error: "Analysis failed" }, { status: 500 });
  }
}
