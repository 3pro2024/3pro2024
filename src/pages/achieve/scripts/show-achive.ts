import {
  ACHIEVEMENT_STORAGE_KEY,
  LEARNED_SHUWA_COUNT_KEY,
} from "../../../constants/localStorage";

// Achievement system for 手話ぷら
interface AchievementData {
  [key: string]: boolean;
}

interface ShuwaLearnedCount {
  key: string;
  value: number;
}

// 学習した数の条件の配列
const SHUWA_LEARNED_COUNT: ShuwaLearnedCount[] = [
  { key: "itoga-1", value: 1 },
  { key: "itoga-7", value: 200 },
  { key: "imamura-3", value: 100 },
  { key: "uchimura-1", value: 319 },
  { key: "uchimura-5", value: 500 },
  { key: "reader-1", value: 159 },
  { key: "kagimoto-2", value: 30 },
  { key: "kagimoto-5", value: 300 },
  { key: "fukuda-2", value: 50 },
];
// Team member hiragana characters
const MEMBER_CHARACTERS = {
  itoga: ["い", "と", "が", "た", "い", "よ", "う"],
  imamura: ["い", "む", "ら", "あ", "こ"],
  uchimura: ["う", "ち", "む", "ら", "と", "も", "き"],
  reader: ["お", "お", "か", "わ", "せ", "い", "や"],
  kagimoto: ["か", "ぎ", "も", "と", "え", "い", "じ"],
  fukuda: ["ふ", "く", "だ", "け", "い", "と"],
};

// Achievement badge selectors
const ACHIEVEMENT_GROUPS = {
  itoga: [
    "itoga-1",
    "itoga-2",
    "itoga-3",
    "itoga-4",
    "itoga-5",
    "itoga-6",
    "itoga-7",
  ],
  imamura: [
    "imamura-1",
    "imamura-2",
    "imamura-3",
    "imamura-4",
    "imamura-5",
    "imamura-6",
  ],
  uchimura: [
    "uchimura-1",
    "uchimura-2",
    "uchimura-3",
    "uchimura-4",
    "uchimura-5",
    "uchimura-6",
    "uchimura-7",
  ],
  reader: [
    "reader-1",
    "reader-2",
    "reader-3",
    "reader-4",
    "reader-5",
    "reader-6",
    "reader-7",
  ],
  kagimoto: [
    "kagimoto-1",
    "kagimoto-2",
    "kagimoto-3",
    "kagimoto-4",
    "kagimoto-5",
    "kagimoto-6",
    "kagimoto-7",
  ],
  fukuda: [
    "fukuda-1",
    "fukuda-2",
    "fukuda-3",
    "fukuda-4",
    "fukuda-5",
    "fukuda-6",
  ],
};

// Get achievements from localStorage
function getAchievements(): AchievementData {
  const stored = localStorage.getItem(ACHIEVEMENT_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

// Save achievements to localStorage
function saveAchievements(achievements: AchievementData): void {
  localStorage.setItem(ACHIEVEMENT_STORAGE_KEY, JSON.stringify(achievements));
}

// Update UI based on achievement status
function updateAchievementUI(): void {
  const achievements = getAchievements();

  // Update all achievement badges
  Object.values(ACHIEVEMENT_GROUPS)
    .flat()
    .forEach((achievementId) => {
      const element = document.querySelector(`.${achievementId}`);
      if (element) {
        if (achievements[achievementId]) {
          // Extract member name from achievement ID (e.g., 'itoga-1' → 'itoga')
          const memberName = achievementId.split(
            "-",
          )[0] as keyof typeof MEMBER_CHARACTERS;
          const charIndex = parseInt(achievementId.split("-")[1]);
          let hiraganaChar = "？";
          if (
            Number.isInteger(charIndex) &&
            charIndex > 0 &&
            charIndex <= MEMBER_CHARACTERS[memberName].length
          ) {
            hiraganaChar = MEMBER_CHARACTERS[memberName][charIndex - 1];
          }

          element.classList.add("completed");
          element.textContent = hiraganaChar;
        } else {
          element.classList.remove("completed");
          element.textContent = "？";
        }
      }
    });
}

// Initialize achievements (for demo purposes, add some completed ones)
function initializeAchievements(): void {
  const achievements = getAchievements();

  checkLearnedAchievements(achievements);
  updateAchievementUI();
}

// Public API for other parts of the app to unlock achievements
export function unlockAchievement(achievementId: string): void {
  const achievements = getAchievements();
  achievements[achievementId] = true;
  saveAchievements(achievements);
  updateAchievementUI();
}

function checkLearnedAchievements(
  achievements: AchievementData,
): AchievementData {
  const lerarnedShuwaCount = localStorage.getItem(LEARNED_SHUWA_COUNT_KEY);
  for (const learnedShuwa of SHUWA_LEARNED_COUNT) {
    if (
      lerarnedShuwaCount &&
      parseInt(lerarnedShuwaCount) >= learnedShuwa.value
    ) {
      achievements[learnedShuwa.key] = true;
    }
  }
  saveAchievements(achievements);
  return achievements;
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", initializeAchievements);
