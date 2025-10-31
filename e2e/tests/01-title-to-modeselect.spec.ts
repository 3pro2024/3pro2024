import { test, expect } from "@playwright/test";
import {
  gotoTitle,
  gotoModeSelect,
  clickAndNavigate,
} from "../helpers/navigation";
import { clearStorage } from "../helpers/storage";

test.describe("タイトル画面からモード選択画面への遷移", () => {
  test.beforeEach(async ({ page }) => {
    // テストごとにLocalStorageをクリア
    await gotoTitle(page);
    await clearStorage(page);
  });

  test("タイトル画面が正しく表示される", async ({ page }) => {
    await gotoTitle(page);

    // タイトルの確認
    const title = page.locator("h1.page-title");
    await expect(title).toBeVisible();
    await expect(title).toHaveText("手話ぷら");

    // ボタンの存在確認
    await expect(page.locator("#toQuiz")).toBeVisible();
    await expect(page.locator("#toLearn")).toBeVisible();
    await expect(page.locator("#toExplain")).toBeVisible();
    await expect(page.locator("#achieve")).toBeVisible();
  });

  test("クイズボタンをクリックするとモード選択画面に遷移する", async ({
    page,
  }) => {
    await gotoTitle(page);

    // クイズボタンをクリック
    await clickAndNavigate(page, "#toQuiz");

    // モード選択画面のURLを確認
    await expect(page).toHaveURL(/.*modeselect/);

    // モード選択画面のタイトルを確認
    const subtitle = page.locator("h1.page-subtitle");
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toHaveText("クイズモード選択");
  });

  test("学習ボタンをクリックすると学習画面に遷移する", async ({ page }) => {
    await gotoTitle(page);

    // 学習ボタンをクリック
    await clickAndNavigate(page, "#toLearn");

    // 学習画面のURLを確認
    await expect(page).toHaveURL(/.*learn/);
  });

  test("説明ボタンをクリックすると説明画面に遷移する", async ({ page }) => {
    await gotoTitle(page);

    // 説明ボタンをクリック
    await clickAndNavigate(page, "#toExplain");

    // 説明画面のURLを確認
    await expect(page).toHaveURL(/.*explain/);
  });

  test("実績ボタンをクリックすると実績画面に遷移する", async ({ page }) => {
    await gotoTitle(page);

    // 実績ボタンをクリック
    await clickAndNavigate(page, "#achieve");

    // 実績画面のURLを確認
    await expect(page).toHaveURL(/.*achieve/);
  });
});

test.describe("モード選択画面の基本動作", () => {
  test.beforeEach(async ({ page }) => {
    await gotoModeSelect(page);
    await clearStorage(page);
  });

  test("モード選択画面が正しく表示される", async ({ page }) => {
    // タイトルの確認
    const subtitle = page.locator("h1.page-subtitle");
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toHaveText("クイズモード選択");

    // モード選択のラジオボタンの確認
    await expect(page.locator("#Reading")).toBeVisible();
    await expect(page.locator("#Expression")).toBeVisible();
    await expect(page.locator("#Dialect")).toBeVisible();

    // 難易度選択のラジオボタンの確認
    await expect(page.locator("#Easy")).toBeVisible();
    await expect(page.locator("#Normal")).toBeVisible();
    await expect(page.locator("#Hard")).toBeVisible();

    // 開始ボタンと戻るボタンの確認
    await expect(page.locator("#quiz-start")).toBeVisible();
    await expect(page.locator("#quiz-back")).toBeVisible();

    // 初期状態では開始ボタンが無効
    await expect(page.locator("#quiz-start")).toBeDisabled();
  });

  test("読み取りモードと初級を選択すると開始ボタンが有効になる", async ({
    page,
  }) => {
    // モード選択
    await page.locator("#Reading").check();

    // まだ開始ボタンは無効
    await expect(page.locator("#quiz-start")).toBeDisabled();

    // 難易度選択
    await page.locator("#Easy").check();

    // 開始ボタンが有効になる
    await expect(page.locator("#quiz-start")).toBeEnabled();
  });

  test("方言モードを選択すると難易度選択なしで開始ボタンが有効になる", async ({
    page,
  }) => {
    // 方言モード選択
    await page.locator("#Dialect").check();

    // 開始ボタンが有効になる
    await expect(page.locator("#quiz-start")).toBeEnabled();

    // 難易度選択が無効化される
    await expect(page.locator("#Easy")).toBeDisabled();
    await expect(page.locator("#Normal")).toBeDisabled();
    await expect(page.locator("#Hard")).toBeDisabled();
  });

  test("上級を選択すると読み取りモードが強制される", async ({ page }) => {
    // 表現モードを選択
    await page.locator("#Expression").check();

    // 上級を選択
    await page.locator("#Hard").check();

    // 読み取りモードが自動選択される
    await expect(page.locator("#Reading")).toBeChecked();

    // 表現モードと方言モードが無効化される
    await expect(page.locator("#Expression")).toBeDisabled();
    await expect(page.locator("#Dialect")).toBeDisabled();
  });

  test("戻るボタンをクリックするとタイトル画面に戻る", async ({ page }) => {
    // 戻るボタンをクリック
    await clickAndNavigate(page, "#quiz-back");

    // タイトル画面のURLを確認
    await expect(page).toHaveURL(/.*\/$/);

    // タイトルの確認
    const title = page.locator("h1.page-title");
    await expect(title).toBeVisible();
    await expect(title).toHaveText("手話ぷら");
  });

  test("モードと難易度を選択して開始ボタンをクリックするとクイズ画面に遷移する", async ({
    page,
  }) => {
    // 読み取りモード選択
    await page.locator("#Reading").check();

    // 中級選択
    await page.locator("#Normal").check();

    // 開始ボタンが有効になるのを待つ
    await expect(page.locator("#quiz-start")).toBeEnabled();

    // 開始ボタンをクリック
    await page.locator("#quiz-start").click();

    // クイズ画面のURLを確認（パラメータ付き）。expectがナビゲーションを待機する
    await expect(page).toHaveURL(/.*quiz.*mode=reading.*difficulty=normal/);
  });
});
