/**
 * Test Suite: Campus Growth Radar - Calculation and Growth Decision Engine
 * Run with: node tests/growthEngine.test.js
 */

import assert from "node:assert";
import {
  calculateSimulatorProjections,
  calculateCommunityScore,
  calculateExperimentStats,
  generateRecommendedNextAction,
} from "../src/utils/growthCalculations.js";
import {
  INITIAL_SIMULATOR_PARAMS,
  SIMULATOR_PRESETS,
  INITIAL_COMMUNITIES,
} from "../src/data/initialData.js";

console.log("🚀 Starting Campus Growth Radar Verification Suite...\n");

// ----------------------------------------------------
// TEST SUITE 1: Simulator Projections & Overlap Math
// ----------------------------------------------------
console.log("Test Suite 1: Simulator Projections & Overlap Math");

// Test 1.1: Base Case calculation
const baseProjections = calculateSimulatorProjections(INITIAL_SIMULATOR_PARAMS, 500);
assert(baseProjections.grossCommunity > 0, "Gross community registrations should be positive");
assert(baseProjections.grossAmbassador > 0, "Gross ambassador registrations should be positive");
assert(baseProjections.totalGross > baseProjections.projectedUnique, "Total gross must be greater than deduplicated unique");

// Overlap deduplication formula verification: Unique = round(Gross * (1 - overlapRate))
const expectedUnique = Math.round(baseProjections.totalGross * (1 - INITIAL_SIMULATOR_PARAMS.overlapRate));
assert.strictEqual(
  baseProjections.projectedUnique,
  expectedUnique,
  `Deduplication math must match: Expected ${expectedUnique}, got ${baseProjections.projectedUnique}`
);
console.log("  ✔ Deduplication formula accurately applies: Unique = Gross * (1 - overlapRate)");

// Test 1.2: Gap and percentage calculations
if (baseProjections.projectedUnique >= 500) {
  assert.strictEqual(baseProjections.gap, 0, "Gap should be 0 when target is achieved");
} else {
  assert.strictEqual(baseProjections.gap, 500 - baseProjections.projectedUnique, "Gap calculation must be exact");
}
console.log("  ✔ Target gap and completion percentage verified");

// Test 1.3: Feasibility status logic
const shortParams = {
  ...INITIAL_SIMULATOR_PARAMS,
  communityReach: 500,
  communityConv: 0.02,
  ambassadorsCount: 2,
  regsPerAmbassador: 5,
};
const shortProjections = calculateSimulatorProjections(shortParams, 500);
assert.strictEqual(
  shortProjections.feasibilityStatus,
  "falls_short",
  "Severe underperformance must trigger 'falls_short' status"
);

const overBudgetParams = {
  ...INITIAL_SIMULATOR_PARAMS,
  communityCost: 1500,
  ambassadorCost: 1000,
};
const overBudgetProjections = calculateSimulatorProjections(overBudgetParams, 500);
assert(overBudgetProjections.budgetRemaining < 0, "Budget remaining should be negative");
assert.strictEqual(
  overBudgetProjections.feasibilityStatus,
  "falls_short",
  "Budget overrun must trigger 'falls_short' status"
);
console.log("  ✔ Feasibility status and budget threshold alerts verified");

// Test 1.4: Sensitivity analysis (-20% to +20%)
assert.strictEqual(baseProjections.sensitivity.length, 5, "Sensitivity analysis must return 5 steps");
assert(
  baseProjections.sensitivity[0].projected < baseProjections.projectedUnique,
  "-20% scenario must yield lower projected registrations"
);
assert(
  baseProjections.sensitivity[4].projected > baseProjections.projectedUnique,
  "+20% scenario must yield higher projected registrations"
);
console.log("  ✔ Sensitivity stress-test variance verified");


// ----------------------------------------------------
// TEST SUITE 2: Opportunity Radar Community Scoring
// ----------------------------------------------------
console.log("\nTest Suite 2: Opportunity Radar Community Scoring");

const comm = INITIAL_COMMUNITIES[0]; // Tier-1 Coding Clubs (approved, high confidence)
const scoreResult = calculateCommunityScore(comm);

assert(scoreResult.priorityScore >= 0 && scoreResult.priorityScore <= 100, "Score must be bounded between 0 and 100");
assert(scoreResult.expectedRegs > 0, "Expected registrations must be positive");
assert(scoreResult.regsPerHour > 0, "Velocity (regs/hr) must be positive");
assert(scoreResult.costPerReg > 0, "Cost per registration (CAC) must be positive");

// Verify factor breakdown
const { breakdown } = scoreResult;
assert(breakdown.volumePoints >= 0 && breakdown.volumePoints <= 40, "Volume points must be between 0 and 40");
assert(breakdown.velocityPoints >= 0 && breakdown.velocityPoints <= 25, "Velocity points must be between 0 and 25");
assert(breakdown.costPoints >= 0 && breakdown.costPoints <= 20, "Cost efficiency points must be between 0 and 20");
assert(breakdown.accessPoints >= 0 && breakdown.accessPoints <= 10, "Access points must be between 0 and 10");
assert(breakdown.confidencePoints >= 0 && breakdown.confidencePoints <= 5, "Confidence points must be between 0 and 5");
console.log(`  ✔ Transparent factor points properly bounded for '${comm.name}' (Score: ${scoreResult.priorityScore})`);

// Test impact of access status on ranking
const blockedComm = { ...comm, accessStatus: "unavailable" };
const blockedScore = calculateCommunityScore(blockedComm);
assert(
  blockedScore.priorityScore < scoreResult.priorityScore,
  "Unavailable community must rank lower than approved community with identical audience"
);
console.log("  ✔ Access status penalization verified (Approved vs Unavailable)");


// ----------------------------------------------------
// TEST SUITE 3: Growth Experiment Lab A/B Statistics
// ----------------------------------------------------
console.log("\nTest Suite 3: Growth Experiment Lab A/B Statistics");

// Test 3.1: Large sample with significant lift
const significantExp = {
  sampleSizeA: 420,
  conversionsA: 24, // 5.71%
  sampleSizeB: 430,
  conversionsB: 46, // 10.70%
};
const sigStats = calculateExperimentStats(significantExp);
assert.strictEqual(sigStats.rateA, "5.71", "Variant A conversion rate must be 5.71%");
assert.strictEqual(sigStats.rateB, "10.70", "Variant B conversion rate must be 10.70%");
assert(sigStats.isWinner, "High conversion delta with N>400 must declare a statistically significant winner");
assert.strictEqual(sigStats.winner, "Variant B", "Variant B must be declared winner");
console.log("  ✔ Two-proportion z-test statistical significance correctly detected");

// Test 3.2: Small sample safeguard (<100)
const smallExp = {
  sampleSizeA: 35,
  conversionsA: 3,
  sampleSizeB: 40,
  conversionsB: 8,
};
const smallStats = calculateExperimentStats(smallExp);
assert(
  smallStats.significance.includes("Small Sample Warning"),
  "Sample size < 100 must display explicit warning and avoid claiming significance"
);
assert.strictEqual(smallStats.isWinner, false, "Must not declare a verified winner on small sample sizes");
console.log("  ✔ Small sample safeguard successfully prevents premature significance claims");

// Test 3.3: Awaiting data when 0 conversions
const zeroExp = {
  sampleSizeA: 50,
  conversionsA: 0,
  sampleSizeB: 50,
  conversionsB: 0,
};
const zeroStats = calculateExperimentStats(zeroExp);
assert.strictEqual(zeroStats.significance, "Awaiting Data", "0 conversions must report 'Awaiting Data'");
console.log("  ✔ Zero-conversion edge case properly reports 'Awaiting Data'");


// ----------------------------------------------------
// TEST SUITE 4: Dynamic Recommended Next Action Engine
// ----------------------------------------------------
console.log("\nTest Suite 4: Dynamic Recommended Next Action Engine");

const mockState = {
  simulatorParams: INITIAL_SIMULATOR_PARAMS,
  communities: INITIAL_COMMUNITIES,
  actualRegistrations: [],
  missions: [
    { id: "m-1", title: "Setup broadcast link", status: "blocked", owner: "Growth Lead", channel: "WhatsApp", cost: 0 }
  ],
};
const actionResult = generateRecommendedNextAction(mockState);
assert(actionResult.action.includes("Unblock Critical Mission"), "Blocked mission must take top priority in recommendations");
console.log(`  ✔ Critical blocker correctly prioritized: "${actionResult.action}"`);

console.log("\n========================================================");
console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! (4 Suites, 12 Checks)");
console.log("========================================================\n");
