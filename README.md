# VIbeOS

An AI-powered SaaS platform for vibe coders. Six AI agents + Element Forge — a curated UI component library where every component is a showcase piece.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14.2.35, TypeScript |
| Styling | Tailwind (layout only) + inline styles (components) |
| Database | PostgreSQL via Railway, Prisma ORM |
| Auth | Supabase |
| AI | Anthropic Claude API (`@anthropic-ai/sdk`) |
| Billing | Stripe |
| Email | Resend |
| Deploy | Railway (watches `main` branch) |

---

## Routing

```
app/
  (landing)/page.tsx          → /             (public landing page)
  (dashboard)/
    layout.tsx                → shared dashboard shell
    dashboard/
      page.tsx                → /dashboard
      forge/page.tsx          → /dashboard/forge   ← ACTIVE forge page
      projects/page.tsx       → /dashboard/projects
      agents/[id]/page.tsx    → /dashboard/agents/[id]
      templates/page.tsx      → /dashboard/templates (legacy)
    forge/page.tsx            → /forge  (duplicate, kept in sync with dashboard/forge)
```

> **Important**: The sidebar links to `/dashboard/*`. Always edit `app/(dashboard)/dashboard/forge/page.tsx` first, then `cp` to `app/(dashboard)/forge/page.tsx`.

---

## Element Forge

The core product differentiator. A UI component library with AI-powered recommendations.

### File locations
- **Elements**: `lib/elements.ts` — `ELEMENTS` record, `CATEGORIES`, `VIBES`
- **Templates**: `lib/templates.ts` — `TEMPLATES` record, `TEMPLATE_CATEGORIES`
- **Page**: `app/(dashboard)/dashboard/forge/page.tsx`
- **AI recommend API**: `app/api/agents/forge_recommend/route.ts` (Claude Haiku, returns 6 picks as JSON)

### Element structure
```typescript
interface Element {
  id: string;
  name: string;
  vibe: string;         // "Dark & Minimal" | "Pastel & Soft" | "Brutalist" | etc.
  difficulty: string;   // "Simple" | "Medium" | "Advanced"
  desc: string;
  prompt: string;       // AI-ready prompt to paste into Cursor/Claude/v0
  code: string;         // Full self-contained React component (copy-paste ready)
  preview: () => JSX.Element;  // Live mini preview rendered in detail panel
}
```

### Template structure
```typescript
interface Template {
  id: string;
  name: string;
  vibe: string;
  difficulty: string;
  desc: string;
  vars: { key: string; label: string; default: string }[];
  thumbnail: string;
  component: (vars: Record<string, string>) => React.ComponentType;
  codeTemplate: (vars: Record<string, string>) => string;
}
```

### Adding a new element — workflow
1. User sends a component concept or code
2. Decide category: `buttons` | `cards` | `hero` | `nav` | `forms` | `dashboards`
3. Write/polish the component following the **Component Quality Standard** below
4. Add to the correct category array in `lib/elements.ts`
5. Sync both forge page files: `cp app/(dashboard)/dashboard/forge/page.tsx app/(dashboard)/forge/page.tsx`
6. Commit and push to `main`

---

## ⚡ Component Quality Standard — NON-NEGOTIABLE

> Every component is a **marketing moment**. A user might sign up solely because one component blew them away. Generic "AI-generated look" components actively hurt the brand.

**Before shipping any component, ask:** *Would a senior designer screenshot this and share it?*

### Required creative ingredients (pick at least one unexpected one per component)
- Multi-layer glow or dual-tone colored shadows
- Micro-animation (entrance, hover, pulse, shimmer)
- Glassmorphism with inner light refraction
- Animated gradient border (rotating conic-gradient)
- 3D perspective tilt on hover
- Noise/grain texture overlay
- Magnetic hover (transform based on mouse proximity)
- Split typography with gradient mask clip
- Staggered entrance animations
- Glitch / chromatic aberration for bold brands
- Watercolor blob soft light mode
- Layered masked backgrounds

### Rules
- **Inline styles only** — no Tailwind classes inside component `code` — ensures portability
- **Self-contained** — only `react` and optionally `lucide-react` imports allowed in `code`
- Every component must feel **different** from others in the same category
- Each component must evoke a specific emotion: power / calm / trust / urgency / delight / luxury / raw energy
- The `preview()` function should render a convincing mini version (scaled to fit the 150px preview box)

---

## AI Agents

| Agent | Route | Model |
|---|---|---|
| Project Brain | `/api/agents/brain` | Claude Sonnet |
| Prompt Architect | `/api/agents/prompt` | Claude Sonnet |
| Build Ledger | `/api/agents/ledger` | Claude Haiku |
| Debug Translator | `/api/agents/debug` | Claude Sonnet |
| What's Next Engine | `/api/agents/next` | Claude Sonnet |
| Platform Advisor | `/api/agents/advisor` | Claude Sonnet |
| Forge Recommend | `/api/agents/forge_recommend` | Claude Haiku |

Agent metadata + system prompts: `lib/agents.ts`

---

## Environment Variables

```env
ANTHROPIC_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
DATABASE_URL=
NEXT_PUBLIC_APP_URL=
```

---

## Dev

```bash
npm run dev          # start dev server
npm run db:push      # push schema changes
npm run db:studio    # open Prisma Studio
npm run build        # prisma generate + next build
```

---

## Deploy

Railway watches the `main` branch. Push to `main` to trigger a deploy.

Build command: `prisma generate && next build`
Start command: `npx prisma migrate deploy && next start`

> Feature branches do **not** trigger Railway deploys. Always merge to `main`.

---

## Build Kit

Users can save elements to a "Build Kit" stored in `localStorage` under key `"vos-kit"`. The kit exports all saved element code at once. No server storage — fully client-side.
