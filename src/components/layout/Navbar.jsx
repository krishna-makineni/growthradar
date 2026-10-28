import React from "react";
import { Menu, UserCheck, Trophy, Sparkles, AlertCircle } from "lucide-react";
import { useGrowth } from "../../context/GrowthContext";

export function Navbar({ onToggleSidebar, onSelectTab, onOpenLeaderboard }) {
  const { campaignSettings, projections, actualRegistrations, activeFailureScenario } = useGrowth();
  const actualCount = actualRegistrations.length;

  return (
    <header className="sticky top-0 z-20 bg-[#0B1020]/90 backdrop-blur-md border-b border-[#1E2B45] px-4 md:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-[#9BA8BB] hover:text-[#F5F7FA] hover:bg-[#141E33] rounded-lg md:hidden transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#B8F56A] uppercase tracking-wider hidden sm:inline-block">
                NxtWave Growth Challenge
              </span>
              <span className="text-[#64748B] hidden sm:inline-block">•</span>
              <span className="text-xs text-[#9BA8BB] truncate max-w-[200px] sm:max-w-xs">
                {campaignSettings.campaignName}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick metric pills and primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {activeFailureScenario && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium animate-pulse">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Stress-Test Active</span>
            </div>
          )}

          {/* Actual test registrations count badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121A2B] border border-[#1E2B45] text-xs">
            <span className="text-[#9BA8BB]">Actual Recorded:</span>
            <span className="font-bold text-[#51D6C7]">{actualCount}</span>
            <span className="text-[#64748B]">/</span>
            <span className="text-[#9BA8BB]">Proj:</span>
            <span className="font-bold text-[#B8F56A]">{projections.projectedUnique}</span>
          </div>

          {/* Ambassador Leaderboard trigger */}
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#9BA8BB] hover:text-[#F5F7FA] bg-[#121A2B] hover:bg-[#18253D] border border-[#1E2B45] rounded-lg transition-colors"
            title="View Campus Ambassador Leaderboard"
          >
            <Trophy className="w-3.5 h-3.5 text-[#FACC15]" />
            <span className="hidden md:inline">Leaderboard</span>
          </button>

          {/* Live Registration portal CTA */}
          <button
            onClick={() => onSelectTab("register")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#0B1020] bg-[#B8F56A] hover:bg-[#a5dc5f] rounded-lg shadow-sm transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Test Registration Form</span>
          </button>
        </div>
      </div>
    </header>
  );
}
