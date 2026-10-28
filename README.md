# Campus Growth Radar

> **Tagline:** Find the opportunity. Run the experiment. Earn the growth.  
> **Challenge:** NxtWave Growth Intern Challenge — Acquisition Plan for 500 Unique Final-Year Engineering Student Registrations in 7 Days with ₹2,000 Total Budget.  
> **Workshop:** *"Build Your First AI Project in 60 Minutes"*

---

## 1. Product Vision & Overview

**Campus Growth Radar** is a growth-intelligence decision system designed for growth strategists, campus ambassadors, and campaign managers at NxtWave.

It shifts campus acquisition from guesswork to a **system of defensible unit economics**, answering five strategic growth questions:

1. **Which student communities should NxtWave prioritize?**  
   Evaluated in the **Opportunity Radar** using a multi-factor transparent formula (Expected Volume, Effort Velocity, CAC, Access Status, and Confidence).
2. **How could each community contribute to 500 unique registrations?**  
   Modeled in the **Growth Simulator**, which applies explicit cross-channel deduplication (`Unique = Gross × (1 − Overlap Rate)`) rather than double-counting batchmates across WhatsApp and club chats.
3. **Is the target feasible within 7 days and ₹2,000?**  
   Evaluated dynamically with unit economics: Blended CAC benchmarked at ~₹3.50–₹3.80/registration, leaving an operational buffer of ₹200–₹400.
4. **What should the growth team do next?**  
   Generated in real-time by the **Growth Decision Engine** panel, specifying: *Action, Why, Supporting Data, Metric to Measure, and Reconsideration Trigger*.
5. **What happens if original growth assumptions fail?**  
   Stress-tested in the **Failure Lab** across 6 failure modes (e.g., admin blocks, ambassador fatigue, conversion cuts) with instant deterministic recovery playbooks.

---

## 2. Technology Stack

- **Framework:** React 19 + Vite 8 (JavaScript ES Modules)
- **Styling:** Vanilla CSS design tokens with Tailwind CSS v4 (`@tailwindcss/vite`)
- **Visual Design Palette:**
  - Background: Deep Navy `#0B1020`
  - Elevated Panels: `#121A2B` / `#182238`
  - Primary Lime Accent: `#B8F56A`
  - Secondary Teal Accent: `#51D6C7`
  - Text Primary: `#F5F7FA` | Text Secondary: `#9BA8BB`
  - Borders: `#1E2B45`
- **Charts:** Recharts (7-day trajectory, channel gross vs. deduplicated comparison)
- **Icons:** Lucide React
- **Celebration & UX:** canvas-confetti, custom accessible modals, keyboard ESC shortcuts
- **State & Persistence:** Centralized React Context with reactive browser `localStorage` synchronization
- **Deployment:** Zero-config Vercel configuration (`vercel.json`)

---

## 3. Key Feature Walkthrough

### 🧭 Overview Dashboard
- **Campaign KPIs:** Registration Target (500), Actual Test Registrations Recorded, Projected Unique Registrations, Budget Allocated / Remaining, Blended CAC, and Velocity Run-Rate.
- **Dynamic Decision Summary:** Recommended next action with supporting math and pivot conditions.
- **Trajectory Chart:** 7-day planned S-curve vs. simulated projection vs. actual live test records.
- **Channel Output:** Gross potential vs. deduplicated unique registrants and channel CAC.

### 🎯 Opportunity Radar (Signature Feature)
- Prioritizes hypothetical student communities: College coding clubs, placement preparation groups, final-year class representatives, IEEE/ACM technical societies, and developer communities.
- **Transparent Scoring Formula:**
  $$\text{Priority Score} = \left[\text{Volume}(40\%) + \text{Velocity}(25\%) + \text{CAC Efficiency}(20\%) + \text{Access}(10\%) + \text{Confidence}(5\%)\right] \times \text{Modifiers}$$
- Score explanation modal reveals the exact point breakdown for every community.
- Full CRUD operations: Create, edit assumptions, sort, filter by access status, and delete records.

### 🎛 Growth Simulator
- Multichannel slider controls: Student club reach, conversion rates, active ambassadors, registrations per ambassador, organic reach, CR broadcasts, and cross-channel overlap.
- **Overlap Math:** Computes net unique students using `Gross × (1 - Overlap Rate)`.
- **Presets:** Conservative, Base Case, and Optimistic with 1-click restore.
- **Sensitivity Table:** Live ±20% conversion volatility stress-test.

### 📋 Growth Missions Generator
- Converts strategy into daily execution tasks with assigned owners, timelines (Day 1–7), costs, and verifiable verification metrics.
- Interactive status cycling (`Not Started` ➔ `In Progress` ➔ `Completed` ➔ `Blocked`).
- **1-Click Copy Mission Briefing:** Generates formatted markdown summaries for team dissemination.

### 🔬 Experiment Lab
- Three seeded growth tests:
  1. *Outcome-Focused Message vs. Generic Announcement*
  2. *Peer Ambassador Recommendation vs. General Community Blast*
  3. *Project-Oriented CTA vs. Generic Registration CTA*
- **Statistical Rigor:** Computes conversion rates, absolute/relative lift, and two-proportion z-tests. Displays explicit **Small Sample Warnings (<100 participants)** to avoid declaring fake statistical winners.

### ⚡ Failure Lab (Distinctive Feature)
- Six preconfigured failure stress-tests:
  1. Community administrators reject outreach (Access blocked)
  2. Ambassador registrations fall 60% below forecast
  3. Conversion rates cut in half
  4. Channel overlap spikes to 38%
  5. Budget availability slashed from ₹2,000 to ₹1,000
  6. Time compressed (only 4 days remain)
- Instantly recalibrates the simulator, highlights the critical bottleneck, and provides an actionable recovery playbook with budget/effort trade-offs.

### 🎟 Live Workshop Registration Portal (`#register`)
- Mobile-first, high-converting registration page for *"Build Your First AI Project in 60 Minutes"*.
- **Real Duplicate Detection:** Normalizes email addresses (lowercased, trimmed) and blocks duplicate submissions with clear alerts.
- **Referral Attribution:** Preserves referral parameters (e.g., `?ref=AMB-PRIYA&source=coding_club`), immediately crediting the ambassador in the live leaderboard.
- **Interactive Ticket:** Generates a personalized confirmation ticket upon registration.

### ✨ AI Campaign Copilot
- Rule-based deterministic copy engine generating 3 tailored variants across 5 channels (WhatsApp, Ambassadors, Clubs, Placement Groups, LinkedIn) and 4 tones.
- Hypotheses provided for every variation.
- **Truth-in-Advertising:** Strictly avoids fake scarcity, unsupported placement promises, or fabricated testimonials.

---

## 4. Local Setup & Testing

### Prerequisites
- Node.js v18+ (tested on Node v24.14.1)
- npm v9+

### Installation & Execution
```bash
# 1. Clone or open repository
cd "nxt wave"

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
# Server ready at http://localhost:5173/

# 4. Run automated test suite
npm test
# Executes 12 automated assertion checks across calculations and scoring models

# 5. Build for production
npm run build
```

---

## 5. Vercel Deployment Instructions

The project is structured as a static Single Page Application (SPA) with zero external backend or secret API key dependencies.

### Deploying via Vercel CLI:
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Deploying via Vercel Web Dashboard:
1. Push this repository to GitHub or GitLab.
2. In Vercel, click **"Add New Project"** and select the repository.
3. Configure settings:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Click **Deploy**. The included `vercel.json` ensures all route rewrites (e.g., `/register`) work cleanly.

---

## 6. Data Integrity & Ethical Disclosure

- **Simulation Mode:** All pre-seeded community records, ambassador figures, and simulator baseline forecasts are illustrative simulation models designed for the NxtWave Growth Intern Challenge.
- **Real Test Registrations:** When you submit a record through the live registration form, it is saved locally in your browser's `localStorage` and immediately updates the "Actual Recorded Registrations" metric on the overview dashboard.
- **Zero Real Outreach:** This application does not send unsolicited emails, trigger real bulk messages, or claim simulated performance as actual campus performance.

---

## 7. Automated Test Results

The automated test suite (`npm test`) verifies 12 critical assertions:
- **Suite 1:** Simulator gross calculations, deduplication overlap factor, gap to 500, and ±20% sensitivity variance.
- **Suite 2:** Community scoring bounds (0–100), factor weights, and access status penalties.
- **Suite 3:** A/B test conversion rates, two-proportion z-test significance, and small sample size warnings (<100).
- **Suite 4:** Dynamic Next Action engine prioritizing blocked missions.
