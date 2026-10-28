import React from "react";
import {
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Layers,
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
    feasible: <CheckCircle className="w-5 h-5 text-[#C5F56A]" />,
    requires_stronger: <AlertTriangle className="w-5 h-5 text-[#FB923C]" />,
    falls_short: <XCircle className="w-5 h-5 text-rose-400" />,
  };

  const statusBorders = {
    feasible: "border-[#C5F56A]/30 bg-[#0D1523]",
    requires_stronger: "border-[#FB923C]/30 bg-[#0D1523]",
    falls_short: "border-rose-500/30 bg-[#0D1523]",
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header & Preset Switcher */}
      <div className="bg-[#0D1523] border border-[rgba(148,163,184,0.16)] rounded-xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded bg-[#4ADFFF]/10 text-[#4ADFFF] border border-[#4ADFFF]/25">
                Interactive Model
              </span>
              <span className="text-xs text-[#A5B2C5]">
                Target: {simulatorParams.targetRegistrations || 500} Unique Registrations
              </span>
            </div>
            <h1 className="font-heading text-xl md:text-2xl font-bold text-[#F5F7FB] tracking-tight">
              Growth Simulator
            </h1>
            <p className="text-xs md:text-sm text-[#A5B2C5] mt-1 max-w-2xl leading-relaxed">
              Model multichannel student acquisition, test channel sensitivity, and apply explicit cross-channel deduplication.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <span className="text-xs text-[#A5B2C5] font-medium mr-1 hidden sm:inline">
              Preset Scenarios:
            </span>
            {Object.entries(SIMULATOR_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                id={`preset-${key}-btn`}
                onClick={() => applySimulatorPreset(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activePreset === key
                    ? "bg-[#C5F56A] text-[#070B14] shadow-sm font-bold"
                    : "bg-[#0A1020] text-[#A5B2C5] hover:text-[#F5F7FB] border border-[rgba(148,163,184,0.16)] hover:border-[rgba(148,163,184,0.28)]"
                }`}
              >
                {preset.name}
              </button>
            ))}

            <button
              id="reset-simulator-btn"
              onClick={resetSimulatorParams}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#A5B2C5] hover:text-rose-400 bg-[#0A1020] border border-[rgba(148,163,184,0.16)] hover:border-rose-500/30 transition-colors cursor-pointer"
              title="Reset to default baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Overlap & Deduplication Notice */}
        <div className="mt-4 pt-3.5 border-t border-[rgba(148,163,184,0.12)] flex items-start gap-2 text-xs text-[#A5B2C5]">
          <Layers className="w-4 h-4 text-[#4ADFFF] shrink-0 mt-0.5" />
          <span>
            <strong className="text-[#F5F7FB]">Deduplication Math Model:</strong> We apply an explicit overlap deduction:
            <code className="text-[#4ADFFF] bg-[#0A1020] px-1.5 py-0.5 rounded mx-1 font-mono text-[11px] border border-[rgba(148,163,184,0.16)]">
              Unique = Gross × (1 − Overlap Rate)
            </code>
            This accounts for students belonging to both coding clubs and class WhatsApp groups, preventing inflated totals.
          </span>
        </div>
      </div>

      {/* Real-time Feasibility Banner */}
      <div className={`p-5 rounded-xl border ${statusBorders[projections.feasibilityStatus]} shadow-sm transition-all`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 shrink-0">
              {statusIcons[projections.feasibilityStatus]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-base md:text-lg font-bold text-[#F5F7FB]">
                  {projections.statusHeadline}
                </h3>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#111C2E] text-[#A5B2C5] border border-[rgba(148,163,184,0.12)]">
                  Forecast Estimate
                </span>
              </div>
              <p className="text-xs md:text-sm text-[#A5B2C5] mt-1 leading-relaxed">
                {projections.statusMessage}
              </p>
            </div>
          </div>

          {/* Quick Metrics right */}
          <div className="flex items-center gap-4 text-center shrink-0 border-t md:border-t-0 md:border-l border-[rgba(148,163,184,0.16)] pt-3 md:pt-0 md:pl-5">
            <div>
              <p className="text-[10px] font-mono text-[#64748B] uppercase">Projected Unique</p>
              <p className="font-mono text-2xl md:text-3xl font-bold text-[#C5F56A]">
                {projections.projectedUnique}
              </p>
            </div>
            <div className="text-left text-xs space-y-0.5">
              <p className="text-[#A5B2C5]">
                Gap: <strong className="font-mono text-[#F5F7FB]">{projections.gap} regs</strong>
              </p>
              <p className="text-[#A5B2C5]">
                Progress: <strong className="font-mono text-[#4ADFFF]">{projections.percentage}%</strong>
              </p>
              <p className="text-[#A5B2C5]">
                Blended CAC: <strong className="font-mono text-[#FB923C]">₹{projections.blendedCAC}</strong>
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
          <Card
            title="1. Partner Student Clubs & Societies"
            subtitle="College coding clubs, IEEE, and ACM student chapters"
            badge={
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C5F56A]/10 text-[#C5F56A] border border-[#C5F56A]/25">
                Approved (5 Campuses)
              </span>
            }
          >
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#A5B2C5]">Reachable Student Audience Estimate</span>
                  <span className="font-mono font-bold text-[#F5F7FB]">{simulatorParams.communityReach.toLocaleString()} students</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="6000"
                  step="100"
                  value={simulatorParams.communityReach}
                  onChange={(e) => handleSliderChange("communityReach", Number(e.target.value))}
                  className="w-full accent-[#C5F56A] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#A5B2C5]">Expected Conversion Rate</span>
                  <span className="font-mono font-bold text-[#C5F56A]">{(simulatorParams.communityConv * 100).toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.20"
                  step="0.005"
                  value={simulatorParams.communityConv}
                  onChange={(e) => handleSliderChange("communityConv", Number(e.target.value))}
                  className="w-full accent-[#C5F56A] cursor-pointer"
                />
              </div>

              {/* Profile Metrics Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[rgba(148,163,184,0.1)] text-[11px]">
                <div className="p-2 rounded bg-[#0A1020] border border-[rgba(148,163,184,0.12)]">
                  <span className="text-[#64748B] block text-[9px] uppercase">Est. Gross / Unique</span>
                  <span className="font-mono font-bold text-[#F5F7FB]">{projections.grossCommunity} / <span className="text-[#C5F56A]">{Math.round(projections.grossCommunity * (1 - projections.overlapRate))}</span></span>
                </div>
                <div className="p-2 rounded bg-[#0A1020] border border-[rgba(148,163,184,0.12)]">
                  <span className="text-[#64748B] block text-[9px] uppercase">Execution Cost</span>
                  <span className="font-mono font-bold text-[#4ADFFF]">₹{simulatorParams.communityCost}</span>
                </div>
                <div className="p-2 rounded bg-[#0A1020] border border-[rgba(148,163,184,0.12)]">
                  <span className="text-[#64748B] block text-[9px] uppercase">Access Status</span>
                  <span className="font-semibold text-[#C5F56A]">Approved</span>
                </div>
                <div className="p-2 rounded bg-[#0A1020] border border-[rgba(148,163,184,0.12)]">
                  <span className="text-[#64748B] block text-[9px] uppercase">Confidence</span>
                  <span className="font-semibold text-[#F5F7FB]">High</span>
                </div>
              </div>
              <p className="text-[10px] text-[#64748B] italic">
                * Illustrative planning assumption based on partner college technical clubs.
              </p>
            </div>
          </Card>

          {/* Card: Campus Ambassadors */}
          <Card
            title="2. Campus Ambassador Network"
            subtitle="Peer-to-peer student evangelists with attributed referral codes"
            badge={
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4ADFFF]/10 text-[#4ADFFF] border border-[#4ADFFF]/25">
                Active (12 Reps)
              </span>
            }
          >
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#A5B2C5]">Number of Active Ambassadors</span>
                  <span className="font-mono font-bold text-[#F5F7FB]">{simulatorParams.ambassadorsCount} ambassadors</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="30"
                  step="1"
                  value={simulatorParams.ambassadorsCount}
                  onChange={(e) => handleSliderChange("ambassadorsCount", Number(e.target.value))}
                  className="w-full accent-[#4ADFFF] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#A5B2C5]">Estimated Registrations per Ambassador</span>
                  <span className="font-mono font-bold text-[#4ADFFF]">{simulatorParams.regsPerAmbassador} regs / rep</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="35"
                  step="1"
                  value={simulatorParams.regsPerAmbassador}
                  onChange={(e) => handleSliderChange("regsPerAmbassador", Number(e.target.value))}
                  className="w-full accent-[#4ADFFF] cursor-pointer"
                />
              </div>

              {/* Profile Metrics Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[rgba(148,163,184,0.1)] text-[11px]">
                <div className="p-2 rounded bg-[#0A1020] border border-[rgba(148,163,184,0.12)]">
                  <span className="text-[#64748B] block text-[9px] uppercase">Gross / Unique</span>
                  <span className="font-mono font-bold text-[#F5F7FB]">{projections.grossAmbassador} / <span className="text-[#4ADFFF]">{Math.round(projections.grossAmbassador * (1 - projections.overlapRate))}</span></span>
                </div>
                <div className="p-2 rounded bg-[#0A1020] border border-[rgba(148,163,184,0.12)]">
                  <span className="text-[#64748B] block text-[9px] uppercase">Reward Budget</span>
                  <span className="font-mono font-bold text-[#4ADFFF]">₹{simulatorParams.ambassadorCost}</span>
                </div>
                <div className="p-2 rounded bg-[#0A1020] border border-[rgba(148,163,184,0.12)]">
                  <span className="text-[#64748B] block text-[9px] uppercase">Operating Model</span>
                  <span className="font-semibold text-[#4ADFFF]">₹50 / Milestone</span>
                </div>
                <div className="p-2 rounded bg-[#0A1020] border border-[rgba(148,163,184,0.12)]">
                  <span className="text-[#64748B] block text-[9px] uppercase">Confidence</span>
                  <span className="font-semibold text-[#F5F7FB]">High</span>
                </div>
              </div>
              <p className="text-[10px] text-[#64748B] italic">
                * Illustrative planning assumption with attributed referral links and digital certificates.
              </p>
            </div>
          </Card>

          {/* Card: Organic Content & Social */}
          <Card
            title="3. Organic Content & Viral Demos"
            subtitle="Short video demos, LinkedIn posts, tech carousels, and Discord shares"
            badge={
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/25">
                Published & Live
              </span>
            }
          >
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#A5B2C5]">Estimated Organic Impressions / Reach</span>
                  <span className="font-mono font-bold text-[#F5F7FB]">{simulatorParams.organicReach.toLocaleString()} impressions</span>
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
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#A5B2C5]">Expected Visitor Conversion Rate</span>
                  <span className="font-mono font-bold text-purple-400">{(simulatorParams.organicConv * 100).toFixed(1)}%</span>
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

              {/* Profile Metrics Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[rgba(148,163,184,0.1)] text-[11px]">
                <div className="p-2 rounded bg-[#0A1020] border border-[rgba(148,163,184,0.12)]">
                  <span className="text-[#64748B] block text-[9px] uppercase">Gross / Unique</span>
                  <span className="font-mono font-bold text-[#F5F7FB]">{projections.grossOrganic} / <span className="text-purple-400">{Math.round(projections.grossOrganic * (1 - projections.overlapRate))}</span></span>
                </div>
                <div className="p-2 rounded bg-[#0A1020] border border-[rgba(148,163,184,0.12)]">
                  <span className="text-[#64748B] block text-[9px] uppercase">Creative Cost</span>
                  <span className="font-mono font-bold text-[#4ADFFF]">₹{simulatorParams.organicCost}</span>
                </div>
                <div className="p-2 rounded bg-[#0A1020] border border-[rgba(148,163,184,0.12)]">
                  <span className="text-[#64748B] block text-[9px] uppercase">Distribution</span>
                  <span className="font-semibold text-purple-400">Community Guilds</span>
                </div>
                <div className="p-2 rounded bg-[#0A1020] border border-[rgba(148,163,184,0.12)]">
                  <span className="text-[#64748B] block text-[9px] uppercase">Confidence</span>
                  <span className="font-semibold text-amber-400">Medium</span>
                </div>
              </div>
              <p className="text-[10px] text-[#64748B] italic">
                * Illustrative planning assumption subject to social feed algorithm volatility.
              </p>
            </div>
          </Card>

          {/* Card: Class CR Direct Outreach */}
          <Card
            title="4. Final-Year Class Representative Outreach"
            subtitle="Direct batch broadcast in official class WhatsApp and Telegram channels"
            badge={
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FB923C]/10 text-[#FB923C] border border-[#FB923C]/25">
                3 Approved • 2 Pending
              </span>
            }
          >
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#A5B2C5]">Reachable Final-Year Students</span>
                  <span className="font-mono font-bold text-[#F5F7FB]">{simulatorParams.directOutreachReach.toLocaleString()} students</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="3000"
                  step="100"
                  value={simulatorParams.directOutreachReach}
                  onChange={(e) => handleSliderChange("directOutreachReach", Number(e.target.value))}
                  className="w-full accent-[#FB923C] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#A5B2C5]">Expected CR Broadcast Conversion</span>
                  <span className="font-mono font-bold text-[#FB923C]">{(simulatorParams.directConv * 100).toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0.02"
                  max="0.20"
                  step="0.005"
                  value={simulatorParams.directConv}
                  onChange={(e) => handleSliderChange("directConv", Number(e.target.value))}
                  className="w-full accent-[#FB923C] cursor-pointer"
                />
              </div>

              {/* Profile Metrics Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[rgba(148,163,184,0.1)] text-[11px]">
                <div className="p-2 rounded bg-[#0A1020] border border-[rgba(148,163,184,0.12)]">
                  <span className="text-[#64748B] block text-[9px] uppercase">Gross / Unique</span>
                  <span className="font-mono font-bold text-[#F5F7FB]">{projections.grossDirect} / <span className="text-[#FB923C]">{Math.round(projections.grossDirect * (1 - projections.overlapRate))}</span></span>
                </div>
                <div className="p-2 rounded bg-[#0A1020] border border-[rgba(148,163,184,0.12)]">
                  <span className="text-[#64748B] block text-[9px] uppercase">CR Honorarium</span>
                  <span className="font-mono font-bold text-[#4ADFFF]">₹{simulatorParams.directCost}</span>
                </div>
                <div className="p-2 rounded bg-[#0A1020] border border-[rgba(148,163,184,0.12)]">
                  <span className="text-[#64748B] block text-[9px] uppercase">Permission Status</span>
                  <span className="font-semibold text-amber-400">Review Pending</span>
                </div>
                <div className="p-2 rounded bg-[#0A1020] border border-[rgba(148,163,184,0.12)]">
                  <span className="text-[#64748B] block text-[9px] uppercase">Confidence</span>
                  <span className="font-semibold text-[#F5F7FB]">High</span>
                </div>
              </div>
              <p className="text-[10px] text-[#64748B] italic">
                * Illustrative planning assumption relying on placement coordinator & batch CR goodwill.
              </p>
            </div>
          </Card>

          {/* Card: Overlap & Budget Sliders */}
          <Card title="5. Cross-Channel Overlap & System Constraints" subtitle="Deduplication model & campaign sprint window">
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#A5B2C5]">Estimated Cross-Channel Overlap</span>
                  <span className="font-mono font-bold text-rose-400">{Math.round(simulatorParams.overlapRate * 100)}% overlap</span>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] text-[#A5B2C5] mb-1">
                    Campaign Target (Regs)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="2500"
                    step="25"
                    value={simulatorParams.targetRegistrations || 500}
                    onChange={(e) => handleSliderChange("targetRegistrations", Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] font-mono font-bold focus:outline-none focus:border-[#C5F56A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#A5B2C5] mb-1">
                    Total Budget (₹ INR)
                  </label>
                  <input
                    type="number"
                    value={simulatorParams.budget}
                    onChange={(e) => handleSliderChange("budget", Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] font-mono font-bold focus:outline-none focus:border-[#C5F56A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#A5B2C5] mb-1">
                    Sprint Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={simulatorParams.campaignDays}
                    onChange={(e) => handleSliderChange("campaignDays", Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.18)] text-[#F5F7FB] font-mono font-bold focus:outline-none focus:border-[#C5F56A]"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Breakdown & Sensitivity Analysis (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Channel Contribution breakdown */}
          <Card title="Simulated Channel Output" subtitle="Gross reach vs deduplicated unique registrations">
            <div className="space-y-2.5">
              {projections.channels.map((ch, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.14)]">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-[#F5F7FB]">{ch.name}</span>
                    <span className="font-mono font-bold text-[#C5F56A]">{ch.unique} unique</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#A5B2C5]">
                    <span>Gross: <span className="font-mono">{ch.gross}</span> | Reach: <span className="font-mono">{ch.reach}</span></span>
                    <span>Cost: <span className="font-mono">₹{ch.cost}</span> (<span className="font-mono">₹{ch.cac}</span>/reg)</span>
                  </div>
                </div>
              ))}

              <div className="pt-2.5 border-t border-[rgba(148,163,184,0.12)] flex items-center justify-between text-xs">
                <span className="text-[#A5B2C5]">Total Gross Registrations:</span>
                <span className="font-mono font-bold text-[#F5F7FB]">{projections.totalGross}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#A5B2C5]">Overlap Deduplication:</span>
                <span className="font-mono font-bold text-rose-400">-{projections.deduplicatedOverlap}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#111C2E] border border-[#C5F56A]/30 flex items-center justify-between text-xs">
                <span className="font-bold text-[#F5F7FB]">Projected Unique Total:</span>
                <span className="font-mono font-bold text-xl text-[#C5F56A]">{projections.projectedUnique}</span>
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
                      ? "bg-[#111C2E] border-[#C5F56A]/35 text-[#F5F7FB]"
                      : "bg-[#0A1020] border-[rgba(148,163,184,0.14)] text-[#A5B2C5]"
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono font-bold ${
                        item.projected >= 500 ? "text-[#C5F56A]" : "text-[#FB923C]"
                      }`}
                    >
                      {item.projected} regs
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B]">
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
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.12)]">
                <span className="text-[#A5B2C5]">Required Daily Run-Rate:</span>
                <span className="font-mono font-bold text-[#F5F7FB]">{projections.dailyRunRateRequired} regs/day</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.12)]">
                <span className="text-[#A5B2C5]">Projected Daily Run-Rate:</span>
                <span className="font-mono font-bold text-[#C5F56A]">{projections.dailyRunRateProjected} regs/day</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.12)]">
                <span className="text-[#A5B2C5]">Total Budget Allocated:</span>
                <span className="font-mono font-bold text-[#4ADFFF]">₹{projections.totalAllocatedBudget} / ₹{simulatorParams.budget}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.12)]">
                <span className="text-[#A5B2C5]">Budget Buffer:</span>
                <span className={`font-mono font-bold ${projections.budgetRemaining >= 0 ? "text-[#C5F56A]" : "text-rose-400"}`}>
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
