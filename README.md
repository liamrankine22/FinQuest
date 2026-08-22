# FinQuest
Ignition Hacks V7 Hackathon

# Life & Debt: Financial Survival Simulator

> A text-based financial life simulation game that teaches personal finance through high-stakes, choice-driven scenarios. Players navigate adulthood from age 18 to retirement, managing cash, debt, credit, diversification, and happiness — where every decision hides its true financial impact until it's too late.

Life & Debt is a **choice engine** built on a local JSON event database. Rather than lecturing users with formulas, it drops them into absurd-but-realistic financial dilemmas (predatory car loans, Discord crypto tips, drop-shipping gurus, festival debt) and lets the consequences teach the lesson. A **dynamic happiness system** ties emotional well-being to financial health, so a ballooning APR or drained emergency fund doesn't just hurt your net worth — it slowly breaks your character.

---

## Key Features

- **Dynamic Happiness System** — Happiness isn't a static stat. Each turn it's recalculated from your overall financial health:
  - **Debt Penalty:** −5 happiness per full $5,000 of high-interest debt.
  - **Cash Penalty/Bonus:** Negative cash → −15; cash above $20,000 → +10.
  - **Credit Score Impact:** Below 580 → −10; above 740 → +10.
- **Strict State Bounds** — Values are clamped to realistic ranges so the simulation never breaks:
  - Diversification: `0–10` → `Math.min(10, Math.max(0, value))`
  - Happiness: `0–100` → `Math.min(100, Math.max(0, value))`
  - Credit Score: `300–850`
- **Hidden Financial Impacts** — Choice buttons display **only the choice text**. The `financial_impact` and `literacy_alignment` of each option are never shown upfront, forcing authentic decision-making. The `hidden_consequence` narrative is revealed only *after* you commit.
- **Win / Loss & Game Over Conditions**
  - **Death by Burnout:** Happiness hits `0` → *Severe Burnout & Health Collapse*.
  - **Insolvency:** Liquid cash below −$10,000, or high-interest debt over $50,000 with non-positive cash → *Total Financial Insolvency*.
  - **Retirement (Victory):** Reach age 65 alive → a net-worth-graded retirement ending (legend / comfortable / modest / indebted).
- **Topic Rotation** — The active `target_principle` cycles each turn across six core topics (50/30/20 Budgeting, APR & High-Interest Debt, Emergency Funds, Compound Interest, Opportunity Cost, Asset Diversification) to ensure broad coverage.
- **Persistent Sessions** — Each player's run is stored as a `GameSession` entity, so progress survives refreshes and can be reset with *Start New Life*.

---

## Tech Stack & Dependencies

| Layer | Technology |
| --- | --- |
| Framework | React 18 (`react`, `react-dom`) |
| Build Tool | Vite 6 |
| Language | JavaScript (ESM) |
| Styling | Tailwind CSS 3 + `tailwindcss-animate` |
| UI Primitives | shadcn/ui (Radix UI components), `lucide-react` icons |
| Animation | Framer Motion |
| Routing | React Router DOM 6 |
| Data / State | TanStack React Query, `@base44/sdk` (BaaS: auth, entities, storage) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Utilities | lodash, date-fns, moment, clsx, tailwind-merge, class-variance-authority |

**Runtime Requirements**

- **Node.js** ≥ 18 (recommended 20+)
- **npm** ≥ 9 (or compatible pnpm/yarn)

> Note: This project uses the **Base44** platform for backend-as-a-service (auth, database entities, file storage). A Base44 environment is required for full functionality; the simulator's event logic itself is fully local and dependency-free.

---

## Setup & Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/life-and-debt.git
cd life-and-debt

# 2. Install dependencies
npm install

# 3. (Optional) Configure environment variables
#    Base44 configuration is handled via the platform. If you have local
#    secrets (e.g. an API key), add them to your Base44 app settings rather
#    than committing them. A .env file is not required for the simulator.
cp .env.example .env   # only if your fork uses one

# 4. Start the development server
npm run dev

# 5. Open the app
#    Vite prints a local URL (default: http://localhost:5173)
```

**Other scripts**

```bash
npm run build       # production build
npm run preview     # preview the production build
npm run lint        # eslint check
npm run lint:fix    # eslint auto-fix
npm run typecheck   # tsc type check
```

---

## JSON Data Schema & Event Configuration

The entire game is driven by a local event database. The active dataset lives at:

```
src/data/simulatorEvents.json
```

This file is an **array of event objects**. Each event represents one life scenario the player may encounter.

### Event Object Schema

```jsonc
{
  "id": "evt_001",                       // unique identifier (used for de-duplication)
  "target_principle": "APR & High-Interest Debt",  // topic this event teaches
  "event_type": "Opportunity",           // Opportunity | Crisis | Random
  "tone": "Humorous",                    // Humorous | Grim/Stakes-based | Professional
  "min_age": 18,                         // eligibility: player age range
  "max_age": 25,
  "min_debt": 0,                         // eligibility: minimum total debt
  "min_net_worth": -5000,                // eligibility: minimum net worth
  "wildcard_trigger": false,             // flags a rare wildcard event
  "eventTitle": "The 'Clout' Mustang",
  "eventDescription": "A dealership offers you…",
  "choices": [
    {
      "choice_text": "Sign the 84-month predatory contract",
      "financial_impact": "+35,000 High-Int Debt, -700 Monthly Cashflow", // HIDDEN from UI
      "hidden_consequence": "You pay 80,000 for a car that breaks down…", // revealed after choosing
      "liquid_cash_change": 0,
      "high_interest_debt_change": 35000,
      "low_interest_debt_change": 0,
      "credit_score_change": -80,
      "happiness_change": 40,
      "diversification_change": 0,
      "monthly_gross_income_change": 0,
      "monthly_net_income_change": -700,
      "new_career": null,                 // non-null updates player's career
      "new_lifestyle": "Car Poor",        // non-null updates player's lifestyle
      "new_liabilities": "Predatory Auto Loan"  // non-null adds to liabilities[]
    }
  ]
}
```

### How Events Are Loaded

1. `src/lib/simulatorEvents.js` imports the JSON array statically.
2. Each turn, `pickEvent(session, seenIds)` filters events where:
   - `target_principle` matches the session's current focus principle,
   - `min_age <= age <= max_age`,
   - total debt `>= min_debt`,
   - net worth `>= min_net_worth`.
3. Already-seen event IDs are preferred to be skipped (for variety), with a fallback to the full filtered pool, and finally a global fallback so the game never stalls.
4. The selected event's `event_type`, `tone`, and `wildcard_trigger` are synced onto the session for display.

> To swap datasets (e.g. `simulator_5.json`), replace `src/data/simulatorEvents.json` with your file or update the import path in `src/lib/simulatorEvents.js`. The schema above must be respected for the game loop to apply choices correctly.

---

## How to Play

1. **Start a life.** You begin at **age 18** with $5,000 cash, a 680 credit score, diversification of 1, and 70 happiness. Your career is *Unemployed*.
2. **Read the scenario.** Each turn presents an `eventTitle` and `eventDescription` — a financial dilemma drawn from the event database.
3. **Choose blindly.** You see **only the choice text** — no hints about which option is "good" or "bad." Pick what your gut (or your principles) tell you.
4. **Face the consequence.** After choosing, your stats update and the `hidden_consequence` is revealed. Then hit **Continue** to age one year and draw the next event.
5. **Watch your stats.** The dashboard tracks Age, Net Worth, Liquid Cash, Credit Score, High-/Low-Interest Debt, Diversification, and Happiness. The side panel shows Career, Lifestyle, Liabilities, Focus Principle, and Status.
6. **Mind your happiness.** It's not just about money — debt, negative cash, and poor credit erode happiness every turn. Hit 0 and you collapse.
7. **Survive to 65.** Avoid bankruptcy and burnout, build net worth, and reach retirement for a graded ending based on your final net worth.

**Survival Strategy Tips**

- Prioritize killing high-interest debt first — it's the heaviest happiness penalty.
- Keep an emergency cushion; negative cash is a fast track to insolvency.
- Diversify early — it's capped at 10, and every point compounds your resilience.
- Don't chase lifestyle upgrades that drain cash for short-term happiness.

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

Contributions are welcome — especially new event scenarios that teach a financial principle!

1. **Fork** the repository and create your branch: `git checkout -b feature/my-new-event`.
2. **Add events** by appending to `src/data/simulatorEvents.json` following the schema above. Every event should map to one of the six `target_principle` topics and include at least two choices with clear `hidden_consequence` narratives.
3. **Keep choices honest** — never telegraph the "correct" answer in the `choice_text`. The pedagogy depends on hidden impacts.
4. **Test locally** with `npm run dev` and play through to verify eligibility filters and stat deltas behave as expected.
5. **Lint & typecheck** before submitting: `npm run lint && npm run typecheck`.
6. **Open a Pull Request** describing the scenario(s) added and the principle they reinforce.

**Guidelines**

- Keep event tone varied (mix Humorous and Grim/Stakes-based).
- Ensure `min_age`/`max_age`/`min_debt`/`min_net_worth` gates make sense for the scenario.
- Avoid duplicate `id` values — use a unique `evt_XXX` identifier.
- Balance choices: each event should offer a financially literate path and a tempting-but-costly path.

---

<sub>Built with React, Vite, Tailwind CSS, and the Base44 platform.</sub>

https://rough-wealth-quest-path.base44.app
