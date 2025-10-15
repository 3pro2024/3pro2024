import { LEARNED_SHUWA_LIST_KEY } from "../../../constants/localStorage";

// 指文字表確認時に実績を解除
function unlockFingerspellingAchievement(): void {
  try {
    const learnedList = JSON.parse(
      localStorage.getItem(LEARNED_SHUWA_LIST_KEY) || "[]",
    ) as number[];

    // 9999が含まれていなければ追加
    if (!learnedList.includes(9999)) {
      learnedList.push(9999);
      localStorage.setItem(LEARNED_SHUWA_LIST_KEY, JSON.stringify(learnedList));
    }
  } catch (error) {
    console.error("Failed to unlock fingerspelling achievement:", error);
  }
}

// ページ読み込み時の初期化
document.addEventListener("DOMContentLoaded", () => {
  // 指文字表リンクにイベントリスナーを追加
  const fingerspellingLink = document.querySelector('a[href="#yubimoji"]');
  if (fingerspellingLink) {
    fingerspellingLink.addEventListener("click", () => {
      // クリック時に実績を解除
      unlockFingerspellingAchievement();
    });
  }

  // 指文字表テーブルの表示監視（Intersection Observer使用）
  const fingerspellingTable = document.getElementById("hand_tab");
  if (fingerspellingTable) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            // 指文字表が画面に表示されたら実績を解除
            unlockFingerspellingAchievement();
          }
        });
      },
      { threshold: 0.1 }, // 10%以上表示されたらトリガー
    );

    observer.observe(fingerspellingTable);
  }
});
