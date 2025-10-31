import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E テスト設定
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./e2e/tests",

  // テストタイムアウト
  timeout: 30000,

  // 並列実行の設定
  fullyParallel: true,

  // CI環境でのみfail-fastを有効化
  forbidOnly: !!process.env.CI,

  // リトライ設定（CI環境では2回、ローカルでは0回）
  retries: process.env.CI ? 2 : 0,

  // ワーカー数（CI環境では1、ローカルではCPUコアの半分）
  workers: process.env.CI ? 1 : undefined,

  // レポート設定
  reporter: [["html"], ["list"]],

  // 全テスト共通の設定
  use: {
    // ベースURL（開発サーバーのURL）
    baseURL: "http://localhost:5173",

    // スクリーンショットをテスト失敗時のみ撮影
    screenshot: "only-on-failure",

    // ビデオをテスト失敗時のみ録画
    video: "retain-on-failure",

    // トレースをテスト失敗時のみ記録
    trace: "on-first-retry",
  },

  // テスト対象のブラウザプロジェクト
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1280, height: 720 },
        actionTimeout: 15000,
        navigationTimeout: 30000,
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1280, height: 720 },
        actionTimeout: 15000,
        navigationTimeout: 30000,
      },
    },
  ],

  // 開発サーバーの自動起動設定
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
