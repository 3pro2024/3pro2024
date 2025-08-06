const dakutenTarget = document.querySelector<HTMLElement>(".reader-click");
const lastQuestion = document.querySelector<HTMLElement>(".reader-7");
const ACHIEVEMENT_STORAGE_KEY = "shuwa-achievements";

const unlockChallenge = () => {
  if (dakutenTarget) {
    dakutenTarget.textContent = "ダ";
  }
  if (lastQuestion) {
    lastQuestion.textContent = "や";
    lastQuestion.classList.add("completed");
  }
  
  // Save to unified achievement storage
  const achievements = JSON.parse(localStorage.getItem(ACHIEVEMENT_STORAGE_KEY) || "{}");
  achievements["reader-7"] = true;
  localStorage.setItem(ACHIEVEMENT_STORAGE_KEY, JSON.stringify(achievements));
};

// ページ読み込み時にlocalStorageを確認
const achievements = JSON.parse(localStorage.getItem(ACHIEVEMENT_STORAGE_KEY) || "{}");
if (achievements["reader-7"]) {
  unlockChallenge();
}

// クリックイベントの設定
if (dakutenTarget) {
  dakutenTarget.addEventListener("click", () => {
    unlockChallenge();
  });
}
