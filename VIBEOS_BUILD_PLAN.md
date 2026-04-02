# VIBE OS — Complete Build Plan
**AI Cofounder Platform | 47 Prompts | 6-Week Sprint**

> The moat: Claude forgets you. Vibe OS never does.

---

## WHAT WE'RE BUILDING

Vibe OS is not a code editor. It's an **AI Cofounder** — a persistent intelligent agent that lives inside every project, remembers everything, builds the plan, tracks progress, generates perfect prompts, and holds founders accountable from idea to launch.

**Core differentiators:**
- Every project gets ONE persistent AI agent assigned permanently
- Agent loads full project context before every single interaction
- Agent remembers what you built, what broke, what you decided, and what's next
- Agent generates perfect code-generation prompts for Cursor, Bolt, Lovable
- Agent checks in weekly — asks what you built, analyzes it, tells you the next step
- Community shows what other founders built with similar projects

---

## TECH STACK

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + React + TypeScript + TailwindCSS |
| Backend | Node.js + Express + PostgreSQL |
| Database | Supabase (PostgreSQL) |
| AI | Claude Sonnet via Anthropic API (primary) + GPT-4o (fallback) |
| File Storage | Supabase Storage or AWS S3 |
| Auth | Supabase Auth (JWT) |
| Deployment | Vercel (frontend) + Railway (backend) |
| Real-time | Supabase Realtime |

---

## 6-WEEK SPRINT OVERVIEW

| Week | Focus | Prompts |
|------|-------|---------|
| 1 | Database + Backend Foundation | 1–8 |
| 2 | Agent Core + Context System | 9–16 |
| 3 | Project Planning Agent | 17–24 |
| 4 | Frontend + Agent UI | 25–32 |
| 5 | Progress Tracking + Check-ins | 33–40 |
| 6 | Polish + Launch | 41–47 |

---

## SECTION 1: DATABASE DESIGN (Prompts 1–3)

### Database Requirements
- Agent must load full project context in **under 500ms**
- All historical data is **append-only** (immutable logs)
- Must support **100,000 concurrent projects**
- Use **UUIDs** for all primary keys
- Include proper indexes for all foreign keys and query patterns

### 12 Database Tables

| Table | Purpose |
|-------|---------|
| `users` | email, name, password_hash, subscription_tier (free/pro/enterprise), preferences JSONB |
| `projects` | user_id, name, description, vision, industry, target_users, business_model, launch_timeline, status |
| `ai_agents` | project_id (UNIQUE), last_active_at, total_interactions, system_prompt_version, agent_personality JSONB |
| `agent_memory` | agent_id, memory_type (user_preference/risk/decision/pattern/learned_behavior/constraint/blocker), content JSONB, confidence FLOAT |
| `project_context` | **APPEND ONLY** — project_id, context_version, full_context JSONB |
| `milestones` | project_id, name, description, milestone_order, estimated_hours, actual_hours, status, target_date |
| `milestone_specs` | milestone_id, spec_name, spec_content, acceptance_criteria JSONB, generated_prompt, prompt_model, status |
| `progress_log` | **APPEND ONLY** — project_id, milestone_id, log_type, content JSONB |
| `conversation_history` | project_id, role (user/assistant/system), content, message_metadata JSONB |
| `project_files` | project_id, file_name, file_type, file_url, analysis_result JSONB |
| `notifications` | user_id, project_id, notification_type, title, content, is_read, action_url |
| `community_showcase` | project_id, user_id, is_public, headline, demo_url, views, likes, industry_tag |

### Also Generate
- All `CREATE INDEX` statements for every foreign key
- `update_updated_at()` trigger function applied to: users, projects, milestones, milestone_specs
- `project_dashboard_view` joining projects + milestones + ai_agents

### Prompt 1 — Complete PostgreSQL Schema
**Output:** Pure SQL, ready to paste into Supabase SQL editor

### Prompt 2 — Context Loading Query
**Output:** Master context-loading SQL that returns single JSONB `agent_context` containing:
```json
{
  "project": { "id", "name", "vision", "industry", "targetUsers", "businessModel", "status" },
  "agent": { "id", "totalInteractions", "lastActiveAt", "agentPersonality" },
  "memory": [ "last 20 memories ordered by confidence DESC" ],
  "milestones": [ "all milestones ordered by milestone_order" ],
  "currentMilestone": { "full milestone with all specs" },
  "recentProgress": [ "last 10 progress entries" ],
  "conversationHistory": [ "last 30 messages ASC" ],
  "recentFiles": [ "last 5 files with analysis" ],
  "stats": { "totalDays", "completedMilestones", "progressPercentage", "daysSinceLastActivity" }
}
```

Plus 3 additional queries:
- `saveContextSnapshot(projectId)` — saves to project_context, increments version
- `getProjectSummaryForDashboard(userId)` — all projects with progress %
- `searchProjectsByIndustry(industry, limit)` — public community projects

### Prompt 3 — Migration & Seed Scripts
**Output:**
- `migrations/001_initial_schema.js` — Node.js pg client, with `up()` and `down()` functions
- `seeds/demo_data.js` — Demo user "Alex Founder", project "FreelanceOS", 4 milestones, 5 agent memories
- `package.json` for backend

---

## SECTION 2: BACKEND API (Prompts 4–8)

### Prompt 4 — Express Backend Project Structure
**Output:** 9 complete files:
1. `src/index.js` — Express app, all middleware, route registration, graceful shutdown
2. `src/config/database.js` — pg Pool, query helper, transaction helper
3. `src/config/claude.js` — Anthropic client, `callClaude()` with 3-retry exponential backoff
4. `src/middleware/auth.js` — JWT verification, attach `req.user`
5. `src/middleware/errorHandler.js` — Structured error responses
6. `src/utils/validators.js` — Joi schemas for all inputs
7. `.env.example`
8. `Dockerfile` — Node 20 alpine, non-root user
9. `docker-compose.yml`

### Prompt 5 — Authentication API
**Routes:** `POST /register`, `POST /login`, `POST /refresh`, `POST /logout`, `GET /me`, `PATCH /preferences`
- bcrypt (12 rounds), JWT access token (7d), refresh token (30d stored hash)
- Rate limiting: max 5 login attempts per 15 minutes per IP

### Prompt 6 — Projects API + Agent Auto-Spawn
**Critical:** When project is created → automatically spawn AI agent → generate initial 5 diagnostic questions
**Files:** `projectController.js`, `agentInitService.js`, `routes/projects.js`
**Routes:** Full CRUD + `GET /:id/stats`

### Prompt 7 — Milestones API + Spec Generation
**Critical:** Creating a milestone → triggers AI spec generation automatically
**Files:** `milestoneController.js`, `specGeneratorService.js`, `routes/milestones.js`
- AI generates: spec_content, acceptance_criteria, generated_prompt, estimated_hours, dependencies

### Prompt 8 — Progress API + Screenshot Analysis
**Critical:** Users upload screenshots → agent analyzes against spec → returns match %
**Files:** `progressController.js`, `fileUploadService.js`, `screenshotAnalysisService.js`, `routes/progress.js`
- `analyzeScreenshotAgainstSpec()` returns: overallMatch (0-100), criteriaResults[], whatIsWorking[], whatIsMissing[], nextAction, encouragement

---

## SECTION 3: THE AI AGENT CORE (Prompts 9–16)

### Prompt 9 — Agent Context Loading Service
**File:** `src/services/contextService.js`

**Functions:**
- `loadFullContext(projectId)` — loads everything, caches 30s in memory
- `buildSystemPrompt(context)` — constructs system prompt with all project data
- `saveContextSnapshot(projectId, context)`
- `updateAgentMemory(agentId, memoryUpdates)`

**System prompt structure includes:**
- Agent identity + project details
- Current milestone + specs
- Memory about founder (formatted as bullet points by type)
- Progress stats
- Behavioral rules (7 rules)
- Response format (always return JSON)

### Prompt 10 — Main Agent Orchestration Service
**File:** `src/services/agentService.js` — THE MOST IMPORTANT FILE

**`runAgent(projectId, userMessage)` — 12-step flow:**
1. Load context
2. Save user message to conversation_history
3. Build system prompt
4. Prepare messages array (last 40 messages)
5. Call Claude API
6. Parse JSON response
7. Execute agent action (plan/spec/prompt/analyze/milestone_update/celebrate)
8. Update agent memory
9. Update milestone if needed
10. Save agent response
11. Save context snapshot
12. Return response

**Also:** `streamAgent()` (SSE), `triggerWeeklyCheckIn()`

### Prompt 11 — Project Planning Agent
**File:** `src/services/planningService.js`
- `askDiagnosticQuestions(projectId, initialVision)` — generates 5 targeted questions
- `generateProjectPlan(projectId, diagnosticAnswers)` — returns complete plan JSON:
  - projectSummary, recommendedTechStack, databaseSchema, apiEndpoints, uiFlows
  - milestones (with acceptance criteria, risks), launchStrategy, weekByWeekTimeline
- `revisePlan(projectId, revisionRequest)`

### Prompt 12 — Notification & Cron Job System
**Files:** `notificationService.js`, `checkInJob.js`
- Daily check (9am UTC) — inactive projects > 7 days
- Milestone deadline check (10am UTC)
- Weekly progress report (Monday 8am UTC)
- Context snapshot backup (every 6 hours)

### Prompt 13 — Agent API Routes
**Files:** `agentController.js`, `routes/agents.js`
- `POST /:projectId/message` — send message (with optional file upload)
- `POST /:projectId/message/stream` — streaming SSE
- `GET /:projectId/history` — paginated conversation history
- `POST /:projectId/clear` — doesn't delete (preserves audit trail)
- `GET /:projectId/status`
- `POST /:projectId/reset-memory` — admin only

### Prompt 14 — Prompt Generator API
**File:** `src/services/promptGeneratorService.js`
- `generateCodePrompt(specId, options)` — tailored for Cursor/Bolt/Lovable/Claude
- `generateBulkPrompts(milestoneId)`
- `ratePrompt(specId, rating, feedback)`
- `getPromptHistory(projectId)`

**Generated prompts must be:**
1. Completely self-contained
2. Specific about every detail (colors, fonts, behaviors, error states)
3. Include tech stack explicitly
4. List EVERY acceptance criterion
5. End with: "Do not ask for clarification. Build it completely as specified."

### Prompt 15 — Community & Showcase System
**Endpoints:** getFeed, getSimilarProjects, shareProject, likeProject, forkProject, getIndustryInsights, getLeaderboard

### Prompt 16 — Background Jobs, Webhooks & System Health
**Files:** `src/jobs/index.js`, `routes/webhooks.js` (GitHub + Stripe), `routes/health.js`

---

## SECTION 4: FRONTEND (Prompts 17–28)

### Prompt 17 — Next.js Frontend Setup
**Folder structure:**
```
src/
├── app/
│   ├── (auth)/login, register
│   ├── (dashboard)/layout, page, projects/[id]/(chat, plan, milestones, progress, prompts)
│   ├── community/
│   └── api/
├── components/ (ui/, agent/, project/, milestone/, community/, layout/)
├── hooks/ (useProject, useAgent, useMilestones, useAuth)
├── lib/ (api.ts, auth.ts, utils.ts)
├── store/ (Zustand: projectStore, agentStore)
└── types/index.ts
```

**Custom colors:** primary `#6C63FF`, dark `#1A1A2E`, accent `#FF6B6B`

### Prompt 18 — Landing Page
**Sections:**
1. Sticky navbar with "Start Building Free" CTA
2. Hero — "Your AI Cofounder Remembers Everything" + animated typing effect
3. Problem section — "Why most vibe coders fail" (3 cards)
4. Solution section — "Vibe OS is different" (3 solutions)
5. How it works — 3 steps
6. Feature showcase — tabbed (Agent, Plan, Prompt Generator, Progress)
7. Pricing — Free / Pro $49/mo / Enterprise $199/mo
8. Community proof — 3 sample built-with-vibe-os projects
9. Footer

### Prompt 19 — Authentication Pages
- Login: email/password, show/hide, remember me, Google OAuth (UI only)
- Register: name/email/password/confirm, password strength indicator, value props
- Shared auth layout: split screen, rotating founder quotes on right

### Prompt 20 — Dashboard Layout & Projects List
- Sidebar (240px): logo, nav, "New Project" button, user info
- Top bar: page title, notification bell with unread badge
- Projects grid: name, status badge (color-coded), progress bar, current milestone, last activity
- Empty state with CSS illustration

### Prompt 21 — Project Onboarding (New Project Flow)
**5-step wizard:**
1. What are you building? (one-liner + industry + name)
2. Who are you building it for? (target user + pain point)
3. How will you make money? (visual business model cards)
4. What are your constraints? (timeline, team size, technical level, budget)
5. Generating your plan... (animated progress → redirect to project)

### Prompt 22 — Project Home (Agent Chat Interface)
**Split view:**
- **Left (40%):** Project name (editable), progress ring, current milestone card, quick stats, recent wins
- **Right (60%):** Agent chat — animated avatar, message bubbles, typing indicator, file attach, suggested actions

### Prompt 23 — Milestones Page (Visual Roadmap)
- Timeline/list/kanban toggle
- Expandable milestone cards with specs
- Status colors: gray/purple-animated/red/green-confetti
- Prompt modal with editor selector (Cursor/Bolt/Claude/Lovable)
- Drag-to-reorder (@dnd-kit/sortable)

### Prompt 24 — Progress & Analytics Page
- Progress timeline (chronological entries)
- Stats sidebar: overall ring chart, streak, total days, interactions
- Check-in modal: 3-step (describe → AI analyzes screenshot → next action)

### Prompt 25 — Prompt Library Page
- All generated prompts grouped by milestone
- Filter by: milestone, status, editor, search
- Full prompt modal with editor tabs + rating
- Copy success animation + toast

### Prompt 26 — Community Page
- Featured 3 projects + masonry grid
- Project detail modal: full story, what went well/hard (AI generated), fork button
- Industry insights (AI generated benchmarks)
- Leaderboard sidebar: fastest launchers, most productive

### Prompt 27 — Notification System UI
- Bell icon with unread badge, dropdown (last 10)
- Toast notifications (slide from bottom right, auto-dismiss 5s, max 3 stacked)
- Full notifications page with filter and infinite scroll
- `useNotifications()` hook polling every 30 seconds

### Prompt 28 — Settings & Profile Page
- Profile (name, email, password, avatar)
- Preferences (tech stack, notification frequency, agent name, communication style)
- Subscription (plan badge, usage stats, billing history, cancel with retention flow)
- Agent settings (directness/detail/technical depth sliders)
- Integrations (GitHub, Slack, Notion — "coming soon")
- Danger zone (export data, delete account)

---

## SECTION 5: INTEGRATION & POLISH (Prompts 29–38)

### Prompt 29 — API Client Hooks
**6 hook files:**
- `useAuth` — login/register/logout/updatePreferences
- `useProject` — CRUD + stats, caching with React Query (staleTime: 5min)
- `useAgent` — sendMessage (streaming), clearMessages, suggestedActions
- `useMilestones` — CRUD + prompt generation
- `useProgress` — log, analyzeScreenshot, weeklyCheckIn
- `useNotifications` — poll every 30s, toast on new

### Prompt 30 — Streaming Agent Response
- `streamAgentMessage()` using SSE / fetch streaming
- Tokens appear progressively as agent types
- Animated typing cursor, smooth transition to formatted final message
- Handle code blocks appearing mid-stream

### Prompt 31 — File Upload & Screenshot Drop Zone
- Drag-drop entire chat area
- File preview strip above input (thumbnails for images, icons for code/PDF)
- Upload progress in send button
- Compress images before upload, max 10MB

### Prompt 32 — Onboarding Tour & Empty States
- 5-step first-time tour (pointer-based, no library)
- Reusable `EmptyState` component for all empty contexts
- Celebration animations: confetti (milestone), fireworks (launch), pulse (copy)

### Prompt 33 — Error Handling & Loading States
- Skeleton loading for all card types (shimmer animation)
- React Error Boundary with friendly UI
- Inline error states: network, auth, not found, rate limited, AI unavailable
- Global error handler with auto-retry (3x backoff)

### Prompt 34 — Mobile Responsive Design
- Bottom tab bar replacing sidebar on mobile
- Agent chat full-screen with keyboard-aware input (iOS)
- Touch-optimized tap targets (min 44px)
- All breakpoints: 320px, 375px, 414px, 768px

### Prompt 35 — Performance Optimization
- React Query config (staleTime 5min, no refetch on focus)
- Lazy load community, settings, charts
- Virtualized list for long conversations
- Backend: in-memory cache (context 30s, stats 5min, community feed 2min)
- Claude API: haiku for spec gen/notifications, sonnet for main chat/planning

### Prompt 36 — Testing Suite
- Unit: `agentService.test.js`, `contextService.test.js`
- Integration: `projectFlow.test.js` (full 12-step flow), `agentMemory.test.js`
- Jest + supertest, mock Anthropic API, separate test DB

### Prompt 37 — Stripe Subscription Integration
- Checkout sessions: Pro $49/mo, Enterprise $199/mo, 14-day trial
- Webhooks: payment success → activate, cancelled → downgrade to free
- `subscriptionGate.js` middleware enforcing plan limits
- Free: 1 project, 50 interactions/mo | Pro: unlimited | Enterprise: teams

### Prompt 38 — Deployment Configuration
- `vercel.json` — security headers, CSP, HSTS
- `railway.toml` — health check, restart policy
- `.github/workflows/deploy.yml` — CI/CD: test → Vercel → Railway → migrations
- `DEPLOYMENT.md` — 10-step guide

---

## SECTION 6: LAUNCH PREPARATION (Prompts 39–47)

### Prompt 39 — SEO & Analytics
- Next.js 14 Metadata API, OpenGraph, Twitter cards
- Dynamic sitemap, robots.txt
- GA4 custom events: project_created, prompt_copied, milestone_completed, upgrade_clicked
- Blog page for SEO (3 static posts)

### Prompt 40 — Admin Dashboard
- Platform health (users, projects, interactions, API cost, error rate)
- User management table with tier override
- Agent analytics charts (response time, messages/hour, action types)
- Claude API usage tracking (tokens, cost, by model)

### Prompt 41 — Security Hardening
- Rate limiting: 100/15min general, 5/15min auth, 20/hr agent, 50/day prompts (free)
- Input sanitization: strip HTML, validate UUIDs, SQL injection patterns, magic byte file validation
- Helmet with strict CSP + HSTS
- Project ownership middleware (always derive from JWT, never trust client)

### Prompt 42 — Email Notifications (Resend/SendGrid)
- Welcome email: "Your AI Cofounder is ready"
- Weekly progress report (every Monday)
- Inactivity nudge (7 days no activity)
- Milestone completed celebration
- Project launched
- HTML templates with dark theme + plain text fallback + unsubscribe

### Prompt 43 — Master Agent System Prompt
**800-1200 word production-grade system prompt covering:**
1. Identity & Role (cofounder, not chatbot)
2. Context injection protocol
3. 7 behavioral rules (always end with ONE next action, never generic advice)
4. Response format enforcement (always JSON)
5. Scenario handling (stuck user, screenshot submission, direction change, etc.)
6. Memory utilization
7. Prompt generation protocol by editor type

### Prompt 44 — Documentation
- `README.md` — architecture diagram, 5-command quickstart, env vars
- `docs/ARCHITECTURE.md` — design decisions, context loading strategy
- `docs/AGENT_DESIGN.md` — why persistent, memory management, failure modes
- `docs/CONTRIBUTING.md` — code style, PR process, how to add agent actions

### Prompt 45 — Launch Checklist
**Critical before launch:**
- [ ] Migrations run in production
- [ ] Auth flow works end-to-end
- [ ] Agent responds within 10 seconds
- [ ] Streaming works
- [ ] Screenshot analysis returns results
- [ ] Stripe checkout works (test mode)
- [ ] Email notifications sending
- [ ] Rate limiting active
- [ ] Mobile works at 375px
- [ ] All pages load under 3 seconds

**Automated:** `scripts/smoke-test.sh` hitting all major endpoints

### Prompt 46 — Marketing Copy
- 5 tagline options (focus: persistent memory + accountability)
- 3 hero headline A/B versions
- Feature descriptions (problem-first)
- Pricing copy (benefit-focused bullets)
- Email subject lines for each email type
- Twitter thread + LinkedIn launch post + Product Hunt copy
- FAQs / objection handling

### Prompt 47 — Post-Launch Growth Features
**3 growth loops:**
1. **"Show Your Build"** — auto-generated shareable OG image card on milestone completion, pre-filled tweet
2. **Referral System** — unique referral links, referrer gets 1 free month Pro, referee gets 30-day trial
3. **Community Project Showcase** — public pages at `vibeos.com/builds/[slug]` for SEO, "Built with Vibe OS" CTA

---

## CRITICAL NOTES

### On the Agent System Prompt
Prompt 43 is the most important. Run it last, after you've seen what breaks. Every time the agent gives a bad response, fix the system prompt first, not the code.

### On Context Loading
If the agent gives generic responses, context loading is broken. Add `console.log` to show exactly what context is being injected before each Claude call. Context should be **2000-3000 tokens** for an active project.

### On Streaming
Streaming will break on deployment if hosting platform doesn't support SSE. Vercel functions have a **10-second timeout** — use edge functions for streaming endpoints, or use Railway backend (no timeout).

### On Database Performance
Profile the context loading query with `EXPLAIN ANALYZE`. Add indexes wherever you see `Seq Scan` on large tables.

### On Claude API Costs
- Use **claude-haiku** for: spec generation, memory updates, notifications (10x cheaper)
- Use **claude-sonnet** for: main agent chat, plan generation

### On MVP Scope
Minimum to launch: **Auth + Projects + Agent Chat + Milestone Specs + Prompt Generator**. Community, analytics, email, and admin can wait.

---

## EXECUTION ORDER (Day by Day)

### Week 1 — Foundation
- Day 1: Prompt 1 (DB Schema) + Prompt 3 (Migrations) → Supabase connected
- Day 2: Prompt 2 (Context Query) + Prompt 4 (Backend Structure)
- Day 3: Prompt 5 (Auth API) → test register/login with Postman
- Day 4: Prompt 6 (Projects API) → verify agent auto-spawns
- Day 5: Prompt 7 (Milestones API) → test spec generation

### Week 2 — Agent Core
- Day 6: Prompt 9 (Context Loading) → verify < 500ms
- Day 7: Prompt 10 (Agent Orchestration) → full agent loop end-to-end
- Day 8: Prompt 11 (Planning Agent) → diagnostic questions working
- Day 9: Prompt 13 (Agent API Routes) → Postman: send message, get history
- Day 10: Prompt 14 (Prompt Generator) → all 4 editor types

### Week 3 — Frontend Base
- Day 11: Prompt 17 (Next.js Setup) → dev server running
- Day 12: Prompt 18 (Landing Page) → live at localhost:3000
- Day 13: Prompt 19 (Auth Pages) → login/register with backend
- Day 14: Prompt 20 (Dashboard) → real project data showing
- Day 15: Prompt 21 (Onboarding) → complete new project flow

### Week 4 — Core Product
- Day 16: Prompt 22 (Agent Chat) → full chat with streaming
- Day 17: Prompt 30 (Streaming) → tokens appear in real-time
- Day 18: Prompt 23 (Milestones) → view and manage milestones
- Day 19: Prompt 29 (Hooks) → all data fetching connected
- Day 20: Prompt 8 (Progress API) + Prompt 24 (Progress Page)

### Week 5 — Features & Polish
- Day 21: Prompt 12 (Notifications + Cron)
- Day 22: Prompt 25 (Prompt Library) + Prompt 27 (Notifications UI)
- Day 23: Prompt 26 (Community)
- Day 24: Prompt 31 (File Upload)
- Day 25: Prompt 32 (Onboarding) + Prompt 33 (Error States)

### Week 6 — Launch
- Day 26: Prompt 37 (Stripe)
- Day 27: Prompt 38 (Deploy to Vercel + Railway)
- Day 28: Prompt 41 (Security)
- Day 29: Prompt 42 (Email)
- Day 30: Prompt 45 (Launch Checklist) → **LAUNCH** 🚀

---

*47 prompts. 6 weeks. One real product. Now go build.*
