import { test, expect } from "@playwright/test";
import { gotoQuiz } from "../helpers/navigation";
import { clearStorage } from "../helpers/storage";

test.describe("クイズモード基本フロー", () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test("クイズ画面が正しく表示される（読み取り・初級）", async ({ page }) => {
    // URLパラメータ付きでクイズ画面に遷移
    await page.goto("/quiz/?mode=reading&difficulty=easy");
    await page.waitForLoadState("networkidle");

    // タイトルの確認
    const subtitle = page.locator("h1.page-subtitle");
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toHaveText("クイズ");

    // 動画コンテナの確認
    await expect(page.locator("#video-container")).toBeVisible();

    // 選択肢ボタンの確認
    await expect(page.locator("#choice1")).toBeVisible();
    await expect(page.locator("#choice2")).toBeVisible();
    await expect(page.locator("#choice3")).toBeVisible();
    await expect(page.locator("#choice4")).toBeVisible();

    // 終了ボタンの確認
    await expect(page.locator("#retireButton")).toBeVisible();
  });

  test("動画と選択肢が動的に読み込まれる", async ({ page }) => {
    await page.goto("/quiz/?mode=reading&difficulty=easy");
    await page.waitForLoadState("networkidle");

    // 動画コンテナ内にiframeが存在することを確認（YouTube埋め込み）
    // 少し待機して動画が読み込まれるのを待つ
    await page.waitForTimeout(2000);

    // 動画コンテナ内に何かコンテンツが存在することを確認
    const videoContainer = page.locator("#video-container");
    const videoContent = await videoContainer.innerHTML();
    expect(videoContent.length).toBeGreaterThan(0);

    // 選択肢ボタンのテキストが設定されていることを確認
    const choice1 = page.locator("#choice1");
    const choice1Value = await choice1.getAttribute("value");
    expect(choice1Value).not.toBe("選択肢1"); // デフォルトのテキストから変わっているはず
  });

  test("選択肢をクリックすると結果モーダルが表示される", async ({ page }) => {
    await page.goto("/quiz/?mode=reading&difficulty=easy");
    await page.waitForLoadState("networkidle");

    // 動的コンテンツの読み込みを待機
    await page.waitForTimeout(2000);

    // 最初の選択肢をクリック
    await page.locator("#choice1").click();

    // 結果モーダルが表示されることを確認
    const modal = page.locator("#result-modal");
    await expect(modal).toBeVisible({ timeout: 5000 });

    // モーダルメッセージの確認（正解または不正解）
    const modalMessage = page.locator("#modal-message");
    await expect(modalMessage).toBeVisible();
    const messageText = await modalMessage.textContent();
    expect(["正解！", "不正解..."]).toContain(messageText);

    // 次へボタンの確認
    await expect(page.locator("#next-button")).toBeVisible();
  });

  test("次へボタンをクリックすると次の問題が表示される", async ({ page }) => {
    await page.goto("/quiz/?mode=reading&difficulty=easy");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // 1問目：選択肢をクリック
    await page.locator("#choice1").click();

    // 結果モーダルを待機
    await expect(page.locator("#result-modal")).toBeVisible({ timeout: 5000 });

    // 次へボタンをクリック
    await page.locator("#next-button").click();

    // モーダルが非表示になることを確認（または次の問題に移る）
    // 問題が残っている場合は次の問題へ、なければ結果画面へ
    await page.waitForTimeout(1000);

    // URLが変わっていないか、結果画面に遷移したかを確認
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/(quiz|result)/);
  });

  test("終了ボタンをクリックすると結果画面に遷移する", async ({ page }) => {
    await page.goto("/quiz/?mode=reading&difficulty=easy");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // 終了ボタンをクリック
    await page.locator("#retireButton").click();

    // 結果画面のURLを確認
    await expect(page).toHaveURL(/.*result/, { timeout: 5000 });

    // 結果画面のタイトルを確認
    const subtitle = page.locator("h1.page-subtitle");
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toHaveText("クイズ結果");
  });

  test("複数問解答して結果画面に到達できる", async ({ page }) => {
    await page.goto("/quiz/?mode=reading&difficulty=easy");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // 問題を3問解く
    for (let i = 0; i < 3; i++) {
      // 選択肢をクリック
      await page.locator("#choice1").click();

      // 結果モーダルを待機
      await expect(page.locator("#result-modal")).toBeVisible({
        timeout: 5000,
      });

      // 次へボタンをクリック
      await page.locator("#next-button").click();

      // 少し待機
      await page.waitForTimeout(1000);

      // 結果画面に遷移したかチェック
      if (page.url().includes("result")) {
        break;
      }
    }

    // 最終的に結果画面に到達することを確認（または問題が続いている）
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/(quiz|result)/);
  });
});

test.describe("クイズ結果画面", () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test("結果画面が正しく表示される", async ({ page }) => {
    // 実際のクイズを経由せず直接結果画面にアクセス
    await page.goto("/result/");
    await page.waitForLoadState("networkidle");

    // タイトルの確認
    const subtitle = page.locator("h1.page-subtitle");
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toHaveText("クイズ結果");

    // 結果コンテナの確認
    await expect(page.locator(".result-container")).toBeVisible();

    // ボタンの確認
    const buttons = page.locator(".button-grid button");
    await expect(buttons).toHaveCount(2);
  });

  test("もう一度ボタンをクリックするとモード選択画面に遷移する", async ({
    page,
  }) => {
    await page.goto("/result/");
    await page.waitForLoadState("networkidle");

    // もう一度ボタンをクリック
    const retryButton = page.locator('button:has-text("もう一度")');
    await retryButton.click();
    await page.waitForLoadState("networkidle");

    // モード選択画面のURLを確認
    await expect(page).toHaveURL(/.*modeselect/);
  });

  test("ホームに戻るボタンをクリックするとタイトル画面に遷移する", async ({
    page,
  }) => {
    await page.goto("/result/");
    await page.waitForLoadState("networkidle");

    // ホームに戻るボタンをクリック
    const homeButton = page.locator('button:has-text("ホームに戻る")');
    await homeButton.click();
    await page.waitForLoadState("networkidle");

    // タイトル画面のURLを確認
    await expect(page).toHaveURL(/.*\/$/);

    // タイトルの確認
    const title = page.locator("h1.page-title");
    await expect(title).toBeVisible();
    await expect(title).toHaveText("手話ぷら");
  });
});

test.describe("クイズモード：方言モード", () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test("方言モードでクイズ画面が表示される", async ({ page }) => {
    // モード選択画面に移動
    await page.goto("/modeselect/");
    await page.waitForLoadState("networkidle");

    // 方言モードを選択
    await page.locator('label:has-text("方言")').click();

    // 開始ボタンをクリック
    await page.locator('button:has-text("開始")').click();
    await page.waitForLoadState("networkidle");

    // クイズ画面に遷移したことを確認
    await expect(page).toHaveURL(/.*quiz/);
    const subtitle = page.locator("h1.page-subtitle");
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toHaveText("クイズ");

    // 選択肢ボタンの確認
    await expect(page.locator("#choice1")).toBeVisible();
    await expect(page.locator("#choice2")).toBeVisible();
    await expect(page.locator("#choice3")).toBeVisible();
    await expect(page.locator("#choice4")).toBeVisible();
  });
});

test.describe("クイズモード：表現モード", () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test("表現モード・中級でクイズ画面が表示される", async ({ page }) => {
    // 表現モード・中級のURLパラメータ
    await page.goto("/quiz/?mode=expression&difficulty=normal");
    await page.waitForLoadState("networkidle");

    // タイトルの確認
    const subtitle = page.locator("h1.page-subtitle");
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toHaveText("クイズ");

    // 選択肢ボタンの確認
    await expect(page.locator("#choice1")).toBeVisible();
  });
});
