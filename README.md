# DAYA — Behavioral Support Companion

An emotionally intelligent AI companion helping parents of autistic children notice behavioral patterns, feel supported, and celebrate progress.

**DAYA is not** a diagnosis tool, therapy replacement, or medical AI.  
**DAYA is** a behavioral observation companion, longitudinal memory system, and parent-support assistant.

## Quick Start

```bash
# Install dependencies
npm install

# Add your Anthropic API key to .env.local
# ANTHROPIC_API_KEY=sk-ant-xxxxx

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

### Chat Interface
Emotionally warm conversational AI powered by Claude. Streaming responses with typing indicators, suggestion prompts, and a non-medical safety disclaimer.

### Daily Check-In
Parents log sleep quality, meals, mood, meltdowns, communication level, routine adherence, and sensory load. Data feeds the behavioral insight engine.

### Behavioral Insight Engine
Rule-based pattern detection across check-in history:
- Sleep vs mood correlations
- Routine disruption and meltdown patterns
- Communication trend analysis
- Positive stretch detection

### Support Knowledge Layer
Curated, tone-reviewed support snippets across categories: sensory support, communication, routines, calming activities, meltdown recovery, and parent self-care. Contextually retrieved based on conversation content.

### Safety System
- Crisis escalation (988 Lifeline, Crisis Text Line)
- Medical question redirection
- Non-medical disclaimers
- Gentle, observational language enforcement

## Architecture

```
src/
  app/
    api/
      chat/         # Claude streaming endpoint
      check-ins/    # Daily check-in CRUD
      context/      # Full DAYA context (child, insights, snippets)
      insights/     # Behavioral pattern analysis
    page.tsx        # Main app entry
    layout.tsx      # Root layout
  components/
    daya/           # Main DayaChat component (chat + check-in + context panel)
    chat/           # Chat message, input, welcome screen components
    checkin/        # Check-in form and history
    insights/       # Insights panel
    layout/         # App header
    ui/             # shadcn/ui components
  hooks/
    use-chat.ts     # Chat state management with streaming
  lib/
    daya/           # Core DAYA engine (AI, insights, prompts, safety, support, repository)
    claude.ts       # Anthropic client
    insights.ts     # Behavioral pattern detection
    mock-data.ts    # Realistic demo data (child profile, check-ins, memories)
    support-snippets.ts  # Curated support content
    system-prompt.ts     # DAYA system prompt builder
  types/
    index.ts        # TypeScript types
```

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend:** Next.js API Routes, Supabase (optional), PostgreSQL + pgvector
- **AI:** Claude API (Sonnet 4.6) with streaming
- **Deployment:** Vercel-ready

## Demo Mode

The app runs in demo mode without Supabase. It uses realistic mock data for a child named Aarav, including 8 days of check-in history and 3 conversation memories. The behavioral insight engine generates real pattern correlations from this data.

## Supabase Setup (Optional)

1. Create a Supabase project
2. Run `supabase-schema.sql` in the SQL Editor
3. Add credentials to `.env.local`

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Claude API key for chat |
| `NEXT_PUBLIC_SUPABASE_URL` | No | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Supabase service role key |

## Deploy to Vercel

```bash
npm run build   # verify build passes
vercel deploy    # deploy to Vercel
```

## The DAYA Wow Moment

> DAYA notices a meaningful behavioral pattern the parent missed.

"We noticed Aarav has had more difficult evenings after overstimulating days recently. On 2 of 2 lower-sleep days, meltdowns showed up. Whatever routines are in place on well-rested days seem to be working — might be worth gently protecting those."
