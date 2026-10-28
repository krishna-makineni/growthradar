import React from "react";
import { Modal } from "../common/Modal";
import { Calculator, Award, Zap, DollarSign, ShieldCheck } from "lucide-react";

export function ScoreExplanationModal({ isOpen, onClose, community }) {
  if (!community) return null;

  const { breakdown, priorityScore, confidence, accessStatus, expectedRegs, regsPerHour, costPerReg } = community;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transparent Community Scoring Engine"
      subtitle={`Detailed formula breakdown for: ${community.name}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 text-xs md:text-sm">
        {/* Score banner */}
        <div className="p-4 rounded-xl bg-[#0A1020] border border-[rgba(148,163,184,0.16)] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-[#A5B2C5] uppercase tracking-wider font-semibold">
              Composite Priority Score
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-mono text-3xl font-bold text-[#C5F56A]">
                {priorityScore}
              </span>
              <span className="text-xs text-[#64748B]">/ 100 max</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-mono font-medium text-[#4ADFFF] bg-[#4ADFFF]/10 px-2.5 py-1 rounded-full border border-[#4ADFFF]/25">
              Rank Tier: {priorityScore >= 75 ? "High Priority (P1)" : priorityScore >= 50 ? "Medium Priority (P2)" : "Low / Backlog (P3)"}
            </span>
          </div>
        </div>

        {/* Formula definition */}
        <div className="p-3.5 rounded-lg bg-[#111C2E] border border-[rgba(148,163,184,0.14)] space-y-1.5">
          <p className="font-semibold text-[#F5F7FB] flex items-center gap-1.5 text-xs">
            <Calculator className="w-3.5 h-3.5 text-[#C5F56A]" />
            Scoring Formula Specification
          </p>
          <p className="font-mono text-[11px] text-[#4ADFFF] bg-[#070B14] p-2 rounded border border-[rgba(148,163,184,0.16)] overflow-x-auto">
            Priority Score = [Volume(40%) + Velocity(25%) + CAC Efficiency(20%) + Access(10%) + Confidence(5%)] × Modifiers
          </p>
          <p className="text-[11px] text-[#A5B2C5] leading-relaxed">
            Deterministically computed from reachable audience, conversion assumptions, required effort hours, and access hurdles.
          </p>
        </div>

        {/* Factor breakdown table */}
        <div className="space-y-2">
          <p className="font-semibold text-[#F5F7FB] text-xs">Factor Contribution Breakdown:</p>

          <div className="space-y-2">
            {/* Volume Factor */}
            <div className="p-3 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.14)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-[#C5F56A]/10 text-[#C5F56A]">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-[#F5F7FB] text-xs">Expected Registration Volume (40 max)</p>
                  <p className="text-[11px] text-[#A5B2C5]">
                    {expectedRegs} estimated registrations ({community.reachableAudience} reachable × {(community.conversionRate * 100).toFixed(1)}% conv)
                  </p>
                </div>
              </div>
              <span className="font-mono font-bold text-[#C5F56A] text-sm">+{breakdown?.volumePoints || 0} pts</span>
            </div>

            {/* Velocity Factor */}
            <div className="p-3 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.14)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-[#4ADFFF]/10 text-[#4ADFFF]">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-[#F5F7FB] text-xs">Effort Velocity (25 max)</p>
                  <p className="text-[11px] text-[#A5B2C5]">
                    {regsPerHour} registrations per outreach hour ({community.effortHours}h effort required)
                  </p>
                </div>
              </div>
              <span className="font-mono font-bold text-[#4ADFFF] text-sm">+{breakdown?.velocityPoints || 0} pts</span>
            </div>

            {/* Cost Efficiency */}
            <div className="p-3 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.14)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-[#FB923C]/10 text-[#FB923C]">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-[#F5F7FB] text-xs">Cost Efficiency / CAC (20 max)</p>
                  <p className="text-[11px] text-[#A5B2C5]">
                    Est. CAC: ₹{costPerReg} per registration (₹{community.cost} total allocated budget)
                  </p>
                </div>
              </div>
              <span className="font-mono font-bold text-[#FB923C] text-sm">+{breakdown?.costPoints || 0} pts</span>
            </div>

            {/* Access & Confidence Modifiers */}
            <div className="p-3 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.14)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-purple-500/10 text-purple-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-[#F5F7FB] text-xs">Access Status & Confidence Multiplier</p>
                  <p className="text-[11px] text-[#A5B2C5]">
                    Access: <span className="capitalize font-medium text-[#F5F7FB]">{accessStatus.replace("_", " ")}</span> | Confidence: <span className="font-medium text-[#F5F7FB]">{confidence}</span>
                  </p>
                </div>
              </div>
              <span className="font-mono font-bold text-purple-400 text-sm">
                +{(breakdown?.accessPoints || 0) + (breakdown?.confidencePoints || 0)} pts
              </span>
            </div>
          </div>
        </div>

        {/* Strategic assessment */}
        <div className="p-3 rounded-lg bg-[#111C2E] border border-[rgba(148,163,184,0.14)] text-xs">
          <p className="font-semibold text-[#F5F7FB] mb-1">Growth Engine Assessment:</p>
          <p className="text-[#A5B2C5] leading-relaxed">{community.reason}</p>
        </div>
      </div>
    </Modal>
  );
}
