/**
 * Initial Seed Data for Campus Growth Radar
 * All seed records are marked as illustrative demo data for simulation purposes.
 */

export const INITIAL_CAMPAIGN_SETTINGS = {
  campaignName: "Build Your First AI Project in 60 Minutes",
  targetRegistrations: 500,
  budget: 2000, // in INR
  durationDays: 7,
  targetAudience: "Final-Year Engineering Students (2025/2026 Batch)",
  mode: "simulation", // "simulation" | "active"
  overlapRate: 0.12, // 12% baseline channel overlap
  startDate: "2026-11-01",
  endDate: "2026-11-07",
};

export const INITIAL_COMMUNITIES = [
  {
    id: "comm-1",
    name: "Tier-1 & 2 College Coding Clubs (5 Partner Campuses)",
    category: "College Coding Club",
    estimatedReach: 1400,
    reachableAudience: 850,
    conversionRate: 0.082, // 8.2%
    effortHours: 6,
    cost: 400,
    confidence: "High",
    accessStatus: "approved", // uncontacted | contact_identified | permission_requested | approved | unavailable
    notes: "Direct tie-up with Club Leads. Exclusive hands-on AI teaser demo approved.",
    isDemo: true,
  },
  {
    id: "comm-2",
    name: "Final-Year Placement Prep WhatsApp / Discord Groups",
    category: "Placement Prep Group",
    estimatedReach: 2100,
    reachableAudience: 1200,
    conversionRate: 0.075, // 7.5%
    effortHours: 8,
    cost: 350,
    confidence: "Medium",
    accessStatus: "permission_requested",
    notes: "High intent students anxious about tech hiring. Messaging focused on project portfolio for interviews.",
    isDemo: true,
  },
  {
    id: "comm-3",
    name: "CS & IT Official Final-Year Class Representative Channels",
    category: "Final-Year Class",
    estimatedReach: 1600,
    reachableAudience: 950,
    conversionRate: 0.09, // 9.0%
    effortHours: 5,
    cost: 250,
    confidence: "High",
    accessStatus: "contact_identified",
    notes: "CRs verified. Need outcome-oriented 1-page circular for broadcast.",
    isDemo: true,
  },
  {
    id: "comm-4",
    name: "IEEE & ACM Student Branch Chapters",
    category: "Technical Society",
    estimatedReach: 900,
    reachableAudience: 480,
    conversionRate: 0.065, // 6.5%
    effortHours: 7,
    cost: 300,
    confidence: "Medium",
    accessStatus: "permission_requested",
    notes: "Requires formal event endorsement; slightly bureaucratic permission flow.",
    isDemo: true,
  },
  {
    id: "comm-5",
    name: "Open Source & Student Dev Discord Guilds (Regional)",
    category: "Student Developer Community",
    estimatedReach: 1100,
    reachableAudience: 600,
    conversionRate: 0.05, // 5.0%
    effortHours: 4,
    cost: 200,
    confidence: "Low",
    accessStatus: "uncontacted",
    notes: "Tech-savvy students, skeptical of webinars unless live coding proof is demonstrated.",
    isDemo: true,
  },
  {
    id: "comm-6",
    name: "Campus Ambassador Peer-to-Peer Network",
    category: "Campus Ambassador Network",
    estimatedReach: 1500,
    reachableAudience: 900,
    conversionRate: 0.11, // 11.0%
    effortHours: 12,
    cost: 500,
    confidence: "High",
    accessStatus: "approved",
    notes: "12 active final-year student reps equipped with personalized referral links and swag incentives.",
    isDemo: true,
  },
];

export const INITIAL_SIMULATOR_PARAMS = {
  // Preset: Base Case
  communityReach: 2800,
  communityConv: 0.07, // 7.0%
  communityCost: 500,

  ambassadorsCount: 12,
  regsPerAmbassador: 16,
  ambassadorCost: 650,

  organicReach: 3200,
  organicConv: 0.024, // 2.4%
  organicCost: 250,

  directOutreachReach: 1100,
  directConv: 0.085, // 8.5%
  directCost: 400,

  overlapRate: 0.13, // 13% overlap deduplication
  budget: 2000,
  campaignDays: 7,
};

export const SIMULATOR_PRESETS = {
  conservative: {
    name: "Conservative",
    description: "Cautious adoption, higher friction with CR approvals, 18% channel overlap",
    params: {
      communityReach: 2000,
      communityConv: 0.048,
      communityCost: 450,
      ambassadorsCount: 8,
      regsPerAmbassador: 10,
      ambassadorCost: 500,
      organicReach: 2400,
      organicConv: 0.015,
      organicCost: 200,
      directOutreachReach: 700,
      directConv: 0.055,
      directCost: 350,
      overlapRate: 0.18,
      budget: 2000,
      campaignDays: 7,
    },
  },
  base: {
    name: "Base Case",
    description: "Realistic balanced execution across approved student clubs and peer ambassadors",
    params: {
      communityReach: 2800,
      communityConv: 0.07,
      communityCost: 500,
      ambassadorsCount: 12,
      regsPerAmbassador: 16,
      ambassadorCost: 650,
      organicReach: 3200,
      organicConv: 0.024,
      organicCost: 250,
      directOutreachReach: 1100,
      directConv: 0.085,
      directCost: 400,
      overlapRate: 0.13,
      budget: 2000,
      campaignDays: 7,
    },
  },
  optimistic: {
    name: "Optimistic",
    description: "Viral peer sharing, high CR broadcast speed, low 9% overlap",
    params: {
      communityReach: 3600,
      communityConv: 0.09,
      communityCost: 600,
      ambassadorsCount: 15,
      regsPerAmbassador: 22,
      ambassadorCost: 800,
      organicReach: 4500,
      organicConv: 0.035,
      organicCost: 300,
      directOutreachReach: 1500,
      directConv: 0.11,
      directCost: 300,
      overlapRate: 0.09,
      budget: 2000,
      campaignDays: 7,
    },
  },
};

export const INITIAL_MISSIONS = [
  {
    id: "m-1",
    title: "Draft & Validate 60-Sec AI Project Teaser Copy",
    description: "Create outcome-focused WhatsApp message highlighting what final years will build: a working resume AI agent.",
    channel: "Content & Copy",
    owner: "Growth Lead",
    effortHours: 3,
    cost: 0,
    expectedOutcome: "Approved copy with 2 A/B test variations ready for CR dissemination",
    metric: "Copy sign-off & 2 variants ready",
    dueDay: 1,
    status: "completed",
  },
  {
    id: "m-2",
    title: "Recruit & Onboard 12 Campus Ambassadors",
    description: "Identify high-reputation final year students across targeted colleges; issue unique referral codes and ₹50 incentive structure.",
    channel: "Ambassador Network",
    owner: "Community Strategist",
    effortHours: 6,
    cost: 600,
    expectedOutcome: "12 active ambassadors sharing with batchmates",
    metric: "12 active unique referral codes deployed",
    dueDay: 2,
    status: "in_progress",
  },
  {
    id: "m-3",
    title: "Secure Class Representative Broadcast in 5 Campuses",
    description: "Pitch placement coordinators & CRs with the formal 1-page circular for evening batch announcements.",
    channel: "Final-Year Class",
    owner: "Campus Relations",
    effortHours: 5,
    cost: 300,
    expectedOutcome: "3,000+ targeted final-year batch impressions",
    metric: "5 college CR broadcasts confirmed",
    dueDay: 3,
    status: "in_progress",
  },
  {
    id: "m-4",
    title: "Host Live Mini-Teaser Demo on Coding Club Discord",
    description: "Run a 10-minute live screen share building a 20-line LLM script to build anticipation for the full 60-min workshop.",
    channel: "College Coding Club",
    owner: "Technical Advocate",
    effortHours: 4,
    cost: 200,
    expectedOutcome: "High trust and >15% conversion spike from tech attendees",
    metric: "75+ attendees at teaser demo",
    dueDay: 4,
    status: "not_started",
  },
  {
    id: "m-5",
    title: "Mid-Campaign Conversion Audit & Friction Removal",
    description: "Analyze drop-offs in registration flow, test mobile form speed, and re-allocate remaining budget to top converting channel.",
    channel: "Analytics & Growth",
    owner: "Product Engineer",
    effortHours: 3,
    cost: 100,
    expectedOutcome: "Reduce mobile abandonment by >15%",
    metric: "Conversion rate lift +1.2%",
    dueDay: 5,
    status: "not_started",
  },
  {
    id: "m-6",
    title: "Final 48-Hour Urgency Broadcast & Reminder Pulse",
    description: "Send calendar sync invites to existing registrants and deploy last-call peer status updates.",
    channel: "Peer Referral",
    owner: "Growth Lead",
    effortHours: 4,
    cost: 250,
    expectedOutcome: "Close final 100 registration gap and maximize workshop attendance intent",
    metric: "100+ final sprint registrations",
    dueDay: 6,
    status: "not_started",
  },
];

export const INITIAL_EXPERIMENTS = [
  {
    id: "exp-1",
    name: "Outcome-Focused Message vs Generic Workshop Announcement",
    hypothesis: "Framing the workshop around 'Build a concrete project for your resume' will achieve >40% higher click-to-register conversion than 'Free AI Workshop' announcement.",
    variantA: "Generic Announcement: 'Join our free 60-min AI workshop this Saturday. Learn GenAI concepts.'",
    variantB: "Outcome-Focused: 'Build & deploy your first working AI project in 60 mins. Add a verified GenAI repo to your resume before placements.'",
    audience: "Final-year placement WhatsApp groups (1,200 eligible students)",
    primaryMetric: "Unique Registration Conversion Rate (%)",
    supportingMetrics: "Click-through rate (CTR), Form Completion Rate",
    sampleSizeA: 420,
    conversionsA: 24, // 5.71%
    sampleSizeB: 430,
    conversionsB: 46, // 10.70%
    status: "completed", // "draft" | "running" | "completed"
    startDay: 1,
    endDay: 3,
    notes: "Variant B delivered an 87% relative conversion lift. Adopted as default master copy across all channels.",
  },
  {
    id: "exp-2",
    name: "Peer Ambassador Recommendation vs General Community Blast",
    hypothesis: "A personalized 1-on-1 DM referral from a known batchmate will yield 2.5x higher conversion than an admin broadcast in a 500-member group.",
    variantA: "Admin Channel Blast: Pinned message in community announcement channel with universal link.",
    variantB: "Ambassador Peer DM: Personalized peer note with dedicated referral code and batchmate invite.",
    audience: "Partner College Coding Clubs & Branch Groups (900 students)",
    primaryMetric: "Attributed Registrations per 100 Reached",
    supportingMetrics: "Attendance confirmation, Ambassador viral coefficient",
    sampleSizeA: 380,
    conversionsA: 19, // 5.0%
    sampleSizeB: 350,
    conversionsB: 48, // 13.71%
    status: "running",
    startDay: 2,
    endDay: 5,
    notes: "Peer referral shows significantly higher intent and completion rate. Requires maintaining ambassador motivation.",
  },
  {
    id: "exp-3",
    name: "Project-Oriented CTA vs Generic 'Register Now' CTA",
    hypothesis: "Changing the registration button CTA from 'Register Now' to 'Claim My Project Seat' creates stronger psychological ownership and reduces abandonment.",
    variantA: "Generic CTA: 'Register Now' (Standard blue button)",
    variantB: "Project CTA: 'Reserve My Build Seat — Free' (High-contrast action)",
    audience: "Mobile registration page visitors (A/B traffic split)",
    primaryMetric: "Form Submission Rate among Visitors (%)",
    supportingMetrics: "Time on page, bounce rate",
    sampleSizeA: 260,
    conversionsA: 38, // 14.6%
    sampleSizeB: 275,
    conversionsB: 54, // 19.6%
    status: "running",
    startDay: 3,
    endDay: 6,
    notes: "Early indicators show +5.0% absolute lift for Variant B. Statistically significant trend forming.",
  },
];

export const INITIAL_AMBASSADORS = [
  { id: "amb-1", displayName: "Priya Sharma (IIT/NIT Campus Lead)", referralCode: "AMB-PRIYA", college: "National Institute of Technology", channel: "Class CR & Tech Guild", clicks: 210, registrations: 34, isDemo: true },
  { id: "amb-2", displayName: "Rohit Verma (Coding Club Lead)", referralCode: "AMB-ROHIT", college: "Govt Engineering College", channel: "Discord & Coding Club", clicks: 185, registrations: 29, isDemo: true },
  { id: "amb-3", displayName: "Sneha Patel (Placement Coordinator)", referralCode: "AMB-SNEHA", college: "Institute of Technology & Science", channel: "Placement Prep Group", clicks: 195, registrations: 31, isDemo: true },
  { id: "amb-4", displayName: "Aditya Nair (IEEE Student Chair)", referralCode: "AMB-ADITYA", college: "University College of Engineering", channel: "IEEE & Tech Society", clicks: 140, registrations: 18, isDemo: true },
  { id: "amb-5", displayName: "Kavya Reddy (Developer Community Rep)", referralCode: "AMB-KAVYA", college: "Tech Institute of Engineering", channel: "Telegram & Batch Network", clicks: 160, registrations: 23, isDemo: true },
];

export const INITIAL_TEST_REGISTRATIONS = [
  {
    id: "REG-1001",
    name: "Arjun Mehta",
    email: "arjun.m2025@gmail.com",
    normalizedEmail: "arjun.m2025@gmail.com",
    graduationYear: "2025",
    college: "National Institute of Technology",
    source: "ambassador",
    referralCode: "AMB-PRIYA",
    createdAt: "2026-10-27T10:14:00.000Z",
    isDemo: true,
  },
  {
    id: "REG-1002",
    name: "Deepa Krishnan",
    email: "deepa.k@college.edu",
    normalizedEmail: "deepa.k@college.edu",
    graduationYear: "2025",
    college: "Govt Engineering College",
    source: "coding_club",
    referralCode: "AMB-ROHIT",
    createdAt: "2026-10-27T11:32:00.000Z",
    isDemo: true,
  },
  {
    id: "REG-1003",
    name: "Vikram Sen",
    email: "v.sen25@gmail.com",
    normalizedEmail: "v.sen25@gmail.com",
    graduationYear: "2025",
    college: "Institute of Technology & Science",
    source: "placement_prep",
    referralCode: "AMB-SNEHA",
    createdAt: "2026-10-27T14:45:00.000Z",
    isDemo: true,
  },
  {
    id: "REG-1004",
    name: "Ananya Deshmukh",
    email: "ananya.d@gmail.com",
    normalizedEmail: "ananya.d@gmail.com",
    graduationYear: "2026",
    college: "University College of Engineering",
    source: "direct",
    referralCode: "",
    createdAt: "2026-10-27T16:10:00.000Z",
    isDemo: true,
  },
  {
    id: "REG-1005",
    name: "Rahul Nambiar",
    email: "rahul.nambiar@gmail.com",
    normalizedEmail: "rahul.nambiar@gmail.com",
    graduationYear: "2025",
    college: "Tech Institute of Engineering",
    source: "ambassador",
    referralCode: "AMB-KAVYA",
    createdAt: "2026-10-27T18:05:00.000Z",
    isDemo: true,
  },
];
