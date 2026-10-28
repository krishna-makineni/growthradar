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
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { Badge } from "../common/Badge";

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
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      {/* Persistent sidebar on desktop, slide-in on mobile */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0F1626] border-r border-[#1E2B45] flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-[#1E2B45]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#B8F56A] to-[#51D6C7] flex items-center justify-center shadow-lg shadow-[#B8F56A]/10 text-[#0B1020] font-black text-lg">
              <Radar className="w-5 h-5 text-[#0B1020]" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-[#F5F7FA] flex items-center gap-1.5">
                Campus Growth Radar
              </h1>
              <p className="text-[11px] font-medium text-[#9BA8BB]">
                NxtWave Growth Lab
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-[#51D6C7] bg-[#51D6C7]/10 px-2 py-0.5 rounded border border-[#51D6C7]/20 uppercase tracking-wider">
              Simulation Mode
            </span>
            <span className="text-[10px] text-[#9BA8BB]">
              Target: 500 Regs
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-[#64748B] uppercase">
            Growth Intelligence
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-[#18253D] text-[#B8F56A] border-l-3 border-[#B8F56A] font-semibold shadow-sm"
                    : "text-[#9BA8BB] hover:text-[#F5F7FA] hover:bg-[#141E33]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-[#B8F56A]" : "text-[#64748B]"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider ${
                      item.badge === "Signature"
                        ? "bg-[#B8F56A]/15 text-[#B8F56A]"
                        : item.badge === "Live Portal"
                        ? "bg-[#51D6C7]/15 text-[#51D6C7]"
                        : "bg-[#FB923C]/15 text-[#FB923C]"
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
        <div className="p-4 border-t border-[#1E2B45] space-y-3 bg-[#0B1020]/40">
          <div className="p-2.5 rounded-lg bg-[#141E33] border border-[#1E2B45]">
            <p className="text-[11px] font-semibold text-[#F5F7FA]">
              “Build Your First AI Project in 60 Mins”
            </p>
            <p className="text-[10px] text-[#9BA8BB] mt-1">
              7-Day Sprint | ₹2,000 Budget
            </p>
          </div>

          <button
            type="button"
            onClick={onResetDemoClick}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-[#9BA8BB] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-[#1E2B45] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </aside>
    </>
  );
}
