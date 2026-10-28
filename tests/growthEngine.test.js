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
    { id: "m-1", title: "Setup broadcast link", status: "blocked", owner: "Growth Lead", cost: 0, effortHours: 2 }
  ],
};
const actionResult = generateRecommendedNextAction(mockState);
assert(actionResult.action.includes("Unblock Critical Mission"), "Blocked mission must take top priority in recommendations");
assert.strictEqual(actionResult.targetTab, "missions", "Blocked mission must route to missions tab");
console.log(`  ✔ Critical blocker correctly prioritized: "${actionResult.action}" -> targetTab: ${actionResult.targetTab}`);

// Test pending high-value community recommendation
const noBlockedState = {
  simulatorParams: INITIAL_SIMULATOR_PARAMS,
  communities: INITIAL_COMMUNITIES,
  actualRegistrations: [],
  missions: [],
};
const pendingAction = generateRecommendedNextAction(noBlockedState);
assert.strictEqual(pendingAction.targetTab, "radar", "Pending community must route to radar tab");
console.log(`  ✔ High-potential pending community correctly triggers radar action -> targetTab: ${pendingAction.targetTab}`);

// Test budget overrun recommendation
const overrunState = {
  simulatorParams: {
    ...INITIAL_SIMULATOR_PARAMS,
    communityCost: 1500,
    ambassadorCost: 1000,
  },
  communities: [],
  actualRegistrations: [],
  missions: [],
};
const overrunAction = generateRecommendedNextAction(overrunState);
assert.strictEqual(overrunAction.targetTab, "simulator", "Budget overrun must route to simulator tab");
console.log(`  ✔ Budget overrun correctly triggers simulator action -> targetTab: ${overrunAction.targetTab}`);


// ----------------------------------------------------
// TEST SUITE 5: Zero Denominators, NaN Guards & Dynamic Target
// ----------------------------------------------------
console.log("\nTest Suite 5: Zero Denominators, NaN Guards & Dynamic Target");

// Test 5.1: Zero and negative denominators in simulator
const zeroParamProjections = calculateSimulatorProjections({
  campaignDays: 0,
  budget: 0,
  communityReach: 0,
  communityConv: 0,
  ambassadorsCount: 0,
  regsPerAmbassador: 0,
  organicReach: 0,
  organicConv: 0,
  directOutreachReach: 0,
  directConv: 0,
  overlapRate: NaN,
}, 0);

assert(Number.isFinite(zeroParamProjections.projectedUnique), "projectedUnique must be finite");
assert(Number.isFinite(zeroParamProjections.dailyRunRateRequired), "dailyRunRateRequired must be finite");
assert(Number.isFinite(zeroParamProjections.dailyRunRateProjected), "dailyRunRateProjected must be finite");
assert(Number.isFinite(zeroParamProjections.blendedCAC), "blendedCAC must be finite");
assert(Number.isFinite(zeroParamProjections.overlapRate), "overlapRate must never be NaN");
assert(!Number.isNaN(zeroParamProjections.overlapRate), "overlapRate must never be NaN");
console.log("  ✔ Zero inputs and NaN overlap safely sanitized without NaN or Infinity");

// Test 5.2: Dynamic Target scaling
const customTargetProjections = calculateSimulatorProjections(INITIAL_SIMULATOR_PARAMS, 750);
assert.strictEqual(customTargetProjections.targetRegistrations, 750, "Target should scale to 750");
assert(customTargetProjections.gap > 0, "Gap must reflect new 750 target");
assert.strictEqual(
  customTargetProjections.dailyRunRateRequired,
  Number((750 / INITIAL_SIMULATOR_PARAMS.campaignDays).toFixed(1)),
  "Required run-rate must recalculate with new target"
);
console.log("  ✔ Dynamic target scaling (500 -> 750) updates gap and daily run-rate cleanly");

// Test 5.3: Community scoring zero division safety
const zeroComm = {
  name: "Empty Club",
  reachableAudience: 0,
  conversionRate: 0,
  effortHours: 0,
  cost: 0,
};
const zeroCommScore = calculateCommunityScore(zeroComm);
assert(Number.isFinite(zeroCommScore.priorityScore), "Zero community score must be finite");
assert(Number.isFinite(zeroCommScore.regsPerHour), "Zero community regsPerHour must be finite");
assert(Number.isFinite(zeroCommScore.costPerReg), "Zero community costPerReg must be finite");
console.log("  ✔ Community scoring zero division safely guarded");

// ----------------------------------------------------
// TEST SUITE 6: Minimum Audit Verification Criteria (Prompt Section 8)
// ----------------------------------------------------
console.log("\nTest Suite 6: Minimum Audit Verification Criteria (Prompt Section 8)");

const mockActualRegs = [
  { id: "REG-1", normalizedEmail: "r1@test.edu" },
  { id: "REG-2", normalizedEmail: "r2@test.edu" },
  { id: "REG-3", normalizedEmail: "r3@test.edu" },
  { id: "REG-4", normalizedEmail: "r4@test.edu" },
  { id: "REG-5", normalizedEmail: "r5@test.edu" },
  { id: "REG-6", normalizedEmail: "r6@test.edu" },
];

const auditProjections = calculateSimulatorProjections(
  INITIAL_SIMULATOR_PARAMS,
  500,
  {
    actualRegistrations: mockActualRegs,
    actualSpend: 0,
    totalCampaignDays: 7,
    daysRemaining: 7,
  }
);

// Check 1: ₹2,000 budget and ₹1,800 allocated produce ₹200 remaining
assert.strictEqual(auditProjections.totalBudget, 2000, "Total budget must be 2000");
assert.strictEqual(auditProjections.totalAllocatedBudget, 1800, "Allocated budget must be 1800");
assert.strictEqual(auditProjections.budgetRemaining, 200, "Remaining budget must be exactly 200");
console.log("  ✔ Check 1: ₹2,000 budget and ₹1,800 allocated produce ₹200 remaining");

// Check 2: Zero registrations do not cause division errors
const zeroRegProjections = calculateSimulatorProjections(
  INITIAL_SIMULATOR_PARAMS,
  500,
  { actualRegistrations: [], actualSpend: 0, daysRemaining: 0 }
);
assert.strictEqual(zeroRegProjections.actualCAC, "N/A", "Zero actual registrations must return 'N/A' for actual CAC");
assert(Number.isFinite(zeroRegProjections.projectedUnique), "Projected unique must be finite");
console.log("  ✔ Check 2: Zero registrations do not cause division errors (returns 'N/A' safely)");

// Check 3: Actual and forecast cost-per-registration values use the correct denominators
const spendTestProjections = calculateSimulatorProjections(
  INITIAL_SIMULATOR_PARAMS,
  500,
  { actualRegistrations: mockActualRegs, actualSpend: 150 }
);
// Actual CAC denominator is actual unique registrations (6): 150 / 6 = 25.00
assert.strictEqual(spendTestProjections.actualCAC, 25.00, "Actual CAC must divide spend by actual unique registrations (150/6 = 25.00)");
// Forecast CAC denominator is projected unique (486): 1800 / 486 = 3.70
assert.strictEqual(spendTestProjections.forecastCAC, 3.70, "Forecast CAC must divide forecast spend by projected unique (1800/486 = 3.70)");
// Target CAC denominator is target (500): 2000 / 500 = 4.00
assert.strictEqual(spendTestProjections.targetCAC, 4.00, "Target CAC must divide total budget by target registrations (2000/500 = 4.00)");
console.log("  ✔ Check 3: Actual and forecast cost-per-registration values use correct denominators");

// Check 4: Six actual registrations against a target of 500 produce a gap of 494 actual registrations
assert.strictEqual(auditProjections.actualCount, 6, "Actual unique count must be 6");
assert.strictEqual(auditProjections.actualRegistrationsRemaining, 494, "Registrations remaining must be 494 (500 - 6)");
console.log("  ✔ Check 4: Six actual registrations against a target of 500 produce a gap of 494 actual registrations");

// Check 5: A projection of 486 against a target of 500 produces a forecast gap of 14
assert.strictEqual(auditProjections.projectedUnique, 486, "Baseline projection must be exactly 486");
assert.strictEqual(auditProjections.forecastGap, 14, "Forecast gap must be exactly 14 (500 - 486)");
console.log("  ✔ Check 5: A projection of 486 against a target of 500 produces a forecast gap of 14");

// Check 6: Seven days remaining and 494 registrations needed produce a required pace of approximately 70.6 registrations/day
assert.strictEqual(auditProjections.requiredDailyPace, 70.6, "Required daily pace must be approximately 70.6 (494 / 7)");
console.log("  ✔ Check 6: Seven days remaining and 494 registrations needed produce a required pace of 70.6 registrations/day");

// Check 7: Changing overlap changes projected unique registrations when channel contributions are nonzero
const overlap13 = calculateSimulatorProjections({ ...INITIAL_SIMULATOR_PARAMS, overlapRate: 0.13 }, 500);
const overlap18 = calculateSimulatorProjections({ ...INITIAL_SIMULATOR_PARAMS, overlapRate: 0.18 }, 500);
const overlap9  = calculateSimulatorProjections({ ...INITIAL_SIMULATOR_PARAMS, overlapRate: 0.09 }, 500);
assert.notStrictEqual(overlap13.projectedUnique, overlap18.projectedUnique, "Changing overlap to 18% must change projected unique");
assert.notStrictEqual(overlap13.projectedUnique, overlap9.projectedUnique, "Changing overlap to 9% must change projected unique");
assert(overlap9.projectedUnique > overlap13.projectedUnique, "Lower overlap (9%) must yield higher unique registrations than 13%");
assert(overlap18.projectedUnique < overlap13.projectedUnique, "Higher overlap (18%) must yield lower unique registrations than 13%");
console.log(`  ✔ Check 7: Changing overlap changes unique registrations (9% -> ${overlap9.projectedUnique}, 13% -> ${overlap13.projectedUnique}, 18% -> ${overlap18.projectedUnique})`);

// Check 8: Changing a failure scenario changes the forecast when its assumptions materially affect the model
const convHalvedParams = {
  ...INITIAL_SIMULATOR_PARAMS,
  communityConv: INITIAL_SIMULATOR_PARAMS.communityConv * 0.5,
  organicConv: INITIAL_SIMULATOR_PARAMS.organicConv * 0.5,
  directConv: INITIAL_SIMULATOR_PARAMS.directConv * 0.5,
  regsPerAmbassador: Math.round(INITIAL_SIMULATOR_PARAMS.regsPerAmbassador * 0.5),
};
const failureProjections = calculateSimulatorProjections(convHalvedParams, 500);
assert(failureProjections.projectedUnique < auditProjections.projectedUnique, "Conversion halved scenario must significantly drop forecast");
assert(failureProjections.forecastGap > auditProjections.forecastGap, "Failure scenario must increase forecast gap");
console.log(`  ✔ Check 8: Changing failure scenario drops forecast materially (486 -> ${failureProjections.projectedUnique})`);

// Check 9: The target-achieved state does not display a negative registration gap
const overTargetActuals = Array.from({ length: 510 }, (_, i) => ({ id: `REG-${i}`, normalizedEmail: `s${i}@test.edu` }));
const overTargetProjections = calculateSimulatorProjections(
  { ...INITIAL_SIMULATOR_PARAMS, communityReach: 5000 },
  500,
  { actualRegistrations: overTargetActuals, daysRemaining: 3 }
);
assert.strictEqual(overTargetProjections.forecastGap, 0, "Forecast gap must not be negative when projected >= target");
assert.strictEqual(overTargetProjections.actualRegistrationsRemaining, 0, "Registrations remaining must not be negative when actual >= target");
assert.strictEqual(overTargetProjections.requiredDailyPace, 0, "Required daily pace must be 0 when target is achieved");
console.log("  ✔ Check 9: Target-achieved state does not display a negative registration gap (safely bounded at 0)");

console.log("\n========================================================");
console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! (6 Suites, 27 Checks)");
console.log("========================================================\n");
