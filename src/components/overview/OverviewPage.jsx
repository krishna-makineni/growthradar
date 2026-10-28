import React from "react";
import {
  Calendar,
  DollarSign,
  Target,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Info,
} from "lucide-react";
import { useGrowth } from "../../context/GrowthContext";
import { KpiGrid } from "./KpiGrid";
import { RecommendedActionCard } from "./RecommendedActionCard";
import { TrajectoryChart } from "./TrajectoryChart";
import { ChannelBreakdownChart } from "./ChannelBreakdownChart";

export function OverviewPage({ onNavigate }) {
  const { campaignSettings, projections, actualRegistrations } = useGrowth();

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Campaign Header */}
      <div className="bg-[#121A2B] border border-[#1E2B45] rounded-xl p-5 md:p-6 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-[#B8F56A]/10 text-[#B8F56A] border border-[#B8F56A]/20">
                NxtWave Growth Sprint
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-[#51D6C7]/10 text-[#51D6C7] border border-[#51D6C7]/20">
                Mode: Simulation & Intelligence Tool
              </span>
              <span className="text-[10px] font-medium text-[#9BA8BB] bg-[#1E2B45] px-2 py-0.5 rounded">
                Target Audience: Final-Year Engineering Students
              </span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
              {campaignSettings.campaignName}
            </h1>
            <p className="text-xs md:text-sm text-[#9BA8BB] mt-1.5 max-w-3xl leading-relaxed">
              Acquisition intelligence framework to secure 500 unique student registrations in 7 days with ₹2,000 budget.
              Compare mathematical projections against live test submissions.
            </p>
          </div>

          {/* Quick parameter pills */}
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 text-xs shrink-0">
            <div className="px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] flex items-center gap-2">
              <Target className="w-4 h-4 text-[#B8F56A]" />
              <div>
                <p className="text-[10px] text-[#64748B]">Target Goal</p>
                <p className="font-bold text-[#F5F7FA]">500 Unique</p>
              </div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#51D6C7]" />
              <div>
                <p className="text-[10px] text-[#64748B]">Sprint Window</p>
                <p className="font-bold text-[#F5F7FA]">7 Days</p>
              </div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-[#0F1626] border border-[#1E2B45] flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#FACC15]" />
              <div>
                <p className="text-[10px] text-[#64748B]">Budget Cap</p>
                <p className="font-bold text-[#F5F7FA]">₹2,000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data boundary banner */}
        <div className="mt-4 pt-3.5 border-t border-[#1E2B45]/70 flex items-start sm:items-center gap-2.5 text-xs text-[#9BA8BB] bg-[#0B1020]/60 p-2.5 rounded-lg">
          <Info className="w-4 h-4 text-[#51D6C7] shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong className="text-[#F5F7FA]">Data Integrity Guarantee:</strong> Targets and projections represent mathematical simulations. Actual registrations reflect live test submissions via the embedded workshop portal.
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiGrid />

      {/* Recommended Next Action Panel */}
      <RecommendedActionCard onActionClick={() => onNavigate("radar")} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrajectoryChart />
        <ChannelBreakdownChart />
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate("radar")}
          className="text-left p-4 rounded-xl bg-[#121A2B] border border-[#1E2B45] hover:border-[#B8F56A]/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#B8F56A] uppercase tracking-wider">
              Signature Tool
            </span>
            <ArrowRight className="w-4 h-4 text-[#9BA8BB] group-hover:text-[#B8F56A] group-hover:translate-x-1 transition-all" />
          </div>
          <h2 className="text-sm font-bold text-[#F5F7FA]">Opportunity Radar</h2>
          <p className="text-xs text-[#9BA8BB] mt-1">
            Prioritize student clubs & class groups using transparent multi-factor scoring.
          </p>
        </button>

        <button
          onClick={() => onNavigate("simulator")}
          className="text-left p-4 rounded-xl bg-[#121A2B] border border-[#1E2B45] hover:border-[#51D6C7]/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#51D6C7] uppercase tracking-wider">
              Planning Engine
            </span>
            <ArrowRight className="w-4 h-4 text-[#9BA8BB] group-hover:text-[#51D6C7] group-hover:translate-x-1 transition-all" />
          </div>
          <h2 className="text-sm font-bold text-[#F5F7FA]">Growth Simulator</h2>
          <p className="text-xs text-[#9BA8BB] mt-1">
            Tune sliders for conversion, reach, ambassador output, and channel overlap rate.
          </p>
        </button>

        <button
          onClick={() => onNavigate("failure-lab")}
          className="text-left p-4 rounded-xl bg-[#121A2B] border border-[#1E2B45] hover:border-[#FB923C]/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#FB923C] uppercase tracking-wider">
              Resilience
            </span>
            <ArrowRight className="w-4 h-4 text-[#9BA8BB] group-hover:text-[#FB923C] group-hover:translate-x-1 transition-all" />
          </div>
          <h2 className="text-sm font-bold text-[#F5F7FA]">Failure Lab</h2>
          <p className="text-xs text-[#9BA8BB] mt-1">
            Stress-test strategy against 6 failure modes and generate instant recovery playbooks.
          </p>
        </button>
      </div>
    </div>
  );
}
