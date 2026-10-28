import React from "react";
import { Target, Users, TrendingUp, Wallet, Clock, Percent, DollarSign } from "lucide-react";
import { useGrowth } from "../../context/GrowthContext";

export function KpiGrid() {
  const { campaignSettings, simulatorParams, projections, actualRegistrations } = useGrowth();
  const actualCount = actualRegistrations.length;

  const kpis = [
    {
      label: "Campaign Target",
      value: "500",
      subtext: "Unique final-year students",
      icon: Target,
      color: "text-[#F5F7FA]",
      badge: "Fixed Goal",
      badgeColor: "bg-[#1E2B45] text-[#9BA8BB]",
    },
    {
      label: "Actual Recorded Registrations",
      value: actualCount.toString(),
      subtext: "Submitted via live test portal",
      icon: Users,
      color: "text-[#51D6C7]",
      badge: "Real Test Records",
      badgeColor: "bg-[#51D6C7]/15 text-[#51D6C7] border border-[#51D6C7]/30",
    },
    {
      label: "Projected Unique Registrations",
      value: projections.projectedUnique.toString(),
      subtext: `${projections.gap > 0 ? projections.gap + " gap to 500" : "Target Achieved (+ " + Math.abs(projections.gap) + ")"}`,
      icon: TrendingUp,
      color: projections.projectedUnique >= 500 ? "text-[#B8F56A]" : "text-[#FB923C]",
      badge: projections.projectedUnique >= 500 ? "On Track" : "Action Needed",
      badgeColor: projections.projectedUnique >= 500
        ? "bg-[#B8F56A]/15 text-[#B8F56A] border border-[#B8F56A]/30"
        : "bg-[#FB923C]/15 text-[#FB923C] border border-[#FB923C]/30",
    },
    {
      label: "Budget Allocated / Remaining",
      value: `₹${projections.totalAllocatedBudget} / ₹${projections.budgetRemaining}`,
      subtext: `Total sprint budget: ₹${simulatorParams.budget}`,
      icon: Wallet,
      color: projections.budgetRemaining >= 0 ? "text-[#F5F7FA]" : "text-rose-400",
      badge: projections.budgetRemaining >= 0 ? "Under Cap" : "Over Budget",
      badgeColor: projections.budgetRemaining >= 0
        ? "bg-[#1E2B45] text-[#9BA8BB]"
        : "bg-rose-500/15 text-rose-400 border border-rose-500/30",
    },
    {
      label: "Blended Cost per Registration (CAC)",
      value: `₹${projections.blendedCAC}`,
      subtext: `Benchmark: < ₹4.00 per final year`,
      icon: DollarSign,
      color: "text-[#51D6C7]",
      badge: "Unit Economics",
      badgeColor: "bg-[#1E2B45] text-[#9BA8BB]",
    },
    {
      label: "Campaign Days Remaining",
      value: `${simulatorParams.campaignDays} Days`,
      subtext: "Sprint timeline window",
      icon: Clock,
      color: "text-[#F5F7FA]",
      badge: "7-Day Sprint",
      badgeColor: "bg-[#1E2B45] text-[#9BA8BB]",
    },
    {
      label: "Forecast Target Completion",
      value: `${projections.percentage}%`,
      subtext: `${projections.dailyRunRateProjected} regs/day projected run-rate`,
      icon: Percent,
      color: projections.percentage >= 100 ? "text-[#B8F56A]" : "text-[#FACC15]",
      badge: "Progress Index",
      badgeColor: "bg-[#1E2B45] text-[#9BA8BB]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className="bg-[#121A2B] border border-[#1E2B45] rounded-xl p-4.5 hover:border-[#2B3A58] transition-all"
          >
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="text-xs text-[#9BA8BB] font-medium tracking-tight">
                {kpi.label}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-semibold tracking-wide ${kpi.badgeColor}`}>
                {kpi.badge}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className={`text-2xl font-bold tracking-tight ${kpi.color}`}>
                {kpi.value}
              </span>
              <Icon className="w-4 h-4 text-[#64748B]" />
            </div>
            <p className="text-[11px] text-[#9BA8BB] mt-1.5 truncate">
              {kpi.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
