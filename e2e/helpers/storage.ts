import { Page } from "@playwright/test";

/**
 * LocalStorageヘルパー関数
 */

/**
 * LocalStorageをクリア
 */
export async function clearStorage(page: Page) {
  try {
    await page.evaluate(() => {
      localStorage.clear();
    });
  } catch (error) {
    // LocalStorageにアクセスできない場合（ページが読み込まれていない等）はスキップ
    console.warn("LocalStorage clear failed:", error);
  }
}

/**
 * LocalStorageの値を取得
 */
export async function getStorageItem(
  page: Page,
  key: string,
): Promise<string | null> {
  try {
    return await page.evaluate((k) => {
      return localStorage.getItem(k);
    }, key);
  } catch (error) {
    console.warn("LocalStorage getItem failed:", error);
    return null;
  }
}

/**
 * LocalStorageに値を設定
 */
export async function setStorageItem(page: Page, key: string, value: string) {
  try {
    await page.evaluate(
      ({ k, v }) => {
        localStorage.setItem(k, v);
      },
      { k: key, v: value },
    );
  } catch (error) {
    console.warn("LocalStorage setItem failed:", error);
  }
}

/**
 * LocalStorageの全データを取得
 */
export async function getAllStorage(
  page: Page,
): Promise<Record<string, string>> {
  try {
    return await page.evaluate(() => {
      const storage: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          storage[key] = localStorage.getItem(key) || "";
        }
      }
      return storage;
    });
  } catch (error) {
    console.warn("LocalStorage getAllStorage failed:", error);
    return {};
  }
}

/**
 * クイズ結果をLocalStorageに保存
 */
export async function saveQuizResult(
  page: Page,
  level: string,
  correctCount: number,
  totalCount: number,
) {
  const result = {
    level,
    correctCount,
    totalCount,
    timestamp: Date.now(),
  };
  await setStorageItem(page, `quiz_result_${level}`, JSON.stringify(result));
}

/**
 * 実績バッジをLocalStorageに保存
 */
export async function saveAchievement(page: Page, achievementId: string) {
  const achievements = await getStorageItem(page, "achievements");
  const achievementList = achievements ? JSON.parse(achievements) : [];

  if (!achievementList.includes(achievementId)) {
    achievementList.push(achievementId);
    await setStorageItem(page, "achievements", JSON.stringify(achievementList));
  }
}

/**
 * 実績バッジが保存されているか確認
 */
export async function hasAchievement(
  page: Page,
  achievementId: string,
): Promise<boolean> {
  const achievements = await getStorageItem(page, "achievements");
  if (!achievements) return false;

  const achievementList = JSON.parse(achievements);
  return achievementList.includes(achievementId);
}
