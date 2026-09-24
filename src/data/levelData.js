// Central data/config layer for the Level-Up Dashboard.
// Kept separate from UI so real backend data can replace this object
// without touching any component (see project README, "Data Architecture").
// All numeric values below are DEVELOPMENT / DEMO data only.

export const levelNames = [
  "Newcomer",
  "Explorer",
  "Achiever",
  "Voyager",
  "Champion",
  "Elite",
  "Master",
  "Legend",
];

export const userLevelData = {
  currentLevel: 4,
  currentLevelName: levelNames[3],
  currentXP: 6420,
  requiredXP: 8000,
  nextLevel: 5,
  nextLevelName: levelNames[4],
  nextLevelReward: {
    type: "VEs",
    amount: 500,
    icon: "coins",
  },
  nextLevelPerks: [
    "Higher daily XP limit",
    "Access to new challenges",
    "Better reward opportunities",
  ],
};

// "Today's Boost" quick-glance stat row on the hero card.
export const todaysBoost = {
  xpEarned: 215,
  tasksDone: 4,
  tasksTotal: 8,
  streakDays: 7,
};

// Full roadmap. Status is derived at render time from currentLevel,
// but rewards / names live here so they're easy to swap for real data.
export const levelRoadmap = [
  { level: 1, name: levelNames[0], reward: { type: "VEs", amount: 100 } },
  { level: 2, name: levelNames[1], reward: { type: "VEs", amount: 150 } },
  { level: 3, name: levelNames[2], reward: { type: "Gems", amount: 10 } },
  { level: 4, name: levelNames[3], reward: { type: "Gems", amount: 15 } },
  { level: 5, name: levelNames[4], reward: { type: "VEs", amount: 500 } },
  { level: 6, name: levelNames[5], reward: { type: "Spins", amount: 2 } },
  { level: 7, name: levelNames[6], reward: { type: "VEs", amount: 900 } },
  { level: 8, name: levelNames[7], reward: { type: "Gems", amount: 40 } },
];

// "Coming Soon" = concept only, not wired to a real backend yet (per spec
// section 23: only ship earning mechanisms approved by the product team).
export const earningFeatures = [
  {
    id: "watch-earn",
    title: "WATCH & POWER UP",
    description: "Turn watch time into XP.",
    xp: 50,
    icon: "play",
    status: "live",
  },
  {
    id: "daily-tasks",
    title: "DAILY MISSIONS",
    description: "Clear today's mission set.",
    xp: 30,
    icon: "check-square",
    status: "live",
  },
  {
    id: "refer-earn",
    title: "SQUAD REWARDS",
    description: "Build your squad and earn rewards.",
    xp: 100,
    icon: "users",
    status: "live",
  },
  {
    id: "play-earn",
    title: "GAME ARENA",
    description: "Enter the arena and stack XP.",
    xp: 25,
    icon: "gamepad",
    status: "live",
  },
  {
    id: "streak-bonus",
    title: "STREAK BOOST",
    description: "Keep your streak alive for bonus XP.",
    xp: 25,
    icon: "flame",
    status: "live",
  },
  {
    id: "reward-hunt",
    title: "LOOT HUNT",
    description: "Track down hidden reward drops.",
    xp: 40,
    icon: "search",
    status: "coming-soon",
  },
  {
    id: "weekly-quest",
    title: "WEEKLY RAID",
    description: "Take on the weekly mega objective.",
    xp: 150,
    icon: "calendar",
    status: "coming-soon",
  },
];

export const xpActivity = [
  { id: 1, xp: 20, label: "SQUAD REWARD", time: "Today, 10:45 AM" },
  { id: 2, xp: 50, label: "MISSION CLEARED", time: "Today, 09:12 AM" },
  { id: 3, xp: 75, label: "ARENA VICTORY", time: "Today, 08:30 AM" },
  { id: 4, xp: 0, ves: 10, label: "XP CATCHER DROP", time: "Today, 07:50 AM" },
  { id: 5, xp: 25, label: "STREAK BOOST", time: "Today, 07:20 AM" },
];

// XP Catcher: a golden hoop collector catches three kinds of falling
// items, each worth a different score/XP amount, with an occasional
// 2x multiplier drop. Distinct on purpose from the item variety of any
// single-item "coin catch" concept: three item types + a multiplier
// mechanic change both the visuals and the scoring rhythm.
export const gameConfig = {
  name: "XP Catcher",
  durationSeconds: 18,
  itemTypes: [
    { key: "xp", label: "XP", score: 10, xp: 4, weight: 3 },
    { key: "gem", label: "Gem", score: 15, xp: 2, gems: 1, weight: 2 },
    { key: "coin", label: "V", score: 10, xp: 0, ves: 2, weight: 3 },
  ],
  multiplierChance: 0.12,
  multiplierValue: 2,
  bonusThreshold: 80, // score needed for a bonus VE reward at the end
  bonusReward: { type: "VEs", amount: 12 },
};
