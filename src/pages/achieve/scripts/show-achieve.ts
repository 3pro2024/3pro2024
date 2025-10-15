import {
  ACHIEVEMENT_STORAGE_KEY,
  LEARNED_SHUWA_COUNT_KEY,
  LEARNED_SHUWA_LIST_KEY,
  QUIZ_COUNT_KEY,
  FULL_MARKS_KEY,
} from "../../../constants/localStorage";

// Achievement system for 手話ぷら
interface AchievementData {
  [key: string]: boolean;
}

interface AchievementCondition {
  type:
    | "correct_answers" // 正解数
    | "perfect_count" // 完全正解数
    | "learned_count"
    | "play_count"
    | "special";
  mode?: "reading" | "expression" | "dialect";
  level?: "easy" | "normal" | "hard";
  threshold?: number;
  specialId?:
    | "video-334" // id334の動画を視聴
    | "total-perfect-5" // 合計5回満点
    | "fingerspelling-table" // 指文字表確認
    | "quiz-222" // id222のクイズを正解
    | "secret"; // その他の秘密条件
}

// 全アチーブメント条件定義（Map管理）
const ACHIEVEMENT_CONDITIONS = new Map<string, AchievementCondition>([
  // 読み取り合計
  [
    "imamura-1",
    {
      type: "correct_answers",
      mode: "reading",
      level: "easy",
      threshold: 1,
    },
  ],
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
    "uchimura-1",
    {
      type: "correct_answers",
      mode: "expression",
      level: "easy",
      threshold: 1,
    },
  ],
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
      type: "correct_answers",
      mode: "reading",
      level: "hard",
      threshold: 5,
    },
  ],
  [
    "itoga-2",
    {
      type: "correct_answers",
      mode: "reading",
      level: "hard",
      threshold: 30,
    },
  ],
  [
    "itoga-3",
    {
      type: "correct_answers",
      mode: "reading",
      level: "hard",
      threshold: 50,
    },
  ],
  [
    "itoga-4",
    {
      type: "correct_answers",
      mode: "reading",
      level: "hard",
      threshold: 100,
    },
  ],
  [
    "itoga-5",
    {
      type: "perfect_count",
      mode: "reading",
      level: "hard",
      threshold: 1,
    },
  ],
  [
    "itoga-6",
    {
      type: "perfect_count",
      mode: "reading",
      level: "hard",
      threshold: 5,
    },
  ],
  [
    "itoga-7",
    {
      type: "perfect_count",
      mode: "reading",
      level: "hard",
      threshold: 10,
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

  // 特殊系
  [
    "uchimura-7",
    {
      type: "special",
      specialId: "secret",
    },
  ],
  [
    "kagimoto-7",
    {
      type: "special",
      specialId: "video-334",
    },
  ],
  [
    "reader-1",
    {
      type: "special",
      specialId: "total-perfect-5",
    },
  ],
  [
    "reader-6",
    {
      type: "special",
      specialId: "fingerspelling-table",
    },
  ],
  [
    "reader-7",
    {
      type: "special",
      specialId: "secret",
    },
  ],
]);

// Team member hiragana characters
const MEMBER_CHARACTERS = {
  imamura: ["i.png", "ma.png", "mu.png", "ra.png", "a.png", "ko.png"],
  uchimura: [
    "u.png",
    "chi.png",
    "mu.png",
    "ra.png",
    "to.png",
    "mo.png",
    "ki.png",
  ],
  itoga: ["i.png", "to.png", "ga.gif", "ta.png", "i.png", "yo.png", "u.png"],
  fukuda: ["fu.png", "ku.png", "da.png", "ke.png", "i.png", "to.png"],
  kagimoto: [
    "ka.png",
    "gi.gif",
    "mo.png",
    "to.png",
    "e.png",
    "i.png",
    "ji.gif",
  ],
  reader: ["o.png", "o.png", "ka.png", "wa.png", "se.png", "i.png", "ya.png"],
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

// 条件から日本語の説明テキストを生成
function getConditionDescription(condition: AchievementCondition): string {
  const modeText: Record<string, string> = {
    reading: "読み取り",
    expression: "表現",
    dialect: "方言",
  };

  const levelText: Record<string, string> = {
    easy: "初級",
    normal: "中級",
    hard: "上級",
  };

  const mode = condition.mode ? modeText[condition.mode] || "" : "";
  const level = condition.level ? levelText[condition.level] || "" : "";

  switch (condition.type) {
    case "correct_answers":
      return `${mode}${level}で${condition.threshold}問正解`;
    case "perfect_count":
      return `${mode}${level}で${condition.threshold}回満点`;
    case "learned_count":
      return `学習数${condition.threshold}個達成`;
    case "play_count":
      return `プレイ数${condition.threshold}回達成`;
    case "special":
      return getSpecialConditionDescription(condition.specialId);
    default:
      return "条件を達成";
  }
}

// 特殊条件の説明テキストを生成
function getSpecialConditionDescription(specialId?: string): string {
  switch (specialId) {
    case "video-334":
      return "特定の動画を視聴する";
    case "total-perfect-5":
      return "合計5回満点を記録する";
    case "fingerspelling-table":
      return "指文字表を確認する";
    case "quiz-222":
      return "特定のクイズに正解する";
    case "secret":
      return "???";
    default:
      return "???";
  }
}

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
          const charName = hiraganaChar.replace(".png", "");
          element.innerHTML = `<img src="/new/${hiraganaChar}" alt="${charName}" width="28" height="28">`;
          element.removeAttribute("data-tooltip");
        } else {
          element.classList.remove("completed");
          element.textContent = "？";

          // 未解除の実績にツールチップを設定
          const condition = ACHIEVEMENT_CONDITIONS.get(achievementId);
          if (condition) {
            const tooltipText = getConditionDescription(condition);
            element.setAttribute("data-tooltip", tooltipText);
          }
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
  // 特殊条件の判定
  if (condition.type === "special") {
    return checkSpecialCondition(condition.specialId);
  }

  // 通常条件の判定
  const key = getStorageKey(condition);
  const count = storageData.get(key) || 0;
  return count >= condition.threshold!;
}

// 特殊条件の判定ロジック
function checkSpecialCondition(specialId?: string): boolean {
  if (!specialId) return false;

  switch (specialId) {
    case "video-334": {
      // id334の動画を視聴したか（学習リストに334が含まれるか）
      const learnedList = JSON.parse(
        localStorage.getItem(LEARNED_SHUWA_LIST_KEY) || "[]",
      ) as number[];
      return learnedList.includes(334);
    }
    case "total-perfect-5": {
      // 合計5回満点を記録したか
      const fullMarks = parseInt(
        localStorage.getItem(FULL_MARKS_KEY) || "0",
        10,
      );
      return fullMarks >= 5;
    }
    case "fingerspelling-table": {
      // 指文字表を確認したか（学習リストに9999が含まれるか）
      const learnedList = JSON.parse(
        localStorage.getItem(LEARNED_SHUWA_LIST_KEY) || "[]",
      ) as number[];
      return learnedList.includes(9999);
    }
    case "quiz-222": {
      // id222のクイズに正解したか
      // TODO: クイズ正解履歴を保存する仕組みを実装後に有効化
      // 現時点では学習リストに222が含まれるかで判定
      const learnedList = JSON.parse(
        localStorage.getItem(LEARNED_SHUWA_LIST_KEY) || "[]",
      ) as number[];
      return learnedList.includes(222);
    }
    case "secret":
      // その他の秘密条件（現時点では未実装）
      return false;
    default:
      return false;
  }
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
