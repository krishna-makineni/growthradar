import React from "react";
import {
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  TrendingDown,
  Wrench,
  Clock,
  DollarSign,
  HelpCircle,
} from "lucide-react";
import { useGrowth } from "../../context/GrowthContext";

export const FAILURE_SCENARIOS = [
  {
    id: "fail_admin_block",
    title: "1. Community Admins Reject Outreach",
    tagline: "Class CRs & club presidents decline broadcast permissions",
    impactDescription: "Community reach drops by 60% and conversion rate dampens by 30% due to loss of official club endorsement.",
    primaryBottleneck: "Loss of low-cost, high-trust institutional broadcast distribution.",
    recoveryPlan: [
      {
        step: "Pivot to Decentralized Ambassador DMs",
        detail: "Bypass club admins by activating 8 additional peer ambassadors to share directly in informal batch chats.",
      },
      {
        step: "Deploy 60-Second Video Teaser on Discord/LinkedIn",
        detail: "Release a direct screen recording of the AI project being built to capture unmoderated viral interest.",
      },
      {
        step: "Reallocate ₹400 Club Budget to Ambassador Incentives",
        detail: "Offer ₹50 bonus for every 5 verified batchmate registrations.",
      },
    ],
    effortRequired: 8,
    budgetRequired: 400,
    uncertaintyNote: "Relies on ambassadors having high social capital and active personal connections.",
  },
  {
    id: "fail_ambassador_drop",
    title: "2. Ambassador Output Falls 60% Below Forecast",
    tagline: "Student reps get overwhelmed with exams or assignment deadlines",
    impactDescription: "Registrations per ambassador drop from 16 to 6, cutting ~120 projected registrations.",
    primaryBottleneck: "Ambassador inertia, lack of accountability, and academic schedule conflict.",
    recoveryPlan: [
      {
        step: "Gamify with Daily Flash Leaderboard Milestones",
        detail: "Award instant digital badges and priority project review for ambassadors reaching 10 signups within 24h.",
      },
      {
        step: "Provide Pre-Written 1-Click WhatsApp Snippets",
        detail: "Remove copy friction by generating 3 copy-paste snippets with embedded referral links for each ambassador.",
      },
      {
        step: "Ramp Direct Coding Club Mini-Demos",
        detail: "Schedule two 15-minute live evening demos to directly acquire registrations without ambassador intermediary.",
      },
    ],
    effortRequired: 6,
    budgetRequired: 250,
    uncertaintyNote: "Requires immediate 24-hour ambassador re-engagement before momentum is lost.",
  },
  {
    id: "fail_conv_halved",
    title: "3. Conversion Rates Cut in Half",
    tagline: "Students show banner blindness or skepticism about AI webinar promises",
    impactDescription: "Conversion rates across all channels drop by 50% (community conv drops to 3.5%, direct to 4.2%).",
    primaryBottleneck: "Messaging perceived as generic webinar fluff; lack of concrete proof of workshop outcome.",
    recoveryPlan: [
      {
        step: "A/B Deploy Project-Proof Hook Variant",
        detail: "Immediately switch all broadcast copy to Experiment B's outcome-focused pitch ('Build a working resume AI project').",
      },
      {
        step: "Publish GitHub Code Repository Screenshot",
        detail: "Share the actual 45-line Python script participants will deploy live to prove technical credibility.",
      },
      {
        step: "Simplify Registration Page to 3 Fields",
        detail: "Remove all optional fields on registration form to slash mobile drop-off rate.",
      },
    ],
    effortRequired: 5,
    budgetRequired: 150,
    uncertaintyNote: "Conversion changes take 12-24 hours to reflect across campus groups.",
  },
  {
    id: "fail_overlap_spike",
    title: "4. Channel Overlap Spikes to 38%",
    tagline: "Ambassadors, coding clubs, and CRs are reaching the exact same batchmates",
    impactDescription: "Heavy deduplication cuts net unique registrations by over 130 as the same students receive multiple invites.",
    primaryBottleneck: "Audience cannibalization and lack of cross-college channel segmentation.",
    recoveryPlan: [
      {
        step: "Assign Strict College Segmentation to Ambassadors",
        detail: "Map each ambassador to a distinct department or non-partner campus to eliminate duplicate outreach.",
      },
      {
        step: "Expand to Tier-2 Regional Engineering Colleges",
        detail: "Contact 3 regional engineering college clubs outside the primary circle to unlock fresh student pools.",
      },
      {
        step: "Leverage Department-Specific Angles (ECE/EEE/Mech)",
        detail: "Pitch AI application tailored for non-CS engineers looking for IT placement software projects.",
      },
    ],
    effortRequired: 7,
    budgetRequired: 300,
    uncertaintyNote: "Tier-2 colleges may require 24h longer to establish contact and credibility.",
  },
  {
    id: "fail_budget_cut",
    title: "5. Budget Slashed from ₹2,000 to ₹1,000",
    tagline: "Growth budget reduced by 50% due to administrative budget reallocation",
    impactDescription: "Total spend capped at ₹1,000. Eliminates all paid promotional boosts and club sponsorship fees.",
    primaryBottleneck: "Capital restriction forcing 100% reliance on zero-dollar organic and relationship channels.",
    recoveryPlan: [
      {
        step: "Shift Incentives to Non-Monetary Digital Swag",
        detail: "Replace cash incentives with exclusive access to NxtWave's AI Interview Guide and VIP GitHub template.",
      },
      {
        step: "Maximize Placement CR Circular Broadcasts",
        detail: "Double down on Class Representatives who broadcast for student career benefit without requiring honorariums.",
      },
      {
        step: "Host Open Tech Teaser on YouTube / Discord",
        detail: "Use free live streaming infrastructure to run a viral 15-minute live coding preview.",
      },
    ],
    effortRequired: 10,
    budgetRequired: 0,
    uncertaintyNote: "Trades monetary spend directly for additional manual hustle hours from the growth team.",
  },
  {
    id: "fail_time_crunch",
    title: "6. Only 4 Days Remain in Campaign",
    tagline: "Late start or delayed approvals leaves only 96 hours to reach 500 registrations",
    impactDescription: "Required daily run-rate spikes from 71 regs/day to 125 regs/day.",
    primaryBottleneck: "Severe time compression requiring high-velocity broadcast channels over slow 1-on-1 chats.",
    recoveryPlan: [
      {
        step: "Deploy Simultaneous Multi-College Batch Blast",
        detail: "Trigger coordinated 7:00 PM evening broadcast across all 5 verified Class CR channels simultaneously.",
      },
      {
        step: "Launch 48-Hour 'Reserve Your Seat' Countdown",
        detail: "Introduce genuine workshop capacity messaging to encourage immediate same-day registrations.",
      },
      {
        step: "Activate Campus Ambassador Sprint Bonus",
        detail: "Offer top 3 ambassadors bonus recognition for registrations completed before Day 5 midnight.",
      },
    ],
    effortRequired: 9,
    budgetRequired: 350,
    uncertaintyNote: "High risk of broadcast fatigue if messages are perceived as spam.",
  },
];

export function FailureLabPage() {
  const {
    activeFailureScenario,
    applyFailureScenario,
    resetFailureScenario,
    projections,
  } = useGrowth();

  const activeScenarioData = FAILURE_SCENARIOS.find((s) => s.id === activeFailureScenario);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-[#0D1523] border border-[rgba(148,163,184,0.16)] rounded-xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/25">
                Stress Test Engine
              </span>
              <span className="text-xs text-[#A5B2C5]">
                Resilience & Crisis Simulation
              </span>
            </div>
            <h1 className="font-heading text-xl md:text-2xl font-bold text-[#F5F7FB] tracking-tight">
              Failure Lab
            </h1>
            <p className="text-xs md:text-sm text-[#A5B2C5] mt-1 max-w-2xl leading-relaxed">
              Stress-test the acquisition plan against 6 realistic campus failure modes. Shock the simulation, uncover critical bottlenecks, and deploy instant recovery playbooks.
            </p>
          </div>

          {activeFailureScenario && (
            <button
              onClick={resetFailureScenario}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#F5F7FB] bg-[#111C2E] hover:bg-[#18253D] border border-[rgba(148,163,184,0.16)] hover:border-[rgba(148,163,184,0.28)] rounded-lg transition-colors self-start md:self-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#C5F56A]" />
              <span>Reset to Baseline Strategy</span>
            </button>
          )}
        </div>

        {/* Resilience Philosophy banner */}
        <div className="mt-4 pt-3.5 border-t border-[rgba(148,163,184,0.12)] flex items-start gap-2 text-xs text-[#A5B2C5]">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-[#F5F7FB]">Resilience Architecture:</strong> Every campus campaign faces unexpected friction. This module computes deterministic recovery paths so the 500-registration target remains achievable.
          </span>
        </div>
      </div>

      {/* Scenario Selection Grid (6 presets) */}
      <div>
        <h2 className="text-[11px] font-mono font-semibold text-[#A5B2C5] uppercase tracking-wider mb-3">
          Select a Failure Mode to Stress-Test:
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {FAILURE_SCENARIOS.map((scenario) => {
            const isActive = activeFailureScenario === scenario.id;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => {
                  if (isActive) {
                    resetFailureScenario();
                  } else {
                    applyFailureScenario(scenario.id);
                  }
                }}
                className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? "bg-[#111C2E] border-rose-500/60 shadow-sm ring-1 ring-rose-500/40"
                    : "bg-[#0D1523] border-[rgba(148,163,184,0.16)] hover:border-[rgba(148,163,184,0.28)] hover:bg-[#111C2E]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isActive
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-[#0A1020] text-[#A5B2C5] border border-[rgba(148,163,184,0.12)]"
                      }`}
                    >
                      {isActive ? "Active Shock" : "Failure Scenario"}
                    </span>
                    <AlertTriangle
                      className={`w-3.5 h-3.5 ${
                        isActive ? "text-rose-400 animate-pulse" : "text-[#64748B]"
                      }`}
                    />
                  </div>

                  <h3 className="font-heading text-sm font-bold text-[#F5F7FB]">
                    {scenario.title}
                  </h3>
                  <p className="text-xs text-[#A5B2C5] mt-1 leading-relaxed">
                    {scenario.tagline}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[rgba(148,163,184,0.1)] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#64748B]">
                    {isActive ? "Click to deactivate" : "Simulate scenario"}
                  </span>
                  <span
                    className={`font-semibold text-xs flex items-center gap-1 ${
                      isActive ? "text-rose-400" : "text-[#4ADFFF]"
                    }`}
                  >
                    {isActive ? "Active" : "Run Test →"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Scenario Impact & Recovery Playbook */}
      {activeScenarioData ? (
        <div className="space-y-6 pt-2">
          {/* Shock impact status panel */}
          <div className="bg-[#0D1523] border border-rose-500/40 rounded-xl p-5 md:p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[rgba(148,163,184,0.12)]">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 shrink-0">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-semibold uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      Stress Test In Progress
                    </span>
                    <span className="text-xs text-[#A5B2C5]">
                      Active Shock: {activeScenarioData.title}
                    </span>
                  </div>
                  <h2 className="font-heading text-lg md:text-xl font-bold text-[#F5F7FB] mt-1">
                    Simulated Shock Impact
                  </h2>
                  <p className="text-xs md:text-sm text-[#A5B2C5] mt-1 max-w-3xl leading-relaxed">
                    {activeScenarioData.impactDescription}
                  </p>
                </div>
              </div>

              {/* Stress Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center shrink-0">
                <div className="p-2.5 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.14)]">
                  <p className="text-[10px] font-mono text-[#64748B] uppercase">Projected Unique</p>
                  <p className="font-mono text-xl font-bold text-rose-400">
                    {projections.projectedUnique}
                  </p>
                  <p className="text-[10px] text-[#A5B2C5]">Goal: 500</p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.14)]">
                  <p className="text-[10px] font-mono text-[#64748B] uppercase">Deficit / Gap</p>
                  <p className="font-mono text-xl font-bold text-[#FB923C]">
                    {projections.gap}
                  </p>
                  <p className="text-[10px] text-[#A5B2C5]">short of target</p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.14)] col-span-2 sm:col-span-1">
                  <p className="text-[10px] font-mono text-[#64748B] uppercase">Run-Rate Needed</p>
                  <p className="font-mono text-xl font-bold text-[#FB923C]">
                    {projections.dailyRunRateRequired}
                  </p>
                  <p className="text-[10px] text-[#A5B2C5]">regs / day</p>
                </div>
              </div>
            </div>

            {/* Identified Primary Bottleneck */}
            <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-rose-300">
                  Critical Bottleneck Identified
                </h4>
                <p className="text-xs md:text-sm text-[#F5F7FB] mt-0.5 font-medium leading-relaxed">
                  {activeScenarioData.primaryBottleneck}
                </p>
              </div>
            </div>
          </div>

          {/* Recovery Playbook */}
          <div className="bg-[#0D1523] border border-[#4ADFFF]/30 rounded-xl p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(148,163,184,0.12)]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#4ADFFF]/10 border border-[#4ADFFF]/25 text-[#4ADFFF]">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading text-base md:text-lg font-bold text-[#F5F7FB]">
                    Crisis Recovery Playbook
                  </h3>
                  <p className="text-xs text-[#A5B2C5]">
                    Recommended counter-measures to close the {projections.gap} registration deficit
                  </p>
                </div>
              </div>

              {/* Trade-off pills */}
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#0A1020] border border-[rgba(148,163,184,0.14)] text-[#A5B2C5]">
                  <Clock className="w-3.5 h-3.5 text-[#4ADFFF]" />
                  <span>+{activeScenarioData.effortRequired} hrs effort</span>
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#0A1020] border border-[rgba(148,163,184,0.14)] text-[#A5B2C5]">
                  <DollarSign className="w-3.5 h-3.5 text-[#FB923C]" />
                  <span>+₹{activeScenarioData.budgetRequired} budget</span>
                </span>
              </div>
            </div>

            {/* Step-by-step action items */}
            <div className="space-y-2.5 pt-1">
              {activeScenarioData.recoveryPlan.map((action, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.12)] flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-[#4ADFFF]/10 border border-[#4ADFFF]/25 text-[#4ADFFF] flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-heading text-xs md:text-sm font-semibold text-[#F5F7FB]">
                      {action.step}
                    </h4>
                    <p className="text-xs text-[#A5B2C5] mt-1 leading-relaxed">
                      {action.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Uncertainty Analysis */}
            <div className="p-3.5 rounded-lg bg-[#111C2E] border border-[rgba(148,163,184,0.14)] flex items-start gap-2.5 text-xs">
              <HelpCircle className="w-4 h-4 text-[#FB923C] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#FB923C] block mb-0.5">
                  Recommendation Uncertainty & Constraints:
                </span>
                <p className="text-[#A5B2C5] leading-relaxed">
                  {activeScenarioData.uncertaintyNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State / Prompt to choose */
        <div className="p-8 rounded-xl bg-[#0D1523] border border-[rgba(148,163,184,0.16)] text-center space-y-2">
          <ShieldAlert className="w-8 h-8 text-[#4ADFFF] mx-auto" />
          <h3 className="font-heading text-sm font-bold text-[#F5F7FB]">
            Strategy Resilience Healthy (Baseline Mode)
          </h3>
          <p className="text-xs text-[#A5B2C5] max-w-md mx-auto leading-relaxed">
            Select any of the 6 failure scenarios above to test how the acquisition engine responds to adverse campus conditions.
          </p>
        </div>
      )}
    </div>
  );
}
