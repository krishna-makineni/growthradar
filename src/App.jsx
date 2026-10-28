import React, { useState, useEffect } from "react";
import { GrowthProvider, useGrowth } from "./context/GrowthContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Navbar } from "./components/layout/Navbar";
import { OverviewPage } from "./components/overview/OverviewPage";
import { OpportunityRadarPage } from "./components/radar/OpportunityRadarPage";
import { SimulatorPage } from "./components/simulator/SimulatorPage";
import { MissionsPage } from "./components/missions/MissionsPage";
import { ExperimentsPage } from "./components/experiments/ExperimentsPage";
import { FailureLabPage } from "./components/failure/FailureLabPage";
import { CopilotPage } from "./components/copilot/CopilotPage";
import { RegistrationPage } from "./components/register/RegistrationPage";
import { LeaderboardModal } from "./components/register/LeaderboardModal";
import { ConfirmDialog } from "./components/common/Modal";

function MainApp() {
  const { resetAllDemoData } = useGrowth();

  const normalizeTabId = (raw) => {
    if (!raw) return "overview";
    const cleaned = raw.toLowerCase().trim();
    if (cleaned.includes("reg")) return "register";
    if (cleaned.includes("opp") || cleaned.includes("radar")) return "radar";
    if (cleaned.includes("sim")) return "simulator";
    if (cleaned.includes("miss")) return "missions";
    if (cleaned.includes("exp")) return "experiments";
    if (cleaned.includes("fail")) return "failure-lab";
    if (cleaned.includes("copilot")) return "copilot";
    if (cleaned.includes("over") || cleaned.includes("home")) return "overview";
    return "overview";
  };

  // Tab navigation state
  const [currentTab, setCurrentTab] = useState(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname.replace("/", "");
      const hash = window.location.hash.replace("#", "");
      if (path && path !== "/") return normalizeTabId(path);
      if (hash) return normalizeTabId(hash);
    }
    return "overview";
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Sync tab changes to URL hash for shareable links
  const handleSelectTab = (tabId) => {
    setCurrentTab(tabId);
    if (typeof window !== "undefined") {
      window.location.hash = tabId;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Listen to browser hash changes (e.g. back/forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setCurrentTab(normalizeTabId(hash));
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F5F7FA] flex flex-col font-sans">
      {/* Persistent Sidebar (desktop) and mobile drawer */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onResetDemoClick={() => setIsResetConfirmOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        {/* Sticky Top Navbar */}
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onSelectTab={handleSelectTab}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        />

        {/* Dynamic Page View Body */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {currentTab === "overview" && <OverviewPage onNavigate={handleSelectTab} />}
          {currentTab === "radar" && <OpportunityRadarPage />}
          {currentTab === "simulator" && <SimulatorPage />}
          {currentTab === "missions" && <MissionsPage />}
          {currentTab === "experiments" && <ExperimentsPage />}
          {currentTab === "failure-lab" && <FailureLabPage />}
          {currentTab === "copilot" && <CopilotPage />}
          {currentTab === "register" && <RegistrationPage />}
        </main>

        {/* App Footer */}
        <footer className="border-t border-[#1E2B45] py-5 px-6 text-center text-xs text-[#64748B] bg-[#0F1626]/60">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              <strong className="text-[#9BA8BB]">Campus Growth Radar</strong> — Built for NxtWave Growth Intern Challenge.
            </p>
            <p className="text-[11px]">
              Workshop: “Build Your First AI Project in 60 Minutes” • 500 Unique Target • ₹2,000 Budget
            </p>
          </div>
        </footer>
      </div>

      {/* Ambassador Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      {/* Global Reset Demo Data Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetAllDemoData}
        title="Reset All Demo Data"
        message="This will reset all simulator assumptions, community rankings, missions, experiments, and test registrations to clean initial defaults. Do you wish to proceed?"
        confirmText="Reset Entire Demo"
      />
    </div>
  );
}

export default function App() {
  return (
    <GrowthProvider>
      <MainApp />
    </GrowthProvider>
  );
}
