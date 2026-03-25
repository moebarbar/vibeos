import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getUser } from "@/lib/supabase/server";

// Compact element + template catalog for the AI to reason about
const CATALOG = {
  elements: [
    { id: "btn-neon",          cat: "buttons",    name: "Neon Glow CTA",             desc: "Pulsing neon green button with glow animation. Great for dark SaaS CTAs." },
    { id: "btn-pastel",        cat: "buttons",    name: "Soft Gradient Pill",         desc: "Smooth pink-purple gradient pill button. Ideal for light-themed products." },
    { id: "btn-brutal",        cat: "buttons",    name: "Brutalist Block",            desc: "Raw black button with solid shadow press effect. Bold brand identity." },
    { id: "btn-glass",         cat: "buttons",    name: "Glassmorphism Button",       desc: "Frosted glass button over gradient. Modern and premium feel." },
    { id: "card-pricing-dark", cat: "cards",      name: "Dark Pricing Card",          desc: "SaaS pricing card with features list, plan badge, and CTA button." },
    { id: "card-glass-feature",cat: "cards",      name: "Glass Feature Card",         desc: "Glassmorphism feature card ideal for landing pages feature sections." },
    { id: "card-stat",         cat: "cards",      name: "Dark Stat Card",             desc: "Dashboard KPI/metric card with trend badge and sparkline chart." },
    { id: "card-pastel",       cat: "cards",      name: "Pastel Feature Card",        desc: "Soft white feature card with hover lift. For light-themed landing pages." },
    { id: "hero-dark",         cat: "hero",       name: "Dark SaaS Hero",             desc: "Full-viewport dark hero section with dot grid, glow, badge, social proof." },
    { id: "hero-gradient",     cat: "hero",       name: "Gradient Startup Hero",      desc: "Centered pastel gradient hero, soft aesthetic, great for B2C products." },
    { id: "nav-dark",          cat: "nav",        name: "Dark SaaS Navbar",           desc: "Sticky dark navbar with blur backdrop, center links, and CTA button." },
    { id: "nav-light",         cat: "nav",        name: "Light Pill Nav",             desc: "Clean white navbar with pill-style active states and user avatar." },
    { id: "form-auth-dark",    cat: "forms",      name: "Dark Auth Form",             desc: "Complete dark login/signup form with password toggle and OAuth button." },
    { id: "form-float",        cat: "forms",      name: "Floating Label Input",       desc: "Input with animated floating label, error/success states." },
    { id: "dash-saas",         cat: "dashboards", name: "SaaS Metrics Dashboard",     desc: "Full dark dashboard: sidebar, 4 KPI cards, SVG chart, activity feed." },
    { id: "dash-analytics",    cat: "dashboards", name: "Light Analytics Panel",      desc: "Pastel analytics: metric cards, area chart, funnel, traffic sources." },
  ],
  templates: [
    { id: "l1", cat: "landing",   name: "Dark Minimal SaaS Hero",   desc: "Full customizable dark hero: product name, headline, CTA, accent color." },
    { id: "a1", cat: "auth",      name: "Full Auth Flow",           desc: "Login, signup, forgot password — fully interactive, customizable branding." },
    { id: "d1", cat: "dashboard", name: "SaaS Metrics Dashboard",   desc: "Complete dashboard template: sidebar, KPI cards, revenue chart. Customizable." },
  ],
};

const SYSTEM = `You are the Element Forge AI inside VIbeOS — an AI tool that recommends UI components and page templates for vibe coders building SaaS products.

Given a project context brief, pick the 6 most relevant and useful items from the catalog below. Consider:
- The product type and target audience
- Visual aesthetic (dark/light, minimal/colorful)
- What stage of building they're at (early = hero + auth + nav; growth = dashboard + pricing)
- What components they'd actually use first this week

Respond ONLY with valid JSON in this exact format, no other text:
{
  "picks": [
    {"id": "item-id", "category": "category", "name": "Item Name", "type": "element", "reason": "One concrete sentence why this fits their specific project"},
    ...
  ]
}

Available catalog:
ELEMENTS: ${JSON.stringify(CATALOG.elements)}
TEMPLATES: ${JSON.stringify(CATALOG.templates)}

Return exactly 6 picks. Mix elements and templates. Use "type": "element" or "type": "template".`;

export async function POST(req: NextRequest) {
  const supabaseUser = await getUser();
  if (!supabaseUser) return new Response("Unauthorized", { status: 401 });

  const { projectContext } = await req.json();
  if (!projectContext?.trim()) return Response.json({ picks: [] });

  try {
    const message = await new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }).messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      system: SYSTEM,
      messages: [{ role: "user", content: `Project context:\n${projectContext}` }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "{}";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const data = jsonMatch ? JSON.parse(jsonMatch[0]) : { picks: [] };
    return Response.json(data);
  } catch {
    return Response.json({ picks: [] });
  }
}
