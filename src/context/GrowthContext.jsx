import React, { createContext, useContext, useState, useEffect } from "react";
import {
  INITIAL_CAMPAIGN_SETTINGS,
  INITIAL_COMMUNITIES,
  INITIAL_SIMULATOR_PARAMS,
  SIMULATOR_PRESETS,
  INITIAL_MISSIONS,
  INITIAL_EXPERIMENTS,
  INITIAL_AMBASSADORS,
  INITIAL_TEST_REGISTRATIONS,
} from "../data/initialData";
import {
  calculateSimulatorProjections,
  calculateCommunityScore,
  generateRecommendedNextAction,
} from "../utils/growthCalculations";

const STORAGE_KEY = "nxtwave_campus_growth_radar_v1";

const GrowthContext = createContext(null);

export function GrowthProvider({ children }) {
  // Load state from localStorage or use initial data
  const loadInitialState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          campaignSettings: parsed.campaignSettings || INITIAL_CAMPAIGN_SETTINGS,
          simulatorParams: parsed.simulatorParams || INITIAL_SIMULATOR_PARAMS,
          activePreset: parsed.activePreset || "base",
          communities: parsed.communities || INITIAL_COMMUNITIES,
          missions: parsed.missions || INITIAL_MISSIONS,
          experiments: parsed.experiments || INITIAL_EXPERIMENTS,
          ambassadors: parsed.ambassadors || INITIAL_AMBASSADORS,
          actualRegistrations: parsed.actualRegistrations || INITIAL_TEST_REGISTRATIONS,
          activeFailureScenario: parsed.activeFailureScenario || null,
        };
      }
    } catch (e) {
      console.warn("Failed to load state from localStorage, using seed defaults:", e);
    }
    return {
      campaignSettings: INITIAL_CAMPAIGN_SETTINGS,
      simulatorParams: INITIAL_SIMULATOR_PARAMS,
      activePreset: "base",
      communities: INITIAL_COMMUNITIES,
      missions: INITIAL_MISSIONS,
      experiments: INITIAL_EXPERIMENTS,
      ambassadors: INITIAL_AMBASSADORS,
      actualRegistrations: INITIAL_TEST_REGISTRATIONS,
      activeFailureScenario: null,
    };
  };

  const initial = loadInitialState();

  const [campaignSettings, setCampaignSettings] = useState(initial.campaignSettings);
  const [simulatorParams, setSimulatorParams] = useState(initial.simulatorParams);
  const [activePreset, setActivePreset] = useState(initial.activePreset);
  const [communities, setCommunities] = useState(initial.communities);
  const [missions, setMissions] = useState(initial.missions);
  const [experiments, setExperiments] = useState(initial.experiments);
  const [ambassadors, setAmbassadors] = useState(initial.ambassadors);
  const [actualRegistrations, setActualRegistrations] = useState(initial.actualRegistrations);
  const [activeFailureScenario, setActiveFailureScenario] = useState(initial.activeFailureScenario);
  const [preFailureBackup, setPreFailureBackup] = useState(null);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        campaignSettings,
        simulatorParams,
        activePreset,
        communities,
        missions,
        experiments,
        ambassadors,
        actualRegistrations,
        activeFailureScenario,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Error saving state to localStorage:", e);
    }
  }, [
    campaignSettings,
    simulatorParams,
    activePreset,
    communities,
    missions,
    experiments,
    ambassadors,
    actualRegistrations,
    activeFailureScenario,
  ]);

  // Derived calculations
  const effectiveTarget = Number(simulatorParams.targetRegistrations || campaignSettings.targetRegistrations) || 500;
  
  // Actual spend computed from completed missions
  const actualSpend = missions
    .filter((m) => m.status === "completed")
    .reduce((sum, m) => sum + (Number(m.cost) || 0), 0);

  const projections = calculateSimulatorProjections(
    simulatorParams,
    effectiveTarget,
    {
      actualRegistrations,
      actualSpend,
      totalCampaignDays: simulatorParams.campaignDays || campaignSettings.durationDays || 7,
      daysRemaining: simulatorParams.daysRemaining !== undefined
        ? Number(simulatorParams.daysRemaining)
        : Number(simulatorParams.campaignDays || campaignSettings.durationDays || 7),
    }
  );

  const recommendedAction = generateRecommendedNextAction({
    simulatorParams,
    communities,
    actualRegistrations,
    missions,
    targetRegistrations: effectiveTarget,
    projections,
  });

  // Calculate scores for all communities
  const scoredCommunities = communities.map((comm) => ({
    ...comm,
    ...calculateCommunityScore(comm),
  }));

  // Actions
  const updateSimulatorParams = (newParams) => {
    setSimulatorParams((prev) => ({ ...prev, ...newParams }));
    if (newParams.targetRegistrations !== undefined) {
      setCampaignSettings((prev) => ({
        ...prev,
        targetRegistrations: Number(newParams.targetRegistrations) || 500,
      }));
    }
    if (newParams.budget !== undefined) {
      setCampaignSettings((prev) => ({
        ...prev,
        budget: Number(newParams.budget) || 2000,
      }));
    }
    if (newParams.campaignDays !== undefined) {
      setCampaignSettings((prev) => ({
        ...prev,
        durationDays: Number(newParams.campaignDays) || 7,
      }));
    }
    setActivePreset("custom");
  };

  const applySimulatorPreset = (presetKey) => {
    if (SIMULATOR_PRESETS[presetKey]) {
      const presetParams = SIMULATOR_PRESETS[presetKey].params;
      setSimulatorParams(presetParams);
      if (presetParams.targetRegistrations) {
        setCampaignSettings((prev) => ({
          ...prev,
          targetRegistrations: presetParams.targetRegistrations,
        }));
      }
      setActivePreset(presetKey);
    }
  };

  const resetSimulatorParams = () => {
    setSimulatorParams(INITIAL_SIMULATOR_PARAMS);
    setCampaignSettings(INITIAL_CAMPAIGN_SETTINGS);
    setActivePreset("base");
    setActiveFailureScenario(null);
  };

  // Community CRUD
  const addCommunity = (newCommunity) => {
    const id = "comm-" + Date.now();
    const created = {
      id,
      ...newCommunity,
      isDemo: false,
    };
    setCommunities((prev) => [created, ...prev]);
    return created;
  };

  const updateCommunity = (id, updatedFields) => {
    setCommunities((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteCommunity = (id) => {
    setCommunities((prev) => prev.filter((c) => c.id !== id));
  };

  // Missions CRUD
  const addMission = (missionData) => {
    const id = "m-" + Date.now();
    const newMission = {
      id,
      ...missionData,
      status: missionData.status || "not_started",
    };
    setMissions((prev) => [newMission, ...prev]);
    return newMission;
  };

  const updateMission = (id, updatedFields) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedFields } : m))
    );
  };

  const toggleMissionStatus = (id) => {
    const statusCycle = {
      not_started: "in_progress",
      in_progress: "completed",
      completed: "not_started",
      blocked: "in_progress",
    };
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStatus = statusCycle[m.status] || "not_started";
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
  };

  const deleteMission = (id) => {
    setMissions((prev) => prev.filter((m) => m.id !== id));
  };

  // Experiments CRUD
  const addExperiment = (expData) => {
    const id = "exp-" + Date.now();
    const newExp = {
      id,
      ...expData,
    };
    setExperiments((prev) => [newExp, ...prev]);
    return newExp;
  };

  const updateExperiment = (id, updatedFields) => {
    setExperiments((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, ...updatedFields } : exp))
    );
  };

  const deleteExperiment = (id) => {
    setExperiments((prev) => prev.filter((exp) => exp.id !== id));
  };

  // Registration & Duplicate checking
  const registerStudent = (formData) => {
    const normalizedEmail = (formData.email || "").trim().toLowerCase();

    // Check duplicate
    const existing = actualRegistrations.find(
      (r) => r.normalizedEmail === normalizedEmail
    );
    if (existing) {
      return {
        success: false,
        error: `The email "${normalizedEmail}" is already registered (Registration ID: ${existing.id}). Each student can register once.`,
      };
    }

    const regId = "REG-" + Math.floor(1000 + Math.random() * 9000);
    const newReg = {
      id: regId,
      name: formData.name.trim(),
      email: formData.email.trim(),
      normalizedEmail,
      graduationYear: formData.graduationYear || "2025",
      college: formData.college.trim(),
      source: formData.source || "direct",
      referralCode: formData.referralCode ? formData.referralCode.trim().toUpperCase() : "",
      createdAt: new Date().toISOString(),
      isDemo: true, // clearly labeled as test/demo registration
    };

    // Attribution update for ambassadors
    if (newReg.referralCode) {
      setAmbassadors((prev) =>
        prev.map((amb) => {
          if (amb.referralCode.toUpperCase() === newReg.referralCode) {
            return {
              ...amb,
              registrations: (amb.registrations || 0) + 1,
              clicks: (amb.clicks || 0) + 1,
            };
          }
          return amb;
        })
      );
    }

    setActualRegistrations((prev) => [newReg, ...prev]);
    return { success: true, registration: newReg };
  };

  // Failure Scenario Engine
  const applyFailureScenario = (scenarioId) => {
    if (!preFailureBackup) {
      setPreFailureBackup({ ...simulatorParams, activePreset });
    }
    setActiveFailureScenario(scenarioId);

    switch (scenarioId) {
      case "fail_admin_block":
        // Community administrators do not approve outreach (-60% reach, -30% conv)
        setSimulatorParams((prev) => ({
          ...prev,
          communityReach: Math.round(prev.communityReach * 0.4),
          communityConv: Number((prev.communityConv * 0.7).toFixed(3)),
        }));
        break;
      case "fail_ambassador_drop":
        // Ambassador registrations fall 60% below forecast
        setSimulatorParams((prev) => ({
          ...prev,
          regsPerAmbassador: Math.max(2, Math.round(prev.regsPerAmbassador * 0.4)),
        }));
        break;
      case "fail_conv_halved":
        // Conversion rates fall by half across all channels
        setSimulatorParams((prev) => ({
          ...prev,
          communityConv: Number((prev.communityConv * 0.5).toFixed(3)),
          organicConv: Number((prev.organicConv * 0.5).toFixed(3)),
          directConv: Number((prev.directConv * 0.5).toFixed(3)),
          regsPerAmbassador: Math.max(3, Math.round(prev.regsPerAmbassador * 0.5)),
        }));
        break;
      case "fail_overlap_spike":
        // Channel overlap spikes to 38%
        setSimulatorParams((prev) => ({
          ...prev,
          overlapRate: 0.38,
        }));
        break;
      case "fail_budget_cut":
        // Budget slashed from ₹2,000 to ₹1,000
        setSimulatorParams((prev) => ({
          ...prev,
          budget: 1000,
        }));
        break;
      case "fail_time_crunch":
        // Only 4 days remain in campaign (original plan was 7 days)
        setSimulatorParams((prev) => ({
          ...prev,
          campaignDays: 7,
          daysRemaining: 4,
        }));
        break;
      default:
        break;
    }
  };

  const resetFailureScenario = () => {
    if (preFailureBackup) {
      setSimulatorParams(preFailureBackup);
      setActivePreset(preFailureBackup.activePreset || "base");
      setPreFailureBackup(null);
    } else {
      resetSimulatorParams();
    }
    setActiveFailureScenario(null);
  };

  // Reset demo data: restores polished illustrative baseline without overwriting genuine user registrations
  const resetAllDemoData = (preserveLiveRegistrations = false) => {
    localStorage.removeItem(STORAGE_KEY);
    setCampaignSettings(INITIAL_CAMPAIGN_SETTINGS);
    setSimulatorParams(INITIAL_SIMULATOR_PARAMS);
    setActivePreset("base");
    setCommunities(INITIAL_COMMUNITIES);
    setMissions(INITIAL_MISSIONS);
    setExperiments(INITIAL_EXPERIMENTS);
    setAmbassadors(INITIAL_AMBASSADORS);
    if (preserveLiveRegistrations) {
      const liveUserRegistrations = actualRegistrations.filter((r) => !r.isSeed);
      setActualRegistrations([...INITIAL_TEST_REGISTRATIONS, ...liveUserRegistrations]);
    } else {
      setActualRegistrations(INITIAL_TEST_REGISTRATIONS);
    }
    setActiveFailureScenario(null);
    setPreFailureBackup(null);
  };

  const resetRegistrationsOnly = () => {
    setActualRegistrations([]);
  };

  return (
    <GrowthContext.Provider
      value={{
        campaignSettings,
        setCampaignSettings,
        simulatorParams,
        updateSimulatorParams,
        activePreset,
        applySimulatorPreset,
        resetSimulatorParams,
        communities: scoredCommunities,
        rawCommunities: communities,
        addCommunity,
        updateCommunity,
        deleteCommunity,
        missions,
        addMission,
        updateMission,
        toggleMissionStatus,
        deleteMission,
        experiments,
        addExperiment,
        updateExperiment,
        deleteExperiment,
        ambassadors,
        actualRegistrations,
        registerStudent,
        resetRegistrationsOnly,
        activeFailureScenario,
        applyFailureScenario,
        resetFailureScenario,
        resetAllDemoData,
        projections,
        recommendedAction,
      }}
    >
      {children}
    </GrowthContext.Provider>
  );
}

export function useGrowth() {
  const context = useContext(GrowthContext);
  if (!context) {
    throw new Error("useGrowth must be used within a GrowthProvider");
  }
  return context;
}
