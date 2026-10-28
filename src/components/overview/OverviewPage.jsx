import React from "react";
import {
  Calendar,
  Wallet,
  Target,
  ArrowRight,
  Info,
  Radar,
  Sliders,
  AlertTriangle,
} from "lucide-react";
import { useGrowth } from "../../context/GrowthContext";
import { KpiGrid } from "./KpiGrid";
import { RecommendedActionCard } from "./RecommendedActionCard";
import { TrajectoryChart } from "./TrajectoryChart";
import { ChannelBreakdownChart } from "./ChannelBreakdownChart";

export function OverviewPage({ onNavigate }) {
  const { campaignSettings, simulatorParams, projections, recommendedAction } = useGrowth();
  const target = projections.targetRegistrations || campaignSettings.targetRegistrations || 500;
  const budget = simulatorParams.budget || campaignSettings.budget || 2000;
  const duration = simulatorParams.campaignDays || campaignSettings.durationDays || 7;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Campaign Hero Panel */}
      <div className="bg-[#0D1523] border border-[rgba(148,163,184,0.16)] rounded-xl p-5 md:p-6 shadow-sm relative overflow-hidden">
        {/* Subtle accent line on top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C5F56A] via-[#4ADFFF] to-transparent opacity-80" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded bg-[#C5F56A]/10 text-[#C5F56A] border border-[#C5F56A]/25">
                NxtWave Growth Lab
              </span>
              <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded bg-[#4ADFFF]/10 text-[#4ADFFF] border border-[#4ADFFF]/25">
                Acquisition Intelligence
              </span>
              <span className="text-[10px] text-[#A5B2C5] bg-[#111C2E] px-2 py-0.5 rounded border border-[rgba(148,163,184,0.12)]">
                Audience: Final-Year Engineering Students
              </span>
            </div>

            <h1 className="font-heading text-xl md:text-2xl lg:text-3xl font-bold text-[#F5F7FB] tracking-tight">
              {campaignSettings.campaignName}
            </h1>

            <p className="text-xs md:text-sm text-[#A5B2C5] max-w-3xl leading-relaxed">
              Seven-day sprint intelligence engine to achieve {target} unique student registrations for NxtWave's live AI build lab with a ₹{budget.toLocaleString()} budget cap.
            </p>
          </div>

          {/* Campaign Parameters Strip */}
          <div className="grid grid-cols-3 gap-2.5 shrink-0 self-stretch lg:self-auto">
            <div className="px-3.5 py-2.5 rounded-lg bg-[#111C2E] border border-[rgba(148,163,184,0.16)] flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-[#64748B] text-[10px] font-mono uppercase">
                <Target className="w-3.5 h-3.5 text-[#C5F56A]" />
                <span>Target</span>
              </div>
              <p className="font-mono text-sm md:text-base font-bold text-[#F5F7FB] mt-0.5">
                {target} <span className="text-[11px] font-normal text-[#A5B2C5]">Unique</span>
              </p>
            </div>

            <div className="px-3.5 py-2.5 rounded-lg bg-[#111C2E] border border-[rgba(148,163,184,0.16)] flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-[#64748B] text-[10px] font-mono uppercase">
                <Calendar className="w-3.5 h-3.5 text-[#4ADFFF]" />
                <span>Window</span>
              </div>
              <p className="font-mono text-sm md:text-base font-bold text-[#F5F7FB] mt-0.5">
                {duration} <span className="text-[11px] font-normal text-[#A5B2C5]">Days</span>
              </p>
            </div>

            <div className="px-3.5 py-2.5 rounded-lg bg-[#111C2E] border border-[rgba(148,163,184,0.16)] flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-[#64748B] text-[10px] font-mono uppercase">
                <Wallet className="w-3.5 h-3.5 text-[#FB923C]" />
                <span>Budget</span>
              </div>
              <p className="font-mono text-sm md:text-base font-bold text-[#F5F7FB] mt-0.5">
                ₹{budget.toLocaleString()} <span className="text-[11px] font-normal text-[#A5B2C5]">Cap</span>
              </p>
            </div>
          </div>
        </div>

        {/* Editorial Distinction Note */}
        <div className="mt-4 pt-3.5 border-t border-[rgba(148,163,184,0.12)] flex items-start sm:items-center gap-2.5 text-xs text-[#A5B2C5] bg-[#070B14]/60 p-2.5 rounded-lg">
          <Info className="w-4 h-4 text-[#4ADFFF] shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-normal">
            <span className="font-semibold text-[#F5F7FB]">Simulation vs Live Data:</span> Targets and channel yields are computed using the Growth Simulator's deduplication engine ({Math.round(projections.overlapRate * 100)}% overlap factor). Actual records reflect verified test registrations submitted via the live registration portal.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <KpiGrid />

      {/* Growth Decision Engine - Recommended Action */}
      <RecommendedActionCard
        onActionClick={() => onNavigate(recommendedAction?.targetTab || "radar")}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrajectoryChart />
        <ChannelBreakdownChart />
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate("radar")}
          className="text-left p-4 rounded-xl bg-[#0D1523] border border-[rgba(148,163,184,0.16)] hover:border-[#C5F56A]/40 hover:bg-[#111C2E] transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Radar className="w-3.5 h-3.5 text-[#C5F56A]" />
              <span className="text-[10px] font-mono font-bold text-[#C5F56A] uppercase tracking-wider">
                Signature Tool
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:text-[#C5F56A] group-hover:translate-x-0.5 transition-all" />
          </div>
          <h2 className="font-heading text-sm font-bold text-[#F5F7FB]">Opportunity Radar</h2>
          <p className="text-xs text-[#A5B2C5] mt-1 leading-relaxed">
            Prioritize student clubs & class groups using transparent multi-factor scoring and effort yield.
          </p>
        </button>

        <button
          onClick={() => onNavigate("simulator")}
          className="text-left p-4 rounded-xl bg-[#0D1523] border border-[rgba(148,163,184,0.16)] hover:border-[#4ADFFF]/40 hover:bg-[#111C2E] transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#4ADFFF]" />
              <span className="text-[10px] font-mono font-bold text-[#4ADFFF] uppercase tracking-wider">
                Planning Engine
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:text-[#4ADFFF] group-hover:translate-x-0.5 transition-all" />
          </div>
          <h2 className="font-heading text-sm font-bold text-[#F5F7FB]">Growth Simulator</h2>
          <p className="text-xs text-[#A5B2C5] mt-1 leading-relaxed">
            Tune sliders for conversion, reach, ambassador output, and channel overlap rate.
          </p>
        </button>

        <button
          onClick={() => onNavigate("failure-lab")}
          className="text-left p-4 rounded-xl bg-[#0D1523] border border-[rgba(148,163,184,0.16)] hover:border-[#FB923C]/40 hover:bg-[#111C2E] transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#FB923C]" />
              <span className="text-[10px] font-mono font-bold text-[#FB923C] uppercase tracking-wider">
                Resilience Lab
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:text-[#FB923C] group-hover:translate-x-0.5 transition-all" />
          </div>
          <h2 className="font-heading text-sm font-bold text-[#F5F7FB]">Failure Lab</h2>
          <p className="text-xs text-[#A5B2C5] mt-1 leading-relaxed">
            Stress-test strategy against 6 failure modes and generate instant recovery playbooks.
          </p>
        </button>
      </div>
    </div>
  );
}
