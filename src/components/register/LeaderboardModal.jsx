import React from "react";
import { Modal } from "../common/Modal";
import { Shield } from "lucide-react";
import { useGrowth } from "../../context/GrowthContext";

export function LeaderboardModal({ isOpen, onClose }) {
  const { ambassadors } = useGrowth();

  const sortedAmbassadors = [...ambassadors].sort(
    (a, b) => (b.registrations || 0) - (a.registrations || 0)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Campus Ambassador Referral Leaderboard"
      subtitle="Track peer referral attribution and top student evangelists"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 text-xs md:text-sm">
        {/* Privacy badge */}
        <div className="p-3 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.16)] flex items-center justify-between text-xs text-[#A5B2C5]">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#4ADFFF]" />
            <span>
              <strong>Privacy Protection:</strong> Student emails are masked in public leaderboard rankings.
            </span>
          </div>
          <span className="text-[10px] font-mono font-medium text-[#4ADFFF] bg-[#4ADFFF]/10 px-2 py-0.5 rounded border border-[#4ADFFF]/20 uppercase">
            Attribution Engine
          </span>
        </div>

        {/* Leaderboard Table */}
        <div className="border border-[rgba(148,163,184,0.16)] rounded-xl overflow-hidden bg-[#0A1020]">
          <table className="w-full text-left text-xs text-[#A5B2C5]">
            <thead className="bg-[#111C2E] text-[#F5F7FB] uppercase tracking-wider text-[10px] font-mono border-b border-[rgba(148,163,184,0.16)]">
              <tr>
                <th className="py-2.5 px-3.5">Rank & Ambassador</th>
                <th className="py-2.5 px-3">Campus & Channel</th>
                <th className="py-2.5 px-3 text-center">Referral Code</th>
                <th className="py-2.5 px-3 text-right">Clicks</th>
                <th className="py-2.5 px-3.5 text-right">Attributed Regs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(148,163,184,0.1)]">
              {sortedAmbassadors.map((amb, index) => {
                return (
                  <tr key={amb.id} className="hover:bg-[#111C2E]/60 transition-colors">
                    <td className="py-2.5 px-3.5 font-medium text-[#F5F7FB]">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
                            index === 0
                              ? "bg-[#C5F56A] text-[#070B14]"
                              : index === 1
                              ? "bg-[#4ADFFF] text-[#070B14]"
                              : index === 2
                              ? "bg-[#FB923C] text-[#070B14]"
                              : "bg-[#111C2E] text-[#A5B2C5]"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <div>
                          <span className="font-semibold text-[#F5F7FB] block">
                            {amb.displayName}
                          </span>
                          {amb.isDemo && (
                            <span className="text-[9px] font-mono text-[#64748B]">Simulated Rep</span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="text-[#F5F7FB] block">{amb.college}</span>
                      <span className="text-[10px] text-[#64748B]">{amb.channel}</span>
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <code className="text-[11px] font-mono font-bold text-[#C5F56A] bg-[#0D1523] px-2 py-0.5 rounded border border-[rgba(148,163,184,0.16)]">
                        {amb.referralCode}
                      </code>
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono text-[#A5B2C5]">
                      {amb.clicks}
                    </td>

                    <td className="py-2.5 px-3.5 text-right font-mono font-bold text-[#C5F56A] text-sm">
                      {amb.registrations}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Link generator hint */}
        <div className="p-3.5 rounded-lg bg-[#0A1020] border border-[rgba(148,163,184,0.14)] text-xs space-y-1.5">
          <p className="font-semibold text-[#F5F7FB]">How Referral Tracking Works:</p>
          <p className="text-[#A5B2C5]">
            Share links formatted as:{" "}
            <code className="text-[#4ADFFF] font-mono text-[11px] bg-[#070B14] px-1.5 py-0.5 rounded border border-[rgba(148,163,184,0.16)]">
              /register?ref=AMB-PRIYA&source=coding_club
            </code>
            . When students complete registration, the referral code is validated and credited to the ambassador.
          </p>
        </div>
      </div>
    </Modal>
  );
}
