import React from "react";
import { Modal } from "../common/Modal";
import { Trophy, Award, Users, Share2, Sparkles, Shield } from "lucide-react";
import { useGrowth } from "../../context/GrowthContext";

export function LeaderboardModal({ isOpen, onClose }) {
  const { ambassadors, actualRegistrations } = useGrowth();

  // Combine ambassador referrals and real test registrations attributed to them
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
        <div className="p-3 rounded-lg bg-[#0F1626] border border-[#1E2B45] flex items-center justify-between text-xs text-[#9BA8BB]">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#51D6C7]" />
            <span>
              <strong>Privacy Protection:</strong> Student emails are strictly masked in public leaderboard rankings.
            </span>
          </div>
          <span className="text-[10px] font-semibold text-[#51D6C7] bg-[#51D6C7]/10 px-2 py-0.5 rounded border border-[#51D6C7]/20 uppercase">
            Simulated Network
          </span>
        </div>

        {/* Leaderboard Table */}
        <div className="border border-[#1E2B45] rounded-xl overflow-hidden bg-[#0F1626]">
          <table className="w-full text-left text-xs text-[#9BA8BB]">
            <thead className="bg-[#121A2B] text-[#F5F7FA] uppercase tracking-wider text-[10px] border-b border-[#1E2B45]">
              <tr>
                <th className="py-2.5 px-3.5">Rank & Ambassador</th>
                <th className="py-2.5 px-3">Campus & Channel</th>
                <th className="py-2.5 px-3 text-center">Referral Code</th>
                <th className="py-2.5 px-3 text-right">Clicks</th>
                <th className="py-2.5 px-3.5 text-right">Attributed Regs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2B45]/60">
              {sortedAmbassadors.map((amb, index) => {
                const isTop3 = index < 3;
                return (
                  <tr key={amb.id} className="hover:bg-[#141E33] transition-colors">
                    <td className="py-2.5 px-3.5 font-medium text-[#F5F7FA]">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                            index === 0
                              ? "bg-[#FACC15] text-[#0B1020]"
                              : index === 1
                              ? "bg-slate-300 text-[#0B1020]"
                              : index === 2
                              ? "bg-amber-600 text-white"
                              : "bg-[#1E2B45] text-[#9BA8BB]"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <div>
                          <span className="font-semibold text-[#F5F7FA] block">
                            {amb.displayName}
                          </span>
                          {amb.isDemo && (
                            <span className="text-[9px] text-[#64748B]">Simulated Rep</span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="text-[#F5F7FA] block">{amb.college}</span>
                      <span className="text-[10px] text-[#64748B]">{amb.channel}</span>
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <code className="text-[11px] font-mono font-bold text-[#B8F56A] bg-[#121A2B] px-2 py-0.5 rounded border border-[#1E2B45]">
                        {amb.referralCode}
                      </code>
                    </td>

                    <td className="py-2.5 px-3 text-right text-[#9BA8BB]">
                      {amb.clicks}
                    </td>

                    <td className="py-2.5 px-3.5 text-right font-bold text-[#B8F56A] text-sm">
                      {amb.registrations}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Link generator hint */}
        <div className="p-3.5 rounded-lg bg-[#141E33] border border-[#1E2B45] text-xs space-y-1.5">
          <p className="font-semibold text-[#F5F7FA]">How Referral Tracking Works:</p>
          <p className="text-[#9BA8BB]">
            Share links in the format:{" "}
            <code className="text-[#51D6C7] font-mono text-[11px]">
              /register?ref=AMB-PRIYA&source=coding_club
            </code>
            . When students complete registration, the referral code is validated and credited to the ambassador.
          </p>
        </div>
      </div>
    </Modal>
  );
}
