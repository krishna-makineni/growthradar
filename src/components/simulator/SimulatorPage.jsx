import React from "react";
import {
  Sliders,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Percent,
  Wallet,
  Users,
  Info,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useGrowth } from "../../context/GrowthContext";
import { Card } from "../common/Card";
import { SIMULATOR_PRESETS } from "../../data/initialData";

export function SimulatorPage() {
  const {
    simulatorParams,
    updateSimulatorParams,
    activePreset,
    applySimulatorPreset,
    resetSimulatorParams,
    projections,
  } = useGrowth();

  const handleSliderChange = (key, value) => {
    updateSimulatorParams({ [key]: value });
  };

  const statusIcons = {
    feasible: <CheckCircle className="w-5 h-5 text-[#B8F56A]" />,
    requires_stronger: <AlertTriangle className="w-5 h-5 text-[#FACC15]" />,
    falls_short: <XCircle className="w-5 h-5 text-rose-400]" />,
  };

  const statusBorders = {
    feasible: "border-[rgba(184,245,106,0.4)] bg-[#121A2B]",
    requires_stronger: "border-[rgba(250,204,21,0.4)] bg-[#121A2B]",
    falls_short: "border-rose-500/40 bg-[#121A2B]",
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header & Preset Switcher */}
      <div className="bg-[#121A2B] border border-[#1E2B45] rounded-xl p-5 md:p-6 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-[#51D6C7]/10 text-[#51D6C7] border border-[#51D6C7]/20">
                Interactive Model
              </span>
              <span className="text-xs text-[#9BA8BB]">
                Target: 500 Unique Registrations
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#F5F7FA] tracking-tight">
              Growth Simulator
            </h1>
            <p className="text-xs md:text-sm text-[#9BA8BB] mt-1 max-w-2xl leading-relaxed">
              Model multichannel student acquisition, test channel sensitivity, and apply explicit cross-channel deduplication.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <span className="text-xs text-[#9BA8BB] font-medium mr-1 hidden sm:inline">
              Preset Scenarios:
            </span>
            {Object.entries(SIMULATOR_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                id={`preset-${key}-btn`}
                onClick={() => applySimulatorPreset(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activePreset === key
                    ? "bg-[#B8F56A] text-[#0B1020] shadow-sm"
                    : "bg-[#0F1626] text-[#9BA8BB] hover:text-[#F5F7FA] border border-[#1E2B45]"
                }`}
              >
                {preset.name}
              </button>
            ))}

            <button
              id="reset-simulator-btn"
              onClick={resetSimulatorParams}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#9BA8BB] hover:text-rose-400 bg-[#0F1626] border border-[#1E2B45] transition-colors cursor-pointer"
              title="Reset to default baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Overlap & Deduplication Notice */}
        <div className="mt-4 pt-3.5 border-t border-[#1E2B45]/70 flex items-start gap-2 text-xs text-[#9BA8BB]">
          <Layers className="w-4 h-4 text-[#51D6C7] shrink-0 mt-0.5" />
          <span>
            <strong className="text-[#F5F7FA]">Overlap Math Model:</strong> We apply an explicit deduplication factor:
            <code className="text-[#51D6C7] bg-[#0B1020] px-1.5 py-0.5 rounded mx-1 font-mono text-[11px]">
              Unique = Gross × (1 − Overlap Rate)
            </code>
            This accounts for students belonging to both coding clubs and class WhatsApp groups, preventing inflated totals.
          </span>
        </div>
      </div>

      {/* Real-time Feasibility Banner */}
      <div className={`p-5 rounded-xl border ${statusBorders[projections.feasibilityStatus]} shadow-lg transition-all`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 shrink-0">
              {statusIcons[projections.feasibilityStatus]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-bold text-[#F5F7FA]">
                  {projections.statusHeadline}
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#1E2B45] text-[#9BA8BB]">
                  Forecast Only (No Guarantees)
                </span>
              </div>
              <p className="text-xs md:text-sm text-[#9BA8BB] mt-1 leading-relaxed">
                {projections.statusMessage}
              </p>
            </div>
          </div>

          {/* Quick Metrics right */}
          <div className="flex items-center gap-4 text-center shrink-0 border-t md:border-t-0 md:border-l border-[#1E2B45] pt-3 md:pt-0 md:pl-5">
            <div>
              <p className="text-[10px] text-[#64748B] uppercase">Projected Unique</p>
              <p className="text-2xl font-black text-[#B8F56A]">
                {projections.projectedUnique}
              </p>
            </div>
            <div className="text-left text-xs">
              <p className="text-[#9BA8BB]">
                Gap: <strong className="text-[#F5F7FA]">{projections.gap} regs</strong>
              </p>
              <p className="text-[#9BA8BB]">
                Progress: <strong className="text-[#51D6C7]">{projections.percentage}%</strong>
              </p>
              <p className="text-[#9BA8BB]">
                Blended CAC: <strong className="text-[#FACC15]">₹{projections.blendedCAC}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls on Left, Metrics & Sensitivity on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card: Partner Student Clubs */}
          <Card title="1. Partner Student Clubs & Societies" subtitle="College coding clubs, IEEE, ACM chapters">
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#9BA8BB]">Reachable Student Audience</span>
                  <span className="font-bold text-[#F5F7FA]">{simulatorParams.communityReach.toLocaleString()} students</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="6000"
                  step="100"
                  value={simulatorParams.communityReach}
                  onChange={(e) => handleSliderChange("communityReach", Number(e.target.value))}
                  className="w-full accent-[#B8F56A] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#9BA8BB]">Conversion Rate</span>
                  <span className="font-bold text-[#B8F56A]">{(simulatorParams.communityConv * 100).toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.20"
                  step="0.005"
                  value={simulatorParams.communityConv}
                  onChange={(e) => handleSliderChange("communityConv", Number(e.target.value))}
                  className="w-full accent-[#B8F56A] cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-[#1E2B45] text-xs">
                <span className="text-[#64748B]">Channel Cost Allocation:</span>
                <span className="font-semibold text-[#51D6C7]">₹{simulatorParams.communityCost}</span>
              </div>
            </div>
          </Card>

          {/* Card: Campus Ambassadors */}
          <Card title="2. Campus Ambassador Network" subtitle="Peer-to-peer student evangelists with unique referral codes">
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#9BA8BB]">Active Student Ambassadors</span>
                  <span className="font-bold text-[#F5F7FA]">{simulatorParams.ambassadorsCount} ambassadors</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="30"
                  step="1"
                  value={simulatorParams.ambassadorsCount}
                  onChange={(e) => handleSliderChange("ambassadorsCount", Number(e.target.value))}
                  className="w-full accent-[#51D6C7] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#9BA8BB]">Registrations per Ambassador</span>
                  <span className="font-bold text-[#51D6C7]">{simulatorParams.regsPerAmbassador} regs / rep</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="35"
                  step="1"
                  value={simulatorParams.regsPerAmbassador}
                  onChange={(e) => handleSliderChange("regsPerAmbassador", Number(e.target.value))}
                  className="w-full accent-[#51D6C7] cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-[#1E2B45] text-xs">
                <span className="text-[#64748B]">Incentives / Swag Budget:</span>
                <span className="font-semibold text-[#51D6C7]">₹{simulatorParams.ambassadorCost}</span>
              </div>
            </div>
          </Card>

          {/* Card: Organic Content & Social */}
          <Card title="3. Organic Content & Viral Demos" subtitle="Short video demos, LinkedIn posts, tech carousels">
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#9BA8BB]">Organic Impressions / Reach</span>
                  <span className="font-bold text-[#F5F7FA]">{simulatorParams.organicReach.toLocaleString()} impressions</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="250"
                  value={simulatorParams.organicReach}
                  onChange={(e) => handleSliderChange("organicReach", Number(e.target.value))}
                  className="w-full accent-purple-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#9BA8BB]">Visitor Conversion Rate</span>
                  <span className="font-bold text-purple-400">{(simulatorParams.organicConv * 100).toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0.005"
                  max="0.08"
                  step="0.002"
                  value={simulatorParams.organicConv}
                  onChange={(e) => handleSliderChange("organicConv", Number(e.target.value))}
                  className="w-full accent-purple-400 cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-[#1E2B45] text-xs">
                <span className="text-[#64748B]">Content Boost Budget:</span>
                <span className="font-semibold text-[#51D6C7]">₹{simulatorParams.organicCost}</span>
              </div>
            </div>
          </Card>

          {/* Card: Class CR Direct Outreach */}
          <Card title="4. Final-Year Class Representative Outreach" subtitle="Direct broadcast in class WhatsApp & Telegram groups">
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#9BA8BB]">Reachable Class Students</span>
                  <span className="font-bold text-[#F5F7FA]">{simulatorParams.directOutreachReach.toLocaleString()} students</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="3000"
                  step="100"
                  value={simulatorParams.directOutreachReach}
                  onChange={(e) => handleSliderChange("directOutreachReach", Number(e.target.value))}
                  className="w-full accent-[#FACC15] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#9BA8BB]">CR Broadcast Conversion</span>
                  <span className="font-bold text-[#FACC15]">{(simulatorParams.directConv * 100).toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0.02"
                  max="0.20"
                  step="0.005"
                  value={simulatorParams.directConv}
                  onChange={(e) => handleSliderChange("directConv", Number(e.target.value))}
                  className="w-full accent-[#FACC15] cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-[#1E2B45] text-xs">
                <span className="text-[#64748B]">CR Appreciation Honorarium:</span>
                <span className="font-semibold text-[#51D6C7]">₹{simulatorParams.directCost}</span>
              </div>
            </div>
          </Card>

          {/* Card: Overlap & Budget Sliders */}
          <Card title="5. Cross-Channel Overlap & System Constraints" subtitle="Deduplication model & campaign window parameters">
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#9BA8BB]">Estimated Cross-Channel Overlap</span>
                  <span className="font-bold text-rose-400">{Math.round(simulatorParams.overlapRate * 100)}% overlap</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.40"
                  step="0.01"
                  value={simulatorParams.overlapRate}
                  onChange={(e) => handleSliderChange("overlapRate", Number(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
                <p className="text-[10px] text-[#64748B] mt-1">
                  Deduplicates {projections.deduplicatedOverlap} duplicate students across overlapping channels.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] text-[#9BA8BB] mb-1">
                    Total Budget (₹ INR)
                  </label>
                  <input
                    type="number"
                    value={simulatorParams.budget}
                    onChange={(e) => handleSliderChange("budget", Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#9BA8BB] mb-1">
                    Sprint Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={simulatorParams.campaignDays}
                    onChange={(e) => handleSliderChange("campaignDays", Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded bg-[#0F1626] border border-[#1E2B45] text-[#F5F7FA] font-bold"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Breakdown & Sensitivity Analysis (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Channel Contribution breakdown */}
          <Card title="Simulated Channel Output" subtitle="Gross potential vs deduplicated unique registrations">
            <div className="space-y-3">
              {projections.channels.map((ch, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#0F1626] border border-[#1E2B45]">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-[#F5F7FA]">{ch.name}</span>
                    <span className="font-bold text-[#B8F56A]">{ch.unique} unique</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#9BA8BB]">
                    <span>Gross: {ch.gross} | Reach: {ch.reach}</span>
                    <span>Cost: ₹{ch.cost} (₹{ch.cac}/reg)</span>
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t border-[#1E2B45] flex items-center justify-between text-xs">
                <span className="text-[#9BA8BB]">Total Gross Registrations:</span>
                <span className="font-bold text-[#F5F7FA]">{projections.totalGross}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#9BA8BB]">Overlap Deduplication:</span>
                <span className="font-bold text-rose-400">-{projections.deduplicatedOverlap}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#182238] border border-[rgba(184,245,106,0.3)] flex items-center justify-between text-xs">
                <span className="font-bold text-[#F5F7FA]">Projected Unique Total:</span>
                <span className="font-black text-lg text-[#B8F56A]">{projections.projectedUnique}</span>
              </div>
            </div>
          </Card>

          {/* Sensitivity Analysis Table */}
          <Card
            title="Conversion Sensitivity Stress-Test"
            subtitle="Impact on registration total if conversion fluctuates by ±20%"
          >
            <div className="space-y-2 text-xs">
              {projections.sensitivity.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border flex items-center justify-between ${
                    item.label === "Base Forecast"
                      ? "bg-[#182238] border-[#B8F56A]/40 text-[#F5F7FA]"
                      : "bg-[#0F1626] border-[#1E2B45] text-[#9BA8BB]"
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${
                        item.projected >= 500 ? "text-[#B8F56A]" : "text-[#FB923C]"
                      }`}
                    >
                      {item.projected} regs
                    </span>
                    <span className="text-[10px] text-[#64748B]">
                      ({item.projected >= 500 ? "Goal Met" : item.projected - 500})
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[#64748B] mt-2.5 leading-relaxed">
              * A 20% conversion drop cuts unique registrations by {Math.round(projections.projectedUnique * 0.2)}.
              Maintain ambassador motivation to insulate against conversion volatility.
            </p>
          </Card>

          {/* Unit Economics & Daily Velocity */}
          <Card title="Budget & Execution Velocity" subtitle="Daily run-rate requirements">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2 rounded bg-[#0F1626]">
                <span className="text-[#9BA8BB]">Required Daily Run-Rate:</span>
                <span className="font-bold text-[#F5F7FA]">{projections.dailyRunRateRequired} regs/day</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-[#0F1626]">
                <span className="text-[#9BA8BB]">Projected Daily Run-Rate:</span>
                <span className="font-bold text-[#B8F56A]">{projections.dailyRunRateProjected} regs/day</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-[#0F1626]">
                <span className="text-[#9BA8BB]">Total Budget Allocated:</span>
                <span className="font-bold text-[#51D6C7]">₹{projections.totalAllocatedBudget} / ₹{simulatorParams.budget}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-[#0F1626]">
                <span className="text-[#9BA8BB]">Budget Buffer:</span>
                <span className={`font-bold ${projections.budgetRemaining >= 0 ? "text-[#B8F56A]" : "text-rose-400"}`}>
                  ₹{projections.budgetRemaining}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
