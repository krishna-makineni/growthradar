import React from "react";
import { Target, Users, TrendingUp, Wallet, Clock, Percent, DollarSign } from "lucide-react";
import { useGrowth } from "../../context/GrowthContext";

export function KpiGrid() {
  const { simulatorParams, projections, actualRegistrations } = useGrowth();
  const actualCount = actualRegistrations.length;

  const target = projections.targetRegistrations || 500;
  const forecastCacDisplay = typeof projections.forecastCAC === "number" ? `₹${projections.forecastCAC.toFixed(2)}` : projections.forecastCAC;
  const targetCacDisplay = typeof projections.targetCAC === "number" ? `₹${projections.targetCAC.toFixed(2)}` : projections.targetCAC;
  const actualCacDisplay = projections.actualCAC === "N/A"
    ? "N/A"
    : (typeof projections.actualCAC === "number" ? `₹${projections.actualCAC.toFixed(2)}` : projections.actualCAC);

  const kpis = [
    {
      label: "Campaign Target",
      value: target.toString(),
      subtext: `Original planned pace: ${projections.originalTargetPace}/day`,
      icon: Target,
      color: "text-[#F5F7FB]",
      badge: "Goal",
      badgeClass: "bg-[#111C2E] text-[#A5B2C5] border-[rgba(148,163,184,0.16)]",
    },
    {
      label: "Actual Unique Registrations",
      value: actualCount.toString(),
      subtext: `${projections.actualRegistrationsRemaining} remaining to reach ${target}`,
      icon: Users,
      color: "text-[#4ADFFF]",
      badge: "Verified Test Records",
      badgeClass: "bg-[#4ADFFF]/10 text-[#4ADFFF] border-[#4ADFFF]/25",
    },
    {
      label: "Projected Unique Registrations",
      value: projections.projectedUnique.toString(),
      subtext: `Forecast model gap: ${projections.forecastGap} (${projections.forecastCompletion}% of goal)`,
      icon: TrendingUp,
      color: projections.projectedUnique >= target ? "text-[#C5F56A]" : "text-[#FB923C]",
      badge: projections.forecastGap === 0 ? "Target Supported" : "Deficit Model",
      badgeClass: projections.forecastGap === 0
        ? "bg-[#C5F56A]/10 text-[#C5F56A] border-[#C5F56A]/25"
        : "bg-[#FB923C]/10 text-[#FB923C] border-[#FB923C]/25",
    },
    {
      label: "Registrations Remaining to Target",
      value: projections.actualRegistrationsRemaining.toString(),
      subtext: `Target: ${target} − Actual: ${actualCount}`,
      icon: Clock,
      color: projections.actualRegistrationsRemaining === 0 ? "text-[#C5F56A]" : "text-[#F5F7FB]",
      badge: projections.actualRegistrationsRemaining === 0 ? "Target Achieved" : "In Progress",
      badgeClass: projections.actualRegistrationsRemaining === 0
        ? "bg-[#C5F56A]/10 text-[#C5F56A] border-[#C5F56A]/25"
        : "bg-[#111C2E] text-[#A5B2C5] border-[rgba(148,163,184,0.16)]",
    },
    {
      label: "Required Daily Pace (Today Onward)",
      value: `${projections.requiredDailyPace} / day`,
      subtext: `${projections.daysRemaining} days left (Original: ${projections.originalTargetPace}/day)`,
      icon: TrendingUp,
      color: typeof projections.requiredDailyPace === "number" && projections.projectedDailyRunRate >= projections.requiredDailyPace
        ? "text-[#C5F56A]"
        : "text-[#FB923C]",
      badge: typeof projections.requiredDailyPace === "number" && projections.projectedDailyRunRate >= projections.requiredDailyPace
        ? "Pace Met"
        : "Pace Deficit",
      badgeClass: typeof projections.requiredDailyPace === "number" && projections.projectedDailyRunRate >= projections.requiredDailyPace
        ? "bg-[#C5F56A]/10 text-[#C5F56A] border-[#C5F56A]/25"
        : "bg-[#FB923C]/10 text-[#FB923C] border-[#FB923C]/25",
    },
    {
      label: "Forecast Cost per Reg (CAC)",
      value: forecastCacDisplay,
      subtext: `Budget cap CAC: ${targetCacDisplay} • Actual CAC: ${actualCacDisplay}`,
      icon: DollarSign,
      color: "text-[#4ADFFF]",
      badge: "Unit Economics",
      badgeClass: "bg-[#111C2E] text-[#A5B2C5] border-[rgba(148,163,184,0.16)]",
    },
    {
      label: "Campaign Days Remaining",
      value: `${projections.daysRemaining} Days`,
      subtext: `Sprint timeline: Day ${Math.max(1, projections.totalCampaignDays - projections.daysRemaining + 1)} of ${projections.totalCampaignDays}`,
      icon: Clock,
      color: "text-[#F5F7FB]",
      badge: projections.daysRemaining <= 4 ? "Sprint Crunch" : "Active Sprint",
      badgeClass: projections.daysRemaining <= 4
        ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
        : "bg-[#111C2E] text-[#A5B2C5] border-[rgba(148,163,184,0.16)]",
    },
    {
      label: "Budget Allocated / Reserve Remaining",
      value: `₹${projections.totalAllocatedBudget} / ₹${projections.budgetRemaining}`,
      subtext: `Total sprint budget cap: ₹${projections.totalBudget}`,
      icon: Wallet,
      color: projections.budgetRemaining >= 0 ? "text-[#F5F7FB]" : "text-rose-400",
      badge: projections.budgetRemaining >= 0 ? "₹200 Reserve Pool" : "Over Budget",
      badgeClass: projections.budgetRemaining >= 0
        ? "bg-[#C5F56A]/10 text-[#C5F56A] border-[#C5F56A]/25"
        : "bg-rose-500/10 text-rose-400 border-rose-500/25",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className="bg-[#0D1523] border border-[rgba(148,163,184,0.16)] hover:border-[rgba(148,163,184,0.28)] rounded-xl p-4.5 transition-all duration-150 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs text-[#A5B2C5] font-medium tracking-tight">
                  {kpi.label}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-medium ${kpi.badgeClass}`}>
                  {kpi.badge}
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className={`font-mono text-2xl font-bold tracking-tight ${kpi.color}`}>
                  {kpi.value}
                </span>
                <Icon className="w-4 h-4 text-[#64748B] shrink-0" />
              </div>
            </div>
            <p className="text-[11px] text-[#64748B] mt-2.5 truncate border-t border-[rgba(148,163,184,0.08)] pt-2">
              {kpi.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
