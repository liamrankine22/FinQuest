# FinQuest
Ignition Hacks V7 Hackathon
# FinQuest Financial Literacy Platform & Simulator

> A dual-core web application that teaches personal finance two ways: an **interactive learning platform** that breaks down core financial concepts into bite-sized, gamified lessons, and a **decision-driven life simulator** where players apply those principles across a lifetime of high-stakes choices.

Life & Debt pairs pedagogy with practice. The **Learning Module** turns the six pillars of personal finance into interactive, Duolingo-style lessons with progress tracking, XP, and streaks. The **Simulator Module** drops players into a text-based life engine where every choice hides its true financial impact — so the only way to win is to actually *understand* the concepts the lessons taught. Together, they form a closed loop: learn a principle, then survive a lifetime by living it.

---

## Core Modules & Architecture

### 1. Learning Module

An interactive curriculum that teaches the six core financial principles through structured tiers, lessons, and problem sets.

**Concepts covered:**

- **High-Interest Debt (APR)** — how compounding interest on debt erodes wealth.
- **Asset Diversification** — spreading risk across asset classes.
- **50/30/20 Budgeting** — the needs/wants/savings framework.
- **Emergency Funds** — liquidity as a shock absorber.
- **Opportunity Cost** — the hidden cost of every "yes."
- **Compound Interest** — the math that makes early investing powerful.

**Features:**

- Tier-based curriculum roadmap with locked/unlocked progression.
- Multiple question types: multiple-choice, drag-and-drop bucket sorting, scenario choices, gauges, higher/lower, and dialogue steps.
- Animated lesson and problem intro overlays with narration.
- Progress persistence via `LessonProgress` and `LearningProfile` entities (score, XP, streak, completed lessons).
- Results screen with pass/fail thresholds and continue/retry flows.

### 2. Simulator Module

An event-driven life engine where players apply what they've learned across a simulated lifetime.

**Engine characteristics:**

- **JSON-driven events** — scenarios are loaded from a local dataset (e.g. `simulatorEvents.json`, swappable with `simulator_5.json`).
- **Player state tracking** — age, liquid cash, high-/low-interest debt, credit score, diversification (bounded **0–10**), and dynamic happiness (bounded **0–100**), plus career, lifestyle, and liabilities.
- **Dynamic happiness** — recalculated each turn from financial health (debt load, cash position, credit score).
- **Un-telegraphed choices** — choice buttons show only the text; financial impacts and "good/bad" alignment are hidden until after the decision.
- **Career paths & lifestyle tiers** — choices can change the player's career and lifestyle, reflecting real financial trajectories.
- **Game Over / Retirement states** — burnout death (happiness 0), total insolvency, or a net-worth-graded retirement ending at age 65.

---

## Tech Stack & System Requirements

| Layer | Technology |
| --- | --- |
| Runtime | **Node.js** ≥ 18 (recommended 20+) |
| Package Manager | npm ≥ 9 (pnpm/yarn compatible) |
| Framework | React 18 (`react`, `react-dom`) |
| Build Tool | Vite 6 |
| Language | JavaScript (ESM) |
| Routing | React Router DOM 6 |
| Styling | Tailwind CSS 3 + `tailwindcss-animate`, design tokens via CSS variables |
| UI Primitives | shadcn/ui (Radix UI), `lucide-react` icons |
| Animation | Framer Motion |
| State / Data | TanStack React Query, `@base44/sdk` (BaaS: auth, entities, storage) |
| Forms & Validation | React Hook Form + Zod |
| Charts | Recharts |
| Drag & Drop | `@hello-pangea/dnd` |
| Utilities | lodash, date-fns, moment, clsx, tailwind-merge, class-variance-authority |
| JSON Parsing | Native ES module `import` (Vite handles JSON statically) |

> The **Base44** platform provides backend-as-a-service — authentication, database entities, and file storage. A Base44 environment is required for auth and data persistence; the simulator's event logic is fully local and dependency-free.

---

## Setup & Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/life-and-debt.git
cd life-and-debt

# 2. Install dependencies
npm install

# 3. Configure environment variables (if applicable)
#    Base44 config is managed via the platform. Copy the example env
#    only if your fork uses local secrets (e.g. an API key).
cp .env.example .env

# 4. Start the development server
npm run dev

# 5. Open the app
#    Vite prints a local URL (default: http://localhost:5173)
```

**Available scripts**

```bash
npm run dev        # local development server
npm run build      # production build
npm run preview    # preview the production build
npm run lint       # eslint check
npm run lint:fix   # eslint auto-fix
npm run typecheck  # tsc type check
```

---

## Project Directory Structure

```
life-and-debt/
├── base44/
│   └── entities/
│       ├── GameSession.jsonc        # Simulator player-state schema
│       ├── LessonProgress.jsonc     # Per-lesson score/completion
│       ├── LearningProfile.jsonc    # XP, streak, completed lessons
│       └── User.jsonc               # Built-in user entity
├── src/
│   ├── pages/
│   │   ├── Index.jsx                 # Auth-aware router wrapper
│   │   ├── Landing.jsx               # Public marketing/landing page
│   │   ├── Home.jsx                  # Authenticated dashboard
│   │   ├── Tiers.jsx                 # Learning curriculum roadmap
│   │   ├── Roadmap.jsx               # Tier lesson path
│   │   ├── Lesson.jsx                # Interactive lesson engine
│   │   ├── Problem.jsx               # Problem set engine
│   │   ├── Results.jsx               # Lesson results screen
│   │   └── Simulator.jsx             # Life simulator page + game loop
│   ├── components/
│   │   ├── AppNavbar.jsx             # Top nav + account menu
│   │   ├── ProtectedRoute.jsx        # Auth route guard
│   │   ├── learning/
│   │   │   ├── LessonNode.jsx        # Roadmap lesson node
│   │   │   ├── ProblemNode.jsx       # Roadmap problem node
│   │   │   ├── LessonIntro.jsx       # Animated lesson intro overlay
│   │   │   ├── ProblemIntro.jsx      # Animated problem intro overlay
│   │   │   ├── QuestionCard.jsx      # Question wrapper
│   │   │   ├── DragDropQuestion.jsx
│   │   │   ├── ScenarioChoice.jsx
│   │   │   ├── GaugeQuestion.jsx
│   │   │   ├── HigherLowerQuestion.jsx
│   │   │   ├── StoryQuestion.jsx
│   │   │   ├── InfoStep.jsx
│   │   │   └── Problem*.jsx          # Problem-type components
│   │   └── simulator/
│   │       ├── MetricCard.jsx        # Stat display tile
│   │       ├── ContextPanel.jsx      # Career/lifestyle/liabilities panel
│   │       ├── EventCard.jsx         # Scenario display
│   │       ├── ChoiceButton.jsx      # Un-telegraphed choice button
│   │       ├── OutcomeCard.jsx       # Post-choice consequence reveal
│   │       └── GameOverCard.jsx      # Death/insolvency/retirement end
│   ├── data/
│   │   └── simulatorEvents.json      # Simulator event dataset (swap for simulator_5.json)
│   ├── lib/
│   │   ├── simulatorEvents.js        # Event filtering & selection logic
│   │   ├── curriculum.js             # Learning curriculum data
│   │   ├── problems.js               # Problem set definitions
│   │   ├── audioPlayer.js            # Singleton audio handler
│   │   ├── lessonAudio.js
│   │   └── AuthContext.jsx           # Auth provider/state
│   ├── hooks/
│   │   └── useLessonAudio.js
│   ├── App.jsx                       # Router + auth providers
│   ├── index.css                     # Design tokens + Tailwind
│   └── main.jsx                      # App entry
├── tailwind.config.js
├── package.json
└── README.md
```

---

## Data Schemas & Extension

### Simulator Events

The simulator reads its scenarios from `src/data/simulatorEvents.json` — an array of event objects. Each event defines eligibility gates, a narrative, and choices with hidden financial deltas.

```jsonc
{
  "id": "evt_001",
  "target_principle": "APR & High-Interest Debt",   // one of the six core topics
  "event_type": "Opportunity",                       // Opportunity | Crisis | Random
  "tone": "Humorous",                                // Humorous | Grim/Stakes-based | Professional
  "min_age": 18, "max_age": 25,                       // eligibility: age range
  "min_debt": 0, "min_net_worth": -5000,              // eligibility: debt & net-worth floors
  "wildcard_trigger": false,
  "eventTitle": "The 'Clout' Mustang",
  "eventDescription": "A dealership offers you…",
  "choices": [
    {
      "choice_text": "Sign the 84-month predatory contract",
      "financial_impact": "+35,000 High-Int Debt",    // HIDDEN from the UI
      "hidden_consequence": "You pay 80,000 for a car…", // revealed after choosing
      "liquid_cash_change": 0,
      "high_interest_debt_change": 35000,
      "low_interest_debt_change": 0,
      "credit_score_change": -80,
      "happiness_change": 40,
      "diversification_change": 0,
      "monthly_gross_income_change": 0,
      "monthly_net_income_change": -700,
      "new_career": null,                             // non-null updates career
      "new_lifestyle": "Car Poor",                    // non-null updates lifestyle
      "new_liabilities": "Predatory Auto Loan"        // non-null adds to liabilities[]
    }
  ]
}
```

**How the app reads & applies events:**

1. `src/lib/simulatorEvents.js` imports the JSON array statically.
2. Each turn, `pickEvent(session, seenIds)` filters by `target_principle`, age range, `min_debt`, and `min_net_worth`, preferring unseen events for variety (with fallbacks so the game never stalls).
3. The Simulator page applies the chosen option's deltas to the `GameSession` entity, runs the dynamic happiness calculation, clamps bounds, checks Game Over conditions, and persists the updated state.

**To swap datasets** (e.g. `simulator_5.json`): replace `src/data/simulatorEvents.json` or update the import path in `src/lib/simulatorEvents.js`.

### Player State (`GameSession`)

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `current_age` | number | 18 | +1 per turn; retirement at 65 |
| `liquid_cash` | number | 5000 | insolvency if < −$10,000 |
| `high_interest_debt` | number | 0 | insolvency if > $50,000 with cash ≤ 0 |
| `low_interest_debt` | number | 0 | |
| `credit_score` | number | 680 | clamped 300–850 |
| `diversification` | number | 1 | clamped 0–10 |
| `happiness` | number | 70 | clamped 0–100; 0 = death |
| `career` | string | "Unemployed" | updated by `new_career` |
| `lifestyle` | string | "Basic" | updated by `new_lifestyle` |
| `liabilities` | array | [] | appended by `new_liabilities` |
| `is_alive` | boolean | true | false on burnout death |
| `game_over_reason` | string | "" | set on death/insolvency/retirement |

### Adding New Lessons or Events

**New simulator events:** append objects to `src/data/simulatorEvents.json` following the schema above. Map each to one of the six `target_principle` topics, include at least two choices, and never telegraph the "correct" answer in `choice_text` — the pedagogy depends on hidden impacts. Use unique `evt_XXX` ids.

**New learning content:** extend `src/lib/curriculum.js` (lesson definitions) and `src/lib/problems.js` (problem sets). Lessons and problems are organized by tier; add new tiers/lessons following the existing structure and the corresponding `LessonNode`/`ProblemNode` components will render them on the roadmap.

---

## License

This project is released under the **MIT License**.

```
MIT License

Copyright (c) 2026 Life & Debt Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
```

---

## Contributing

Contributions are welcome — especially new simulator events and learning content.

1. **Fork** the repo and branch: `git checkout -b feature/my-contribution`.
2. **Simulator events** — append to `src/data/simulatorEvents.json` following the event schema; keep choices un-telegraphed and map to one of the six principles.
3. **Learning content** — extend `curriculum.js` / `problems.js` with new tiers, lessons, or question types.
4. **Test locally** with `npm run dev`; play through both modules to verify behavior.
5. **Lint & typecheck** before submitting: `npm run lint && npm run typecheck`.
6. **Open a Pull Request** describing what was added and which principle it reinforces.

**Guidelines**

- Keep tone varied (mix Humorous and Grim/Stakes-based events).
- Ensure eligibility gates (`min_age`/`max_age`/`min_debt`/`min_net_worth`) make sense.
- Balance choices: each event should offer a financially literate path and a tempting-but-costly path.
- Avoid duplicate ids; use unique `evt_XXX` / lesson identifiers.

---

<sub>Built with React, Vite, Tailwind CSS, and the Base44 platform.</sub>
https://rough-wealth-quest-path.base44.app
