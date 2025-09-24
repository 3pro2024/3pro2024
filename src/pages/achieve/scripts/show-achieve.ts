import {
  ACHIEVEMENT_STORAGE_KEY,
  LEARNED_SHUWA_COUNT_KEY,
  QUIZ_COUNT_KEY,
} from "../../../constants/localStorage";

// Achievement system for 手話ぷら
interface AchievementData {
  [key: string]: boolean;
}

interface AchievementCondition {
  type:
    | "correct_answers"
    | "perfect_count"
    | "learned_count"
    | "play_count"
    | "special";
  mode?: "reading" | "expression" | "dialect";
  level?: "easy" | "normal" | "hard";
  threshold: number;
}

// 全アチーブメント条件定義（Map管理）
const ACHIEVEMENT_CONDITIONS = new Map<string, AchievementCondition>([
  // 読み取り合計
  [
    "imamura-2",
    {
      type: "correct_answers",
      mode: "reading",
      level: "easy",
      threshold: 10,
    },
  ],
  [
    "imamura-3",
    {
      type: "correct_answers",
      mode: "reading",
      level: "easy",
      threshold: 50,
    },
  ],
  [
    "imamura-4",
    {
      type: "correct_answers",
      mode: "reading",
      level: "easy",
      threshold: 100,
    },
  ],
  [
    "imamura-5",
    {
      type: "correct_answers",
      mode: "reading",
      level: "normal",
      threshold: 50,
    },
  ],
  [
    "imamura-6",
    {
      type: "correct_answers",
      mode: "reading",
      level: "normal",
      threshold: 100,
    },
  ],

  // 読み取り合計
  [
    "uchimura-2",
    {
      type: "correct_answers",
      mode: "expression",
      level: "easy",
      threshold: 10,
    },
  ],
  [
    "uchimura-3",
    {
      type: "correct_answers",
      mode: "expression",
      level: "easy",
      threshold: 50,
    },
  ],
  [
    "uchimura-4",
    {
      type: "correct_answers",
      mode: "expression",
      level: "easy",
      threshold: 100,
    },
  ],
  [
    "uchimura-5",
    {
      type: "correct_answers",
      mode: "expression",
      level: "normal",
      threshold: 50,
    },
  ],
  [
    "uchimura-6",
    {
      type: "correct_answers",
      mode: "expression",
      level: "normal",
      threshold: 100,
    },
  ],

  // 上級
  [
    "itoga-1",
    {
      type: "perfect_count",
      mode: "reading",
      level: "hard",
      threshold: 10,
    },
  ],
  [
    "itoga-2",
    {
      type: "perfect_count",
      mode: "reading",
      level: "hard",
      threshold: 50,
    },
  ],
  [
    "itoga-3",
    {
      type: "perfect_count",
      mode: "reading",
      level: "hard",
      threshold: 100,
    },
  ],
  [
    "itoga-4",
    {
      type: "perfect_count",
      mode: "expression",
      level: "hard",
      threshold: 10,
    },
  ],
  [
    "itoga-5",
    {
      type: "perfect_count",
      mode: "expression",
      level: "hard",
      threshold: 50,
    },
  ],
  [
    "itoga-6",
    {
      type: "perfect_count",
      mode: "expression",
      level: "hard",
      threshold: 100,
    },
  ],

  // 方言手話
  [
    "fukuda-1",
    {
      type: "correct_answers",
      mode: "dialect",
      threshold: 5,
    },
  ],
  [
    "fukuda-2",
    {
      type: "correct_answers",
      mode: "dialect",
      threshold: 30,
    },
  ],
  [
    "fukuda-3",
    {
      type: "correct_answers",
      mode: "dialect",
      threshold: 50,
    },
  ],
  [
    "fukuda-4",
    {
      type: "correct_answers",
      mode: "dialect",
      threshold: 70,
    },
  ],
  [
    "fukuda-5",
    {
      type: "correct_answers",
      mode: "dialect",
      threshold: 100,
    },
  ],
  [
    "fukuda-6",
    {
      type: "correct_answers",
      mode: "dialect",
      threshold: 150,
    },
  ],
  // 学習系（鍵本シリーズ）
  ["kagimoto-1", { type: "learned_count", threshold: 10 }],
  ["kagimoto-2", { type: "learned_count", threshold: 50 }],
  ["kagimoto-3", { type: "learned_count", threshold: 100 }],
  ["kagimoto-4", { type: "learned_count", threshold: 200 }],
  ["kagimoto-5", { type: "learned_count", threshold: 300 }],
  ["kagimoto-6", { type: "learned_count", threshold: 400 }], // TODO: 実際の全単語数に変更

  // 満点
  [
    "reader-2",
    { type: "perfect_count", mode: "reading", level: "easy", threshold: 10 },
  ],
  [
    "reader-3",
    { type: "perfect_count", mode: "reading", level: "normal", threshold: 10 },
  ],
  [
    "reader-4",
    { type: "perfect_count", mode: "expression", level: "easy", threshold: 10 },
  ],
  [
    "reader-5",
    {
      type: "perfect_count",
      mode: "expression",
      level: "normal",
      threshold: 10,
    },
  ],
]);

// Team member hiragana characters
const MEMBER_CHARACTERS = {
  imamura: ["い", "ま", "む", "ら", "あ", "こ"],
  uchimura: ["う", "ち", "む", "ら", "と", "も", "き"],
  itoga: ["い", "と", "が", "た", "い", "よ", "う"],
  fukuda: ["ふ", "く", "だ", "け", "い", "と"],
  kagimoto: ["か", "ぎ", "も", "と", "え", "い", "じ"],
  reader: ["お", "お", "か", "わ", "せ", "い", "や"],
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

// localStorageからアチーブメントデータを読み込み
function loadAchievements(): AchievementData {
  try {
    const stored = localStorage.getItem(ACHIEVEMENT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Failed to load achievements:", error);
    return {};
  }
}

// localStorageにアチーブメントデータを保存
function saveAchievements(achievements: AchievementData): void {
  try {
    localStorage.setItem(ACHIEVEMENT_STORAGE_KEY, JSON.stringify(achievements));
  } catch (error) {
    console.error("Failed to save achievements:", error);
  }
}

// アチーブメント状態に基づきUIを更新
function updateAchievementUI(): void {
  const achievements = loadAchievements();

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

// アチーブメントシステムを初期化
function initializeAchievements(): void {
  checkAllAchievements();
  updateAchievementUI();
}

// 指定アチーブメントを強制解除（デバッグ用API）
export function unlockAchievement(achievementId: string): void {
  const achievements = loadAchievements();
  achievements[achievementId] = true;
  saveAchievements(achievements);
  updateAchievementUI();
}

// 全アチーブメント条件をチェック
function checkAllAchievements(): AchievementData {
  const achievements = loadAchievements();
  const storageData = getAllStorageData();

  for (const [achievementId, condition] of ACHIEVEMENT_CONDITIONS) {
    if (checkCondition(condition, storageData)) {
      achievements[achievementId] = true;
    }
  }

  saveAchievements(achievements);
  return achievements;
}

function checkCondition(
  condition: AchievementCondition,
  storageData: Map<string, number>,
): boolean {
  const key = getStorageKey(condition);
  const count = storageData.get(key) || 0;
  return count >= condition.threshold;
}

/**
 * 必要なデータを一括取得
 * @returns
 */
function getAllStorageData(): Map<string, number> {
  const data = new Map<string, number>();

  // 必要なキーをまとめて取得
  const keys = Array.from(ACHIEVEMENT_CONDITIONS.values()).map((condition) =>
    getStorageKey(condition),
  );

  for (const key of new Set(keys)) {
    // 重複削除
    data.set(key, parseInt(localStorage.getItem(key) || "0"));
  }

  return data;
}

/**
 * 判定のために必要なkeyを取得する
 * @param condition
 * @returns
 */
function getStorageKey(condition: AchievementCondition): string {
  // levelが存在しない場合（方言など）でも正しいキーを生成する
  const baseKey = `quiz-${condition.mode}${condition.level ? `-${condition.level}` : ""}`;

  switch (condition.type) {
    case "correct_answers":
      return `${baseKey}-count`;
    case "perfect_count":
      return `${baseKey}-perfect_count`;
    case "learned_count":
      return LEARNED_SHUWA_COUNT_KEY;
    default:
      return QUIZ_COUNT_KEY; // play_countなどのフォールバック
  }
}
// Initialize on page load
document.addEventListener("DOMContentLoaded", initializeAchievements);
