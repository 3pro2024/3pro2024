import { test, expect } from '@playwright/test';
import { gotoLearn } from '../helpers/navigation';
import { clearStorage } from '../helpers/storage';

test.describe('学習モード基本表示', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test('学習モード画面が正しく表示される（ランク指定なし）', async ({ page }) => {
    await gotoLearn(page);

    // 手話リストコンテナの確認
    await expect(page.locator('.shuwa-items')).toBeVisible();

    // 動的コンテンツの読み込みを待機
    await page.waitForTimeout(1000);

    // 検索フォームの存在確認
    const searchForm = page.locator('.shuwa-search-form');
    await expect(searchForm).toBeVisible();

    // 手話リストグリッドの確認
    const grid = page.locator('.shuwa-items-grid');
    await expect(grid).toBeVisible();

    // 手話アイテムが表示されることを確認
    const items = page.locator('.shuwa-item');
    const itemCount = await items.count();
    expect(itemCount).toBeGreaterThan(0);
  });

  test('ランク指定で学習モード画面が表示される（5級）', async ({ page }) => {
    await page.goto('/learn/?rank=5級');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // 手話リストグリッドの確認
    const grid = page.locator('.shuwa-items-grid');
    await expect(grid).toBeVisible();

    // 手話アイテムが表示されることを確認
    const items = page.locator('.shuwa-item');
    const itemCount = await items.count();
    expect(itemCount).toBeGreaterThan(0);
  });

  test('手話アイテムカードが正しく表示される', async ({ page }) => {
    await gotoLearn(page);
    await page.waitForTimeout(1000);

    // 最初の手話アイテムを取得
    const firstItem = page.locator('.shuwa-item').first();
    await expect(firstItem).toBeVisible();

    // 手話名が表示されることを確認
    const itemName = firstItem.locator('.shuwa-item-name');
    await expect(itemName).toBeVisible();

    // 手話名のテキストが空でないことを確認
    const nameText = await itemName.textContent();
    expect(nameText).not.toBe('');
    expect(nameText?.length).toBeGreaterThan(0);

    // リンクが存在することを確認
    const link = firstItem.locator('a');
    await expect(link).toBeVisible();
  });

  test('手話アイテムをクリックすると詳細画面に遷移する', async ({ page }) => {
    await gotoLearn(page);
    await page.waitForTimeout(1000);

    // 最初の手話アイテムのリンクを取得
    const firstItemLink = page.locator('.shuwa-item a').first();
    const href = await firstItemLink.getAttribute('href');
    expect(href).toContain('?id=');

    // リンクをクリック
    await firstItemLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // URLにidパラメータが含まれることを確認
    await expect(page).toHaveURL(/.*\?id=\d+/);

    // 詳細表示用のボタン（タイトルへ戻る）が表示されることを確認
    const backButton = page.locator('button:has-text("タイトルへ戻る")');
    await expect(backButton).toBeVisible({ timeout: 5000 });
  });

  test('手話詳細画面でLocalStorageに学習履歴が保存される', async ({ page }) => {
    await gotoLearn(page);
    await page.waitForTimeout(1000);

    // LocalStorageをクリア
    await clearStorage(page);

    // 最初の手話アイテムをクリック
    const firstItemLink = page.locator('.shuwa-item a').first();
    await firstItemLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // LocalStorageに学習履歴が保存されることを確認
    const learnedList = await page.evaluate(() => {
      return localStorage.getItem('learned_shuwa_list');
    });

    expect(learnedList).not.toBeNull();
    expect(learnedList?.length).toBeGreaterThan(0);

    // 学習数カウントも保存されることを確認
    const learnedCount = await page.evaluate(() => {
      return localStorage.getItem('learned_shuwa_count');
    });

    expect(learnedCount).not.toBeNull();
    expect(Number(learnedCount)).toBeGreaterThan(0);
  });

  test('検索フォームが表示され、フィールドが存在する', async ({ page }) => {
    await gotoLearn(page);
    await page.waitForTimeout(1000);

    // 検索フォームの確認
    const searchForm = page.locator('.shuwa-search-form');
    await expect(searchForm).toBeVisible();

    // 検索入力フィールドの確認
    const searchInput = searchForm.locator('input');
    await expect(searchInput).toBeVisible();

    // ランク選択の確認
    const rankSelect = searchForm.locator('.shuwa-rank');
    await expect(rankSelect).toBeVisible();

    // レベル選択の確認
    const levelSelect = searchForm.locator('.shuwa-quiz-level-select');
    await expect(levelSelect).toBeVisible();
  });

  test('複数のランクで学習モードが動作する', async ({ page }) => {
    const ranks = ['5級', '4級', '3級', '2級'];

    for (const rank of ranks) {
      await page.goto(`/learn/?rank=${rank}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // 手話リストグリッドの確認
      const grid = page.locator('.shuwa-items-grid');
      await expect(grid).toBeVisible();

      // 手話アイテムが表示されることを確認
      const items = page.locator('.shuwa-item');
      const itemCount = await items.count();
      expect(itemCount).toBeGreaterThan(0);
    }
  });

  test('レベル指定で学習モード画面が表示される', async ({ page }) => {
    const levels = ['初級', '中級', '上級', '方言'];

    for (const level of levels) {
      await page.goto(`/learn/?level=${level}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // 手話リストグリッドの確認
      const grid = page.locator('.shuwa-items-grid');
      await expect(grid).toBeVisible();

      // 手話アイテムが表示されることを確認
      const items = page.locator('.shuwa-item');
      const itemCount = await items.count();
      expect(itemCount).toBeGreaterThan(0);
    }
  });
});

test.describe('学習モード：詳細表示', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test('特定の手話IDで詳細画面が表示される', async ({ page }) => {
    // ID=1の手話詳細を表示
    await page.goto('/learn/?id=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // 戻るボタンが表示されることを確認
    const backButton = page.locator('button:has-text("タイトルへ戻る")');
    await expect(backButton).toBeVisible({ timeout: 5000 });
  });

  test('タイトルへ戻るボタンをクリックすると前のページに戻る', async ({ page }) => {
    // まず学習モード一覧を表示
    await gotoLearn(page);
    await page.waitForTimeout(1000);

    // 最初の手話アイテムをクリック
    const firstItemLink = page.locator('.shuwa-item a').first();
    await firstItemLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // 戻るボタンをクリック
    const backButton = page.locator('button:has-text("タイトルへ戻る")');
    await backButton.click();
    await page.waitForLoadState('networkidle');

    // 学習モード一覧に戻ることを確認（idパラメータがない）
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('?id=');
  });
});
