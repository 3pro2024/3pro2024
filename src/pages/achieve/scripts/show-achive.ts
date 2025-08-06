// Achievement system for 手話ぷら
interface AchievementData {
  [key: string]: boolean;
}

// LocalStorage key for all achievements
const ACHIEVEMENT_STORAGE_KEY = "shuwa-achievements";

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
          const hiraganaChar = MEMBER_CHARACTERS[memberName][charIndex - 1];

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

  // For demo: add some completed achievements if none exist
  if (Object.keys(achievements).length === 0) {
    achievements["itoga-1"] = true;
    achievements["itoga-2"] = true;
    achievements["uchimura-4"] = true;
    achievements["uchimura-5"] = true;
    achievements["kagimoto-1"] = true;
    saveAchievements(achievements);
  }

  updateAchievementUI();
}

// Public API for other parts of the app to unlock achievements
function unlockAchievement(achievementId: string): void {
  const achievements = getAchievements();
  achievements[achievementId] = true;
  saveAchievements(achievements);
  updateAchievementUI();
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", initializeAchievements);

// Export for use by other scripts
(window as any).unlockAchievement = unlockAchievement;
