/**
 * Campus Growth Radar - Calculation & Scoring Engine
 * Centralized, transparent growth formulas.
 */

/**
 * Calculate full growth projections from simulator parameters
 */
export function calculateSimulatorProjections(params, target = 500) {
  const communityReach = Number(params.communityReach) || 0;
  const communityConv = Number(params.communityConv) || 0;
  const communityCost = Number(params.communityCost) || 0;

  const ambassadorsCount = Number(params.ambassadorsCount) || 0;
  const regsPerAmbassador = Number(params.regsPerAmbassador) || 0;
  const ambassadorCost = Number(params.ambassadorCost) || 0;

  const organicReach = Number(params.organicReach) || 0;
  const organicConv = Number(params.organicConv) || 0;
  const organicCost = Number(params.organicCost) || 0;

  const directReach = Number(params.directOutreachReach) || 0;
  const directConv = Number(params.directConv) || 0;
  const directCost = Number(params.directCost) || 0;

  const overlapRate = Math.min(Math.max(Number(params.overlapRate) || 0, 0), 0.6); // clamp 0-60%
  const totalBudget = Number(params.budget) || 2000;
  const campaignDays = Number(params.campaignDays) || 7;

  // Gross channel registrations
  const grossCommunity = Math.round(communityReach * communityConv);
  const grossAmbassador = Math.round(ambassadorsCount * regsPerAmbassador);
  const grossOrganic = Math.round(organicReach * organicConv);
  const grossDirect = Math.round(directReach * directConv);

  const totalGross = grossCommunity + grossAmbassador + grossOrganic + grossDirect;

  // Overlap deduplication: Unique = Gross * (1 - overlapRate)
  const projectedUnique = Math.round(totalGross * (1 - overlapRate));
  const deduplicatedOverlap = totalGross - projectedUnique;

  // Gap and progress
  const gap = Math.max(0, target - projectedUnique);
  const percentage = target > 0 ? Math.min(Number(((projectedUnique / target) * 100).toFixed(1)), 250) : 0;

  // Budget calculations
  const totalAllocatedBudget = communityCost + ambassadorCost + organicCost + directCost;
  const budgetRemaining = totalBudget - totalAllocatedBudget;
  const blendedCAC = projectedUnique > 0 ? Number((totalAllocatedBudget / projectedUnique).toFixed(2)) : 0;

  // Daily velocity
  const dailyRunRateRequired = Number((target / campaignDays).toFixed(1));
  const dailyRunRateProjected = Number((projectedUnique / campaignDays).toFixed(1));

  // Channel breakdown with deduplicated proportion
  const channels = [
    {
      name: "Partner Student Clubs",
      gross: grossCommunity,
      unique: Math.round(grossCommunity * (1 - overlapRate)),
      reach: communityReach,
      convRate: (communityConv * 100).toFixed(1) + "%",
      cost: communityCost,
      cac: grossCommunity > 0 ? (communityCost / grossCommunity).toFixed(2) : "0",
      color: "#B8F56A", // lime
    },
    {
      name: "Campus Ambassadors",
      gross: grossAmbassador,
      unique: Math.round(grossAmbassador * (1 - overlapRate)),
      reach: ambassadorsCount * 60, // estimated impressions per ambassador
      convRate: `${regsPerAmbassador} regs/amb`,
      cost: ambassadorCost,
      cac: grossAmbassador > 0 ? (ambassadorCost / grossAmbassador).toFixed(2) : "0",
      color: "#51D6C7", // teal
    },
    {
      name: "Organic & Content",
      gross: grossOrganic,
      unique: Math.round(grossOrganic * (1 - overlapRate)),
      reach: organicReach,
      convRate: (organicConv * 100).toFixed(1) + "%",
      cost: organicCost,
      cac: grossOrganic > 0 ? (organicCost / grossOrganic).toFixed(2) : "0",
      color: "#A78BFA", // purple
    },
    {
      name: "Class CR Direct Outreach",
      gross: grossDirect,
      unique: Math.round(grossDirect * (1 - overlapRate)),
      reach: directReach,
      convRate: (directConv * 100).toFixed(1) + "%",
      cost: directCost,
      cac: grossDirect > 0 ? (directCost / grossDirect).toFixed(2) : "0",
      color: "#FACC15", // amber
    },
  ];

  // Feasibility status evaluation
  let feasibilityStatus = "feasible";
  let statusHeadline = "Target Appears Feasible";
  let statusMessage = "Current assumptions yield 500+ unique registrations within ₹2,000 budget.";

  if (projectedUnique < 440 || budgetRemaining < 0) {
    feasibilityStatus = "falls_short";
    statusHeadline = "Current Plan Falls Short";
    statusMessage = budgetRemaining < 0
      ? `Budget exceeded by ₹${Math.abs(budgetRemaining)}. Need to optimize channel CAC or reduce non-performing spend.`
      : `Forecast projects ${projectedUnique} registrations (${gap} short of 500 target). Need additional reach or conversion lift.`;
  } else if (projectedUnique < 500) {
    feasibilityStatus = "requires_stronger";
    statusHeadline = "Requires Stronger Assumptions";
    statusMessage = `Projected at ${projectedUnique} registrations (${gap} short). Vulnerable to minor channel underperformance.`;
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
    gap,
    percentage,
    totalAllocatedBudget,
    budgetRemaining,
    blendedCAC,
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
export function calculateCommunityScore(community) {
  const reachable = Number(community.reachableAudience) || 0;
  const convRate = Number(community.conversionRate) || 0;
  const effortHours = Math.max(Number(community.effortHours) || 1, 0.5);
  const cost = Number(community.cost) || 0;

  const expectedRegs = Math.round(reachable * convRate);
  const regsPerHour = Number((expectedRegs / effortHours).toFixed(1));
  const costPerReg = expectedRegs > 0 ? Number((cost / expectedRegs).toFixed(1)) : 0;

  // Confidence multiplier
  const confidenceMultiplier = {
    High: 1.0,
    Medium: 0.75,
    Low: 0.5,
  }[community.confidence] || 0.7;

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
  // Modulate by access & confidence
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
  };
}

/**
 * A/B Test calculation with statistical significance and sample size checks
 */
export function calculateExperimentStats(exp) {
  const nA = Number(exp.sampleSizeA) || 0;
  const nB = Number(exp.sampleSizeB) || 0;
  const cA = Number(exp.conversionsA) || 0;
  const cB = Number(exp.conversionsB) || 0;

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
        // Approximation of two-tailed p-value from z
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
    relLift: relLift.toFixed(1),
    hasAdequateSample,
    hasData,
    significance,
    isWinner,
    winner,
    pValueEstimate,
  };
}

/**
 * Dynamic Recommended Next Action engine
 */
export function generateRecommendedNextAction(state) {
  const { simulatorParams, communities, actualRegistrations, missions } = state;
  const actualCount = actualRegistrations ? actualRegistrations.length : 0;
  const projections = calculateSimulatorProjections(simulatorParams);

  // Check for blocked missions
  const blockedMission = missions?.find((m) => m.status === "blocked");
  if (blockedMission) {
    return {
      action: `Unblock Critical Mission: ${blockedMission.title}`,
      why: `The mission '${blockedMission.title}' is currently blocked, threatening the campaign execution timeline.`,
      supportingData: `Assigned to: ${blockedMission.owner} | Channel: ${blockedMission.channel} | Cost: ₹${blockedMission.cost}`,
      metricToMeasure: "Mission status changed to In Progress or Completed within 12 hours",
      reconsiderCondition: "Once the blocker is resolved or mission is reassigned.",
      urgency: "high",
    };
  }

  // Check if unapproved communities with high reach exist
  const pendingHighValue = communities?.filter(
    (c) => (c.accessStatus === "permission_requested" || c.accessStatus === "contact_identified") && c.reachableAudience >= 800
  );

  if (pendingHighValue && pendingHighValue.length > 0) {
    const topPending = pendingHighValue[0];
    return {
      action: `Expedite Access Approval for ${topPending.name}`,
      why: "This community represents high-potential reachable volume but remains in pending access status.",
      supportingData: `${topPending.reachableAudience} reachable students | Estimated ${Math.round(topPending.reachableAudience * topPending.conversionRate)} registrations | Est. CAC ₹${(topPending.cost / Math.max(1, topPending.reachableAudience * topPending.conversionRate)).toFixed(1)}`,
      metricToMeasure: "Access approval confirmed by Community Lead / Class Representative",
      reconsiderCondition: "If approval is declined, immediately redirect outreach hours to peer ambassador recruitment.",
      urgency: "medium",
    };
  }

  // Check ambassador recruitment bottleneck
  if (simulatorParams.ambassadorsCount < 10) {
    return {
      action: "Recruit 4 Additional Student Campus Ambassadors",
      why: "Ambassador peer referrals provide the lowest CAC and highest attendance intent among final-year students.",
      supportingData: `Current: ${simulatorParams.ambassadorsCount} reps | Benchmark needed: 12-15 reps to safely generate ~190+ unique registrations.`,
      metricToMeasure: "4 new verified ambassadors active with personalized referral links",
      reconsiderCondition: "If ambassador recruitment takes >24 hours, shift budget to direct club co-sponsorship.",
      urgency: "medium",
    };
  }

  // Check budget remaining
  if (projections.budgetRemaining > 500) {
    return {
      action: "Deploy ₹400 Remaining Budget to Sponsored Coding Club Teaser",
      why: `You have ₹${projections.budgetRemaining} unallocated budget. Allocating ₹400 to top-performing coding clubs can capture ~45 additional registrations.`,
      supportingData: `Projected unique: ${projections.projectedUnique} / 500 target | Blended CAC: ₹${projections.blendedCAC}`,
      metricToMeasure: "40+ registrations tracked from sponsored club broadcasts",
      reconsiderCondition: "Re-evaluate if CAC rises above ₹6 per registration.",
      urgency: "low",
    };
  }

  // Default optimal action
  return {
    action: "Deploy Outcome-Focused WhatsApp Teaser via Approved Class Representatives",
    why: "Placement-oriented messaging ('Build an AI project for your resume') tested +87% higher conversion than generic workshop invitations.",
    supportingData: `Current actual test registrations: ${actualCount} | Projected unique: ${projections.projectedUnique} | Days left: ${simulatorParams.campaignDays}`,
    metricToMeasure: "Click-to-registration conversion rate >= 8.5% across college broadcast links",
    reconsiderCondition: "If Day 3 cumulative actual registrations fall below 150, trigger Failure Lab recovery protocol.",
    urgency: "normal",
  };
}
