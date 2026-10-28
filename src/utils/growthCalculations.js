/**
 * Campus Growth Radar - Calculation & Scoring Engine
 * Centralized, transparent growth formulas adhering to strict data integrity.
 */

/**
 * Calculate full growth projections from simulator parameters
 */
export function calculateSimulatorProjections(params = {}, target = 500, contextData = {}) {
  const targetRegistrations = Math.max(1, Number(target || params?.targetRegistrations) || 500);

  const communityReach = Math.max(0, Number(params?.communityReach) || 0);
  const communityConv = Math.min(Math.max(0, Number(params?.communityConv) || 0), 1);
  const communityCost = Math.max(0, Number(params?.communityCost) || 0);

  const ambassadorsCount = Math.max(0, Number(params?.ambassadorsCount) || 0);
  const regsPerAmbassador = Math.max(0, Number(params?.regsPerAmbassador) || 0);
  const ambassadorCost = Math.max(0, Number(params?.ambassadorCost) || 0);

  const organicReach = Math.max(0, Number(params?.organicReach) || 0);
  const organicConv = Math.min(Math.max(0, Number(params?.organicConv) || 0), 1);
  const organicCost = Math.max(0, Number(params?.organicCost) || 0);

  const directReach = Math.max(0, Number(params?.directOutreachReach) || 0);
  const directConv = Math.min(Math.max(0, Number(params?.directConv) || 0), 1);
  const directCost = Math.max(0, Number(params?.directCost) || 0);

  const rawOverlap = Number(params?.overlapRate);
  const overlapRate = Number.isFinite(rawOverlap) ? Math.min(Math.max(rawOverlap, 0), 0.6) : 0.13;
  const totalBudget = Math.max(0, Number(params?.budget) || 2000);
  const totalCampaignDays = Math.max(1, Number(contextData?.totalCampaignDays || params?.campaignDays) || 7);
  const daysRemaining = contextData?.daysRemaining !== undefined
    ? Math.max(0, Number(contextData.daysRemaining))
    : (params?.daysRemaining !== undefined
      ? Math.max(0, Number(params.daysRemaining))
      : Math.max(1, Number(params?.campaignDays) || 7));

  // Gross channel registrations
  const grossCommunity = Math.round(communityReach * communityConv);
  const grossAmbassador = Math.round(ambassadorsCount * regsPerAmbassador);
  const grossOrganic = Math.round(organicReach * organicConv);
  const grossDirect = Math.round(directReach * directConv);

  const totalGross = grossCommunity + grossAmbassador + grossOrganic + grossDirect;

  // Overlap deduplication: Unique = round(Gross * (1 - overlapRate))
  // Accounts for students in multiple overlapping groups (coding club + class chat)
  const projectedUnique = Math.round(totalGross * (1 - overlapRate));
  const deduplicatedOverlap = Math.max(0, totalGross - projectedUnique);

  // Actual unique registrations & Actual registrations remaining
  const actualCount = Array.isArray(contextData?.actualRegistrations)
    ? contextData.actualRegistrations.length
    : (typeof contextData?.actualRegistrations === 'number' ? contextData.actualRegistrations : 0);
  const actualRegistrationsRemaining = Math.max(0, targetRegistrations - actualCount);

  // Forecast gap & completion
  const forecastGap = Math.max(0, targetRegistrations - projectedUnique);
  const gap = forecastGap; // backwards compatibility
  const forecastCompletion = targetRegistrations > 0
    ? Number(((projectedUnique / targetRegistrations) * 100).toFixed(1))
    : 0;
  const percentage = forecastCompletion; // backwards compatibility

  // Budget calculations
  const totalAllocatedBudget = communityCost + ambassadorCost + organicCost + directCost;
  const budgetRemaining = totalBudget - totalAllocatedBudget;

  // Unit Economics / Cost per Registration
  // 1. Forecast CAC = Forecast spend ÷ projected unique
  const forecastCAC = projectedUnique > 0
    ? Number((totalAllocatedBudget / projectedUnique).toFixed(2))
    : "N/A";

  // 2. Target CAC = Total campaign budget ÷ target registrations
  const targetCAC = targetRegistrations > 0
    ? Number((totalBudget / targetRegistrations).toFixed(2))
    : "N/A";

  // 3. Actual CAC = Actual campaign spend ÷ actual unique registrations
  const rawActualSpend = contextData?.actualSpend;
  const actualSpend = rawActualSpend !== undefined && rawActualSpend !== null ? Number(rawActualSpend) : null;
  let actualCAC = "N/A";
  if (actualCount > 0 && actualSpend !== null && !isNaN(actualSpend)) {
    actualCAC = actualSpend === 0 ? "₹0.00" : Number((actualSpend / actualCount).toFixed(2));
  }
  const blendedCAC = typeof forecastCAC === 'number' ? forecastCAC : 0;

  // Pacing calculations
  // 1. Original target pace = target ÷ total campaign days
  const originalTargetPace = totalCampaignDays > 0
    ? Number((targetRegistrations / totalCampaignDays).toFixed(1))
    : 0;

  // 2. Required daily pace = registrations remaining ÷ campaign days remaining
  let requiredDailyPace = "N/A";
  if (actualRegistrationsRemaining === 0) {
    requiredDailyPace = 0; // Goal achieved
  } else if (daysRemaining > 0) {
    requiredDailyPace = Number((actualRegistrationsRemaining / daysRemaining).toFixed(1));
  }

  // 3. Projected daily run rate = projected unique ÷ total campaign days
  const projectedDailyRunRate = totalCampaignDays > 0
    ? Number((projectedUnique / totalCampaignDays).toFixed(1))
    : 0;

  const dailyRunRateRequired = typeof requiredDailyPace === 'number' ? requiredDailyPace : originalTargetPace;
  const dailyRunRateProjected = projectedDailyRunRate;

  // Channel breakdown with deduplicated proportion and distinct channel profiles
  const channels = [
    {
      id: "clubs",
      name: "Partner Student Clubs",
      category: "Student Clubs",
      gross: grossCommunity,
      unique: Math.round(grossCommunity * (1 - overlapRate)),
      reach: communityReach,
      reachLabel: `${communityReach.toLocaleString()} students`,
      convRate: (communityConv * 100).toFixed(1) + "%",
      rawConv: communityConv,
      cost: communityCost,
      cac: grossCommunity > 0 ? Number((communityCost / grossCommunity).toFixed(2)) : 0,
      uniqueCac: Math.round(grossCommunity * (1 - overlapRate)) > 0
        ? Number((communityCost / Math.round(grossCommunity * (1 - overlapRate))).toFixed(2))
        : 0,
      accessStatus: "Approved (5 Campuses)",
      confidence: "High",
      assumptionNote: "Historical student club partnership performance benchmark",
      color: "#C5F56A",
    },
    {
      id: "ambassadors",
      name: "Campus Ambassadors",
      category: "Campus Ambassadors",
      repsCount: ambassadorsCount,
      regsPerRep: regsPerAmbassador,
      gross: grossAmbassador,
      unique: Math.round(grossAmbassador * (1 - overlapRate)),
      reach: ambassadorsCount * 60,
      reachLabel: `${ambassadorsCount} reps (${ambassadorsCount * 60} network reach)`,
      convRate: `${regsPerAmbassador} regs/rep`,
      cost: ambassadorCost,
      cac: grossAmbassador > 0 ? Number((ambassadorCost / grossAmbassador).toFixed(2)) : 0,
      uniqueCac: Math.round(grossAmbassador * (1 - overlapRate)) > 0
        ? Number((ambassadorCost / Math.round(grossAmbassador * (1 - overlapRate))).toFixed(2))
        : 0,
      accessStatus: "Active (12 verified student reps)",
      confidence: "High",
      assumptionNote: "Peer-to-peer referral incentives with ₹50 milestone reward",
      color: "#4ADFFF",
    },
    {
      id: "organic",
      name: "Organic & Content",
      category: "Organic & Content",
      gross: grossOrganic,
      unique: Math.round(grossOrganic * (1 - overlapRate)),
      reach: organicReach,
      reachLabel: `${organicReach.toLocaleString()} impressions`,
      convRate: (organicConv * 100).toFixed(1) + "%",
      rawConv: organicConv,
      cost: organicCost,
      cac: grossOrganic > 0 ? Number((organicCost / grossOrganic).toFixed(2)) : 0,
      uniqueCac: Math.round(grossOrganic * (1 - overlapRate)) > 0
        ? Number((organicCost / Math.round(grossOrganic * (1 - overlapRate))).toFixed(2))
        : 0,
      accessStatus: "Published (LinkedIn & Discord)",
      confidence: "Medium",
      assumptionNote: "Organic student developer impressions across Discord & LinkedIn",
      color: "#C084FC",
    },
    {
      id: "direct",
      name: "Class CR Direct Outreach",
      category: "Class Representative Outreach",
      gross: grossDirect,
      unique: Math.round(grossDirect * (1 - overlapRate)),
      reach: directReach,
      reachLabel: `${directReach.toLocaleString()} students`,
      convRate: (directConv * 100).toFixed(1) + "%",
      rawConv: directConv,
      cost: directCost,
      cac: grossDirect > 0 ? Number((directCost / grossDirect).toFixed(2)) : 0,
      uniqueCac: Math.round(grossDirect * (1 - overlapRate)) > 0
        ? Number((directCost / Math.round(grossDirect * (1 - overlapRate))).toFixed(2))
        : 0,
      accessStatus: "Partially Approved (3 approved, 2 pending)",
      confidence: "High",
      assumptionNote: "Official departmental WhatsApp circulars via verified Class CRs",
      color: "#FB923C",
    },
  ];

  // Feasibility status evaluation
  let feasibilityStatus = "feasible";
  let statusHeadline = "Target Forecast Supported";
  let statusMessage = "";

  if (budgetRemaining < 0) {
    feasibilityStatus = "falls_short";
    statusHeadline = "Budget Cap Exceeded";
    statusMessage = `Allocated spend (₹${totalAllocatedBudget}) exceeds total budget of ₹${totalBudget} by ₹${Math.abs(budgetRemaining)}. Optimize channel spending or reduce non-performing allocations.`;
  } else if (projectedUnique < targetRegistrations * 0.85) {
    feasibilityStatus = "falls_short";
    statusHeadline = "Current Plan Falls Short";
    statusMessage = `Forecast models ${projectedUnique} unique registrations (${forecastGap} short of ${targetRegistrations} target). To close the deficit, recruit additional ambassadors (currently ${ambassadorsCount}) or expand partner club reach.`;
  } else if (projectedUnique < targetRegistrations) {
    feasibilityStatus = "requires_stronger";
    statusHeadline = "Requires Stronger Assumptions";
    statusMessage = `Projected at ${projectedUnique} registrations (${forecastGap} short of ${targetRegistrations}). Vulnerable to minor channel friction or conversion drops.`;
  } else {
    feasibilityStatus = "feasible";
    if (projectedUnique > targetRegistrations * 1.35) {
      statusHeadline = `Optimistic Scenario (${projectedUnique} Regs)`;
      statusMessage = `Forecast exceeds target by +${projectedUnique - targetRegistrations} registrations. This models high conversion (${(communityConv * 100).toFixed(1)}% club, ${(directConv * 100).toFixed(1)}% CR) and low ${Math.round(overlapRate * 100)}% overlap. Note: This is an analytical scenario, not a guaranteed outcome.`;
    } else {
      statusHeadline = "Target Forecast Supported";
      statusMessage = `Current balanced assumptions model ${projectedUnique} unique registrations (+${projectedUnique - targetRegistrations} buffer above ${targetRegistrations} target) within the ₹${totalBudget} budget constraint.`;
    }
  }

  // Sensitivity analysis (impact of +- 20% conversion variance)
  const sensitivity = [
    { label: "-20% Drop", multiplier: 0.8, projected: Math.round(totalGross * 0.8 * (1 - overlapRate)) },
    { label: "-10% Drop", multiplier: 0.9, projected: Math.round(totalGross * 0.9 * (1 - overlapRate)) },
    { label: "Base Forecast", multiplier: 1.0, projected: projectedUnique },
    { label: "+10% Lift", multiplier: 1.1, projected: Math.round(totalGross * 1.1 * (1 - overlapRate)) },
    { label: "+20% Lift", multiplier: 1.2, projected: Math.round(totalGross * 1.2 * (1 - overlapRate)) },
  ];

  return {
    grossCommunity,
    grossAmbassador,
    grossOrganic,
    grossDirect,
    totalGross,
    projectedUnique,
    deduplicatedOverlap,
    overlapRate,
    targetRegistrations,
    gap,
    forecastGap,
    actualCount,
    actualRegistrationsRemaining,
    percentage,
    forecastCompletion,
    totalBudget,
    totalAllocatedBudget,
    budgetRemaining,
    forecastCAC,
    targetCAC,
    actualCAC,
    blendedCAC,
    totalCampaignDays,
    daysRemaining,
    originalTargetPace,
    requiredDailyPace,
    projectedDailyRunRate,
    dailyRunRateRequired,
    dailyRunRateProjected,
    channels,
    feasibilityStatus,
    statusHeadline,
    statusMessage,
    sensitivity,
  };
}

/**
 * Transparent scoring formula for student communities
 */
export function calculateCommunityScore(community = {}) {
  const reachable = Math.max(0, Number(community.reachableAudience) || 0);
  const convRate = Math.min(Math.max(0, Number(community.conversionRate) || 0), 1);
  const effortHours = Math.max(0.5, Number(community.effortHours) || 1);
  const cost = Math.max(0, Number(community.cost) || 0);

  const expectedRegs = Math.round(reachable * convRate);
  const regsPerHour = effortHours > 0 ? Number((expectedRegs / effortHours).toFixed(1)) : 0;
  const costPerReg = expectedRegs > 0 ? Number((cost / expectedRegs).toFixed(1)) : 0;

  // Confidence multiplier
  const confidenceMultiplier = {
    High: 1.0,
    Medium: 0.75,
    Low: 0.5,
  }[community.confidence] || 0.75;

  // Access status multiplier
  const accessMultiplier = {
    approved: 1.0,
    permission_requested: 0.72,
    contact_identified: 0.45,
    uncontacted: 0.25,
    unavailable: 0.05,
  }[community.accessStatus] || 0.3;

  // Normalized factor weights (sum to 100)
  // 1. Volume Factor (max 40 pts, benchmark 100 regs)
  const volumePoints = Math.min((expectedRegs / 100) * 40, 40);

  // 2. Velocity Factor: Regs/hr (max 25 pts, benchmark 15 regs/hr)
  const velocityPoints = Math.min((regsPerHour / 15) * 25, 25);

  // 3. Cost Efficiency Factor (max 20 pts, lower CAC is better, benchmark <= ₹5)
  let costPoints = 20;
  if (costPerReg > 0) {
    costPoints = Math.max(0, 20 - (costPerReg / 10) * 15);
  }

  // 4. Access Readiness (max 10 pts)
  const accessPoints = accessMultiplier * 10;

  // 5. Confidence Weight (max 5 pts)
  const confidencePoints = confidenceMultiplier * 5;

  const rawScore = (volumePoints + velocityPoints + costPoints + accessPoints + confidencePoints);
  const priorityScore = Math.min(Math.max(Math.round(rawScore * (0.6 + 0.4 * accessMultiplier * confidenceMultiplier)), 5), 98);

  // Score breakdown explanation
  let reason = "";
  if (community.accessStatus === "approved" && priorityScore >= 70) {
    reason = "High priority: Approved access, strong reachable volume, and high expected ROI per outreach hour.";
  } else if (community.accessStatus === "permission_requested") {
    reason = "Strong candidate: High volume potential pending admin/CR approval. Low monetary risk.";
  } else if (community.confidence === "Low") {
    reason = "Speculative: Requires proof of interest or pilot teaser before committing major hours.";
  } else if (costPerReg > 8) {
    reason = "Moderate efficiency: Higher cost per registration compared to peer channels.";
  } else {
    reason = "Balanced channel: Good incremental contributor to the 500 registration target.";
  }

  // Context-aware Next Action
  const nextAction = community.nextAction || {
    approved: "Deploy outcome-focused teaser copy to community leads.",
    permission_requested: "Follow up with club coordinators; share 60-second video demo preview.",
    contact_identified: "Draft formal collaboration outreach to student coordinator.",
    uncontacted: "Identify active batch CR or student developer club lead.",
    unavailable: "Bypass channel; redirect allocated outreach hours to peer ambassador DMs.",
  }[community.accessStatus] || "Evaluate channel potential.";

  return {
    expectedRegs,
    regsPerHour,
    costPerReg,
    priorityScore,
    confidenceMultiplier,
    accessMultiplier,
    breakdown: {
      volumePoints: Math.round(volumePoints),
      velocityPoints: Math.round(velocityPoints),
      costPoints: Math.round(costPoints),
      accessPoints: Math.round(accessPoints),
      confidencePoints: Math.round(confidencePoints),
    },
    reason,
    nextAction,
  };
}

/**
 * A/B Test calculation with statistical significance and sample size checks
 */
export function calculateExperimentStats(exp = {}) {
  const nA = Math.max(0, Number(exp.sampleSizeA) || 0);
  const nB = Math.max(0, Number(exp.sampleSizeB) || 0);
  const cA = Math.max(0, Number(exp.conversionsA) || 0);
  const cB = Math.max(0, Number(exp.conversionsB) || 0);

  const rateA = nA > 0 ? (cA / nA) : 0;
  const rateB = nB > 0 ? (cB / nB) : 0;

  const absLift = rateB - rateA;
  const relLift = rateA > 0 ? ((rateB - rateA) / rateA) * 100 : 0;

  const minSampleSize = 100;
  const hasAdequateSample = nA >= minSampleSize && nB >= minSampleSize;
  const hasData = (nA > 0 && nB > 0 && (cA > 0 || cB > 0));

  let significance = "Awaiting Data";
  let isWinner = false;
  let winner = "None";
  let pValueEstimate = null;

  if (hasData) {
    if (!hasAdequateSample) {
      significance = "Small Sample Warning (<100 participants per variant)";
      winner = rateB > rateA ? "Variant B (Directional)" : "Variant A (Directional)";
    } else {
      // Two-proportion z-test calculation
      const pPool = (cA + cB) / (nA + nB);
      const se = Math.sqrt(pPool * (1 - pPool) * ((1 / nA) + (1 / nB)));

      if (se > 0) {
        const z = (rateB - rateA) / se;
        const absZ = Math.abs(z);
        if (absZ >= 2.58) pValueEstimate = "p < 0.01";
        else if (absZ >= 1.96) pValueEstimate = "p < 0.05";
        else if (absZ >= 1.64) pValueEstimate = "p < 0.10";
        else pValueEstimate = "p >= 0.10";

        if (absZ >= 1.96) {
          significance = `Statistically Significant (${pValueEstimate}, 95% Confidence)`;
          isWinner = true;
          winner = rateB > rateA ? "Variant B" : "Variant A";
        } else {
          significance = `Inconclusive (${pValueEstimate}) - Continue Testing`;
          winner = rateB > rateA ? "Variant B (Leading)" : "Variant A (Leading)";
        }
      }
    }
  }

  return {
    rateA: (rateA * 100).toFixed(2),
    rateB: (rateB * 100).toFixed(2),
    absLift: (absLift * 100).toFixed(2),
    relLift: Number.isFinite(relLift) ? relLift.toFixed(1) : "0.0",
    hasAdequateSample,
    hasData,
    significance,
    isWinner,
    winner,
    pValueEstimate,
  };
}

/**
 * Dynamic Recommended Next Action engine responding to real state
 */
export function generateRecommendedNextAction(state = {}) {
  const { simulatorParams, communities, actualRegistrations, missions, targetRegistrations = 500, projections: passedProjections } = state;
  const actualCount = Array.isArray(actualRegistrations) ? actualRegistrations.length : (typeof actualRegistrations === "number" ? actualRegistrations : 0);
  const projections = passedProjections || calculateSimulatorProjections(simulatorParams, targetRegistrations, { actualRegistrations });

  // 1. Target Goal Already Achieved
  if (actualCount >= targetRegistrations) {
    return {
      action: "Shift Focus to Live Workshop Attendance & Setup Readiness",
      why: `Target goal achieved with ${actualCount} verified registrations. Further acquisition yields diminishing returns; priority shifts to maximizing attendance show-up rate on workshop day.`,
      supportingData: `Verified registrations: ${actualCount} / ${targetRegistrations} target | Registrations remaining: 0 | Pace required: 0/day`,
      estimatedImpact: "Drives live attendance from industry benchmark 42% to >65%",
      effortCost: "4 hrs preparation • ₹0 additional spend",
      metricToMeasure: "Pre-workshop setup verification link click-through rate >= 70%",
      reconsiderCondition: "If actual cancellations or invalid student emails exceed 10%.",
      urgency: "normal",
      targetTab: "register",
      actionButtonText: "Inspect Registrations",
    };
  }

  // 2. Critical Execution Blockers
  const blockedMission = missions?.find((m) => m.status === "blocked");
  if (blockedMission) {
    return {
      action: `Unblock Critical Mission: ${blockedMission.title}`,
      why: `The mission '${blockedMission.title}' is currently blocked, jeopardizing the 7-day sprint execution velocity.`,
      supportingData: `Assigned to: ${blockedMission.owner} | Channel: ${blockedMission.channel} | Cost: ₹${blockedMission.cost}`,
      estimatedImpact: "+40 to +60 Registrations preserved upon unblocking (Est.)",
      effortCost: `${blockedMission.effortHours} hrs effort • ₹${blockedMission.cost} budget`,
      metricToMeasure: "Mission status advanced to In Progress or Completed within 12 hours",
      reconsiderCondition: "Once the blocker is cleared or task is reassigned.",
      urgency: "high",
      targetTab: "missions",
      actionButtonText: "View in Missions",
    };
  }

  // 3. Budget Overrun Remediation
  if (projections.budgetRemaining < 0) {
    return {
      action: `Reallocate Spend to Correct ₹${Math.abs(projections.budgetRemaining)} Budget Overrun`,
      why: `Allocated spend (₹${projections.totalAllocatedBudget}) exceeds total budget cap of ₹${simulatorParams?.budget || 2000}. Reallocating to lower-cost organic channels is required.`,
      supportingData: `Allocated spend: ₹${projections.totalAllocatedBudget} | Total budget: ₹${projections.totalBudget} | Deficit: ₹${Math.abs(projections.budgetRemaining)}`,
      estimatedImpact: "Brings campaign back to ₹2,000 budget compliance without cutting reach",
      effortCost: "2 hrs planning • ₹0 cost",
      metricToMeasure: "Budget remaining >= ₹0 across active channel allocations",
      reconsiderCondition: "Once spending is reconciled under ₹2,000.",
      urgency: "high",
      targetTab: "simulator",
      actionButtonText: "Adjust in Simulator",
    };
  }

  // 4. Critical Pacing Deficit (e.g. Failure Lab time crunch or slow initial velocity)
  if (typeof projections.requiredDailyPace === "number" && projections.daysRemaining > 0 && projections.requiredDailyPace > projections.originalTargetPace * 1.15) {
    return {
      action: `Accelerate Acquisition Velocity: Required Pace at ${projections.requiredDailyPace}/Day`,
      why: `With ${projections.daysRemaining} days remaining, required pace is ${projections.requiredDailyPace} regs/day (vs planned ${projections.originalTargetPace}/day). Immediate multichannel activation required to close the ${projections.actualRegistrationsRemaining} registration gap.`,
      supportingData: `Remaining needed: ${projections.actualRegistrationsRemaining} | Days left: ${projections.daysRemaining} | Required daily pace: ${projections.requiredDailyPace}/day`,
      estimatedImpact: `Closes pacing deficit to recover on-track trajectory towards ${targetRegistrations}`,
      effortCost: "6 hrs multi-channel push • ₹200 incentive bonus",
      metricToMeasure: `Daily unique registration velocity reaches >= ${projections.requiredDailyPace} within 24 hours`,
      reconsiderCondition: "Once cumulative pace returns within 10% of target trajectory.",
      urgency: "high",
      targetTab: "simulator",
      actionButtonText: "Tune in Simulator",
    };
  }

  // 5. High-Yield Pending Communities
  const pendingHighValue = communities?.filter(
    (c) => (c.accessStatus === "permission_requested" || c.accessStatus === "contact_identified") && c.reachableAudience >= 800
  );

  if (pendingHighValue && pendingHighValue.length > 0) {
    const topPending = pendingHighValue[0];
    const estRegs = Math.round(topPending.reachableAudience * topPending.conversionRate);
    return {
      action: `Expedite Access Approval for ${topPending.name}`,
      why: `This community represents the single largest untapped growth lever (${topPending.reachableAudience.toLocaleString()} targeted final-years), but outreach remains temporarily gated pending coordinator permission.`,
      supportingData: `${topPending.reachableAudience.toLocaleString()} reachable final-years • Estimated +${estRegs} registrations • Low cost of ₹${topPending.cost} (₹${(topPending.cost / Math.max(1, estRegs)).toFixed(2)} CAC)`,
      estimatedImpact: `+${estRegs} Unique Registrations upon approval (surpasses the 500 campaign goal)`,
      effortCost: `${topPending.effortHours} hrs coordinator follow-up • ₹${topPending.cost} allocated budget`,
      metricToMeasure: "Official broadcast permission granted & 1-page circular posted in primary batch channel within 24h",
      reconsiderCondition: "If approval is declined or delayed past Day 3, immediately pivot the 8 outreach hours and ₹350 budget to recruit 4 additional student ambassadors.",
      urgency: "high",
      targetTab: "radar",
      actionButtonText: "Prioritize in Radar",
    };
  }

  // 6. Forecast Below Target (Forecast Gap > 0)
  if (projections.forecastGap > 0) {
    return {
      action: `Scale Channel Mix to Close ${projections.forecastGap} Registration Forecast Gap`,
      why: `Current simulation models ${projections.projectedUnique} registrations (${projections.forecastGap} short of ${targetRegistrations} target). Expanding campus ambassadors from ${simulatorParams?.ambassadorsCount || 12} to 14 or boosting club reach closes this gap.`,
      supportingData: `Projected unique: ${projections.projectedUnique} | Target: ${targetRegistrations} | Forecast completion: ${projections.forecastCompletion}%`,
      estimatedImpact: `+${projections.forecastGap + 15} Unique Registrations to cross the 500 target`,
      effortCost: "3 hrs ambassador onboarding • ₹150 incentive budget",
      metricToMeasure: "Projected unique registrations reach >= 500 in Simulator",
      reconsiderCondition: "Once simulation reaches or exceeds 500 unique registrations.",
      urgency: "medium",
      targetTab: "simulator",
      actionButtonText: "Close Gap in Simulator",
    };
  }

  // 7. Ambassador Network Scaling Bottleneck
  if (simulatorParams?.ambassadorsCount < 10) {
    return {
      action: "Recruit 4 Additional Student Campus Ambassadors",
      why: "Ambassador peer referrals provide the lowest blended CAC and highest attendance intent among final-year students.",
      supportingData: `Current: ${simulatorParams?.ambassadorsCount} reps | Target needed: 12-15 reps to safely generate ~190+ unique registrations.`,
      estimatedImpact: "+50 to +65 Unique Registrations via peer DMs (Est.)",
      effortCost: "6 hrs onboarding • ₹250 incentive budget",
      metricToMeasure: "4 new verified ambassadors active with personalized referral links",
      reconsiderCondition: "If ambassador onboarding takes >24 hours, shift focus to direct Class CR broadcasts.",
      urgency: "medium",
      targetTab: "simulator",
      actionButtonText: "Scale in Simulator",
    };
  }

  // 8. Unallocated Budget Deployment
  if (projections.budgetRemaining >= 400) {
    return {
      action: "Deploy ₹350 Unallocated Budget to Sponsored Coding Club Teaser",
      why: `You have ₹${projections.budgetRemaining} unallocated buffer. Deploying ₹350 to top-performing coding clubs captures ~40 additional high-intent registrations.`,
      supportingData: `Projected unique: ${projections.projectedUnique} / ${targetRegistrations} target | Blended CAC: ₹${projections.blendedCAC}`,
      estimatedImpact: "+35 to +45 Unique Registrations (Est.)",
      effortCost: "3 hrs coordination • ₹350 club sponsorship",
      metricToMeasure: "35+ registrations tracked from sponsored club broadcasts",
      reconsiderCondition: "Re-evaluate if CAC rises above ₹5.50 per registration.",
      urgency: "medium",
      targetTab: "radar",
      actionButtonText: "Deploy in Radar",
    };
  }

  // 9. Default High-Velocity Action
  return {
    action: "Deploy Outcome-Focused WhatsApp Teaser via Approved Class Representatives",
    why: "Placement-oriented messaging ('Build an AI project for your resume') tested +87% higher conversion than generic workshop announcements.",
    supportingData: `Recorded test registrations: ${actualCount} | Projected unique: ${projections.projectedUnique} | Sprint days left: ${projections.daysRemaining}`,
    estimatedImpact: "+65 to +90 Unique Registrations across 5 college batches (Est.)",
    effortCost: "4 hrs broadcast coordination • ₹250 CR honorarium",
    metricToMeasure: "Click-to-registration conversion rate >= 8.5% across college broadcast links",
    reconsiderCondition: "If Day 3 cumulative actual registrations fall below 150, trigger Failure Lab recovery protocol.",
    urgency: "normal",
    targetTab: "radar",
    actionButtonText: "Execute in Radar",
  };
}
