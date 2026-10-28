import React from "react";
import {
  LayoutDashboard,
  Radar,
  Sliders,
  CheckSquare,
  FlaskConical,
  AlertTriangle,
  Sparkles,
  UserCheck,
  RotateCcw,
} from "lucide-react";

export const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "radar", label: "Opportunity Radar", icon: Radar, badge: "Signature" },
  { id: "simulator", label: "Growth Simulator", icon: Sliders },
  { id: "missions", label: "Missions", icon: CheckSquare },
  { id: "experiments", label: "Experiments", icon: FlaskConical },
  { id: "failure-lab", label: "Failure Lab", icon: AlertTriangle, badge: "Stress Test" },
  { id: "copilot", label: "AI Campaign Copilot", icon: Sparkles },
  { id: "register", label: "Workshop Registration", icon: UserCheck, badge: "Live Portal" },
];

export function Sidebar({ currentTab, onSelectTab, isOpen, onClose, onResetDemoClick }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-30 md:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      {/* Persistent sidebar on desktop, slide-in on mobile */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0A1020] border-r border-[rgba(148,163,184,0.16)] flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-[rgba(148,163,184,0.16)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C5F56A] flex items-center justify-center text-[#070B14] shadow-sm shrink-0">
              <Radar className="w-4 h-4 text-[#070B14]" strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h1 className="font-heading text-sm font-bold tracking-tight text-[#F5F7FB] truncate">
                Campus Growth Radar
              </h1>
              <p className="text-[11px] font-medium text-[#A5B2C5] truncate">
                NxtWave Growth Lab
              </p>
            </div>
          </div>
          <div className="mt-3.5 flex items-center justify-between pt-2.5 border-t border-[rgba(148,163,184,0.1)]">
            <span className="text-[10px] font-mono font-medium text-[#4ADFFF] bg-[#4ADFFF]/10 px-2 py-0.5 rounded border border-[#4ADFFF]/20">
              SIMULATION ENGINE
            </span>
            <span className="text-[11px] font-mono text-[#A5B2C5]">
              Target: <strong className="text-[#F5F7FB]">500</strong>
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
            Growth Modules
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors cursor-pointer group ${
                  isActive
                    ? "bg-[#C5F56A]/10 text-[#C5F56A] border-l-2 border-[#C5F56A]"
                    : "text-[#A5B2C5] hover:text-[#F5F7FB] hover:bg-[#111C2E] border-l-2 border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? "text-[#C5F56A]" : "text-[#64748B] group-hover:text-[#A5B2C5]"
                    }`}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                      item.badge === "Signature"
                        ? "bg-[#C5F56A]/15 text-[#C5F56A] border border-[#C5F56A]/30"
                        : item.badge === "Live Portal"
                        ? "bg-[#4ADFFF]/15 text-[#4ADFFF] border border-[#4ADFFF]/30"
                        : "bg-[#FB923C]/15 text-[#FB923C] border border-[#FB923C]/30"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[rgba(148,163,184,0.16)] space-y-2.5 bg-[#070B14]/40">
          <div className="p-3 rounded-lg bg-[#0D1523] border border-[rgba(148,163,184,0.14)]">
            <p className="text-[11px] font-semibold text-[#F5F7FB] line-clamp-2 leading-snug">
              “Build Your First AI Project in 60 Mins”
            </p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[rgba(148,163,184,0.1)] text-[10px] text-[#A5B2C5]">
              <span>7-Day Sprint</span>
              <span className="text-[#C5F56A] font-medium">₹2,000 Budget</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onResetDemoClick}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-[#A5B2C5] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-[rgba(148,163,184,0.16)] hover:border-rose-500/30 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </aside>
    </>
  );
}
