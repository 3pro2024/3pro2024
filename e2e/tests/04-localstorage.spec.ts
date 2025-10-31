import { test, expect } from "@playwright/test";
import {
  clearStorage,
  getStorageItem,
  setStorageItem,
  getAllStorage,
} from "../helpers/storage";
import { gotoTitle, gotoLearn } from "../helpers/navigation";

test.describe("LocalStorage データ永続化", () => {
  test.beforeEach(async ({ page }) => {
    await gotoTitle(page);
    await clearStorage(page);
  });

  test("LocalStorageのクリアが正常に動作する", async ({ page }) => {
    await gotoTitle(page);

    // データを保存
    await setStorageItem(page, "test_key", "test_value");

    // データが保存されていることを確認
    let value = await getStorageItem(page, "test_key");
    expect(value).toBe("test_value");

    // クリア
    await clearStorage(page);

    // データがクリアされていることを確認
    value = await getStorageItem(page, "test_key");
    expect(value).toBeNull();
  });

  test("LocalStorageへの読み書きが正常に動作する", async ({ page }) => {
    await gotoTitle(page);

    // 文字列データの保存
    await setStorageItem(page, "string_data", "Hello World");
    let value = await getStorageItem(page, "string_data");
    expect(value).toBe("Hello World");

    // JSONデータの保存
    const jsonData = { name: "test", count: 5 };
    await setStorageItem(page, "json_data", JSON.stringify(jsonData));
    value = await getStorageItem(page, "json_data");
    expect(value).toBe(JSON.stringify(jsonData));

    // 保存したJSONデータをパース
    const parsedData = JSON.parse(value!);
    expect(parsedData.name).toBe("test");
    expect(parsedData.count).toBe(5);
  });

  test("学習履歴がLocalStorageに保存される", async ({ page }) => {
    await gotoLearn(page);
    await page.waitForTimeout(1000);

    // LocalStorageをクリア
    await clearStorage(page);

    // 最初の手話アイテムをクリック
    const firstItemLink = page.locator(".shuwa-item a").first();
    await firstItemLink.click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // 学習リストが保存されていることを確認
    const learnedList = await getStorageItem(page, "learned-shuwa-list");
    expect(learnedList).not.toBeNull();
    expect(learnedList?.length).toBeGreaterThan(0);

    // 学習数が保存されていることを確認
    const learnedCount = await getStorageItem(page, "learned-shuwa-count");
    expect(learnedCount).not.toBeNull();
    expect(Number(learnedCount)).toBeGreaterThan(0);
  });

  test("複数の手話を学習すると履歴が蓄積される", async ({ page }) => {
    await gotoLearn(page);
    await page.waitForTimeout(1000);

    // LocalStorageをクリア
    await clearStorage(page);

    // 最初の手話を学習
    let itemLink = page.locator(".shuwa-item a").first();
    await itemLink.click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // 学習数を確認
    let learnedCount = await getStorageItem(page, "learned-shuwa-count");
    expect(Number(learnedCount)).toBe(1);

    // 戻る
    await page.goBack();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // 2番目の手話を学習
    itemLink = page.locator(".shuwa-item a").nth(1);
    await itemLink.click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // 学習数が増えていることを確認
    learnedCount = await getStorageItem(page, "learned-shuwa-count");
    expect(Number(learnedCount)).toBe(2);

    // 学習リストに2つのIDが含まれていることを確認
    const learnedList = await getStorageItem(page, "learned-shuwa-list");
    const idList = learnedList?.split(",") || [];
    expect(idList.length).toBe(2);
  });

  test("同じ手話を複数回学習しても重複しない", async ({ page }) => {
    await gotoLearn(page);
    await page.waitForSelector(".shuwa-item a");

    // LocalStorageをクリア
    await clearStorage(page);

    // 最初の手話を学習
    await page.locator(".shuwa-item a").first().click();
    await page.waitForLoadState("networkidle");

    // 学習数が1になるまでポーリングで確認
    await expect
      .poll(async () => {
        const count = await getStorageItem(page, "learned-shuwa-count");
        return Number(count);
      })
      .toBe(1);

    // 戻る
    await page.goBack();
    await page.waitForSelector(".shuwa-item a");

    // 同じ手話を再度学習
    await page.locator(".shuwa-item a").first().click();
    await page.waitForLoadState("networkidle");

    // 少し待ってから、学習数が変わらないことを確認
    await page.waitForTimeout(500);
    const learnedCount = await getStorageItem(page, "learned-shuwa-count");
    expect(Number(learnedCount)).toBe(1);
  });

  test("LocalStorageデータがページ遷移後も保持される", async ({ page }) => {
    await gotoTitle(page);

    // テストデータを保存
    await setStorageItem(page, "persist_test", "persistent_value");

    // 別のページに遷移
    await page.goto("/learn/");
    await page.waitForLoadState("networkidle");

    // データが保持されていることを確認
    let value = await getStorageItem(page, "persist_test");
    expect(value).toBe("persistent_value");

    // さらに別のページに遷移
    await page.goto("/explain/");
    await page.waitForLoadState("networkidle");

    // データがまだ保持されていることを確認
    value = await getStorageItem(page, "persist_test");
    expect(value).toBe("persistent_value");
  });

  test("getAllStorageで全データを取得できる", async ({ page }) => {
    await gotoTitle(page);
    await clearStorage(page);

    // 複数のデータを保存
    await setStorageItem(page, "key1", "value1");
    await setStorageItem(page, "key2", "value2");
    await setStorageItem(page, "key3", "value3");

    // 全データを取得
    const allStorage = await getAllStorage(page);

    // 保存したデータが全て含まれていることを確認
    expect(allStorage["key1"]).toBe("value1");
    expect(allStorage["key2"]).toBe("value2");
    expect(allStorage["key3"]).toBe("value3");

    // データ数の確認
    const keys = Object.keys(allStorage);
    expect(keys.length).toBe(3);
  });

  test("空のLocalStorageに対する操作が正常に動作する", async ({ page }) => {
    await gotoTitle(page);
    await clearStorage(page);

    // 空の状態で取得
    const emptyValue = await getStorageItem(page, "non_existent_key");
    expect(emptyValue).toBeNull();

    // 空の状態で全取得
    const emptyStorage = await getAllStorage(page);
    expect(Object.keys(emptyStorage).length).toBe(0);
  });

  test("大きなデータをLocalStorageに保存できる", async ({ page }) => {
    await gotoTitle(page);
    await clearStorage(page);

    // 大きなJSONデータを作成
    const largeData = {
      items: Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `item_${i}`,
        description: `This is item number ${i}`,
      })),
    };

    // データを保存
    await setStorageItem(page, "large_data", JSON.stringify(largeData));

    // データを取得して確認
    const retrieved = await getStorageItem(page, "large_data");
    expect(retrieved).not.toBeNull();

    const parsedData = JSON.parse(retrieved!);
    expect(parsedData.items.length).toBe(100);
    expect(parsedData.items[0].id).toBe(0);
    expect(parsedData.items[99].id).toBe(99);
  });
});

test.describe("LocalStorage: 実績バッジ保存", () => {
  test.beforeEach(async ({ page }) => {
    await gotoTitle(page);
    await clearStorage(page);
  });

  test("実績データをLocalStorageに保存できる", async ({ page }) => {
    await gotoTitle(page);

    // 実績データを保存（配列形式）
    const achievements = ["achievement_1", "achievement_2", "achievement_3"];
    await setStorageItem(page, "achievements", JSON.stringify(achievements));

    // 保存したデータを確認
    const retrieved = await getStorageItem(page, "achievements");
    expect(retrieved).not.toBeNull();

    const parsedAchievements = JSON.parse(retrieved!);
    expect(parsedAchievements.length).toBe(3);
    expect(parsedAchievements).toContain("achievement_1");
    expect(parsedAchievements).toContain("achievement_2");
    expect(parsedAchievements).toContain("achievement_3");
  });

  test("実績データが異なるページ間で共有される", async ({ page }) => {
    await gotoTitle(page);

    // 実績データを保存
    const achievements = ["first_quiz_complete", "learn_10_words"];
    await setStorageItem(page, "achievements", JSON.stringify(achievements));

    // 学習モードに遷移
    await page.goto("/learn/");
    await page.waitForLoadState("networkidle");

    // データが保持されていることを確認
    const retrieved = await getStorageItem(page, "achievements");
    const parsedAchievements = JSON.parse(retrieved!);
    expect(parsedAchievements.length).toBe(2);

    // 実績画面に遷移
    await page.goto("/achieve/");
    await page.waitForLoadState("networkidle");

    // データがまだ保持されていることを確認
    const stillRetrieved = await getStorageItem(page, "achievements");
    const stillParsed = JSON.parse(stillRetrieved!);
    expect(stillParsed.length).toBe(2);
  });
});
