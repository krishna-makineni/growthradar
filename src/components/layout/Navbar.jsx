import React from "react";
import { Menu, UserCheck, Trophy, AlertCircle, QrCode } from "lucide-react";
import { useGrowth } from "../../context/GrowthContext";

export function Navbar({ onToggleSidebar, onSelectTab, onOpenLeaderboard, onOpenQr }) {
  const { campaignSettings, projections, actualRegistrations, activeFailureScenario } = useGrowth();
  const actualCount = actualRegistrations.length;

  return (
    <header className="sticky top-0 z-20 bg-[#070B14]/85 backdrop-blur-md border-b border-[rgba(148,163,184,0.16)] px-4 md:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Campaign identifier */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-[#A5B2C5] hover:text-[#F5F7FB] hover:bg-[#111C2E] rounded-lg md:hidden transition-colors cursor-pointer shrink-0"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#C5F56A] hidden sm:inline-block font-semibold">
                NxtWave Sprint
              </span>
              <span className="text-[#64748B] hidden sm:inline-block">•</span>
              <span className="text-xs text-[#A5B2C5] truncate max-w-[180px] sm:max-w-xs md:max-w-md font-medium">
                {campaignSettings.campaignName}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick metric indicators and primary actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {activeFailureScenario && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium animate-pulse">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Stress-Test Active</span>
            </div>
          )}

          {/* Actual test registrations count indicator */}
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#0D1523] border border-[rgba(148,163,184,0.16)] text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#A5B2C5]">Actual:</span>
              <span className="font-mono font-bold text-[#4ADFFF]">{actualCount}</span>
            </div>
            <span className="text-[#64748B]">/</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#A5B2C5]">Proj:</span>
              <span className="font-mono font-bold text-[#C5F56A]">{projections.projectedUnique}</span>
            </div>
          </div>

          {/* QR Code CTA */}
          <button
            onClick={onOpenQr}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#A5B2C5] hover:text-[#C5F56A] bg-[#0D1523] hover:bg-[#111C2E] border border-[rgba(148,163,184,0.16)] hover:border-[#C5F56A]/30 rounded-lg transition-colors cursor-pointer"
            title="Scan QR Code / Mobile Link"
          >
            <QrCode className="w-3.5 h-3.5 text-[#C5F56A]" />
            <span className="hidden sm:inline">QR Code</span>
          </button>

          {/* Ambassador Leaderboard CTA */}
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#A5B2C5] hover:text-[#F5F7FB] bg-[#0D1523] hover:bg-[#111C2E] border border-[rgba(148,163,184,0.16)] hover:border-[rgba(148,163,184,0.28)] rounded-lg transition-colors cursor-pointer"
            title="View Campus Ambassador Leaderboard"
          >
            <Trophy className="w-3.5 h-3.5 text-[#FB923C]" />
            <span className="hidden md:inline">Leaderboard</span>
          </button>

          {/* Live Registration portal CTA */}
          <button
            onClick={() => onSelectTab("register")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#070B14] bg-[#C5F56A] hover:bg-[#b8ea5e] rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Test Registration Form</span>
          </button>
        </div>
      </div>
    </header>
  );
}
