import { Page } from "@playwright/test";

/**
 * ページナビゲーションヘルパー関数
 */

/**
 * タイトル画面に移動
 */
export async function gotoTitle(page: Page) {
  await page.goto("/");
  await page
    .waitForLoadState("networkidle", { timeout: 10000 })
    .catch(() => {});
}

/**
 * モード選択画面に移動
 */
export async function gotoModeSelect(page: Page) {
  await page.goto("/modeselect/");
  await page.waitForLoadState("networkidle");
}

/**
 * クイズ画面に移動（レベル指定可能）
 */
export async function gotoQuiz(page: Page, level?: string) {
  const url = level ? `/quiz/?level=${level}` : "/quiz/";
  await page.goto(url);
  await page.waitForLoadState("networkidle");
}

/**
 * 学習モード画面に移動（ランク指定可能）
 */
export async function gotoLearn(page: Page, rank?: string) {
  const url = rank ? `/learn/?rank=${rank}` : "/learn/";
  await page.goto(url);
  await page.waitForLoadState("networkidle");
}

/**
 * 実績画面に移動
 */
export async function gotoAchieve(page: Page) {
  await page.goto("/achieve/");
  await page.waitForLoadState("networkidle");
}

/**
 * 結果画面に移動
 */
export async function gotoResult(page: Page) {
  await page.goto("/result/");
  await page.waitForLoadState("networkidle");
}

/**
 * 遊び方画面に移動
 */
export async function gotoExplain(page: Page) {
  await page.goto("/explain/");
  await page.waitForLoadState("networkidle");
}

/**
 * 要素が表示されるまで待機
 */
export async function waitForElement(
  page: Page,
  selector: string,
  timeout = 5000,
) {
  await page.waitForSelector(selector, { state: "visible", timeout });
}

/**
 * ボタンをクリックして次のページに遷移
 */
export async function clickAndNavigate(page: Page, selector: string) {
  await page.click(selector);
  await page.waitForLoadState("networkidle");
}
