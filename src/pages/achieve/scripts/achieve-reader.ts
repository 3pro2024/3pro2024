const dakutenTarget = document.querySelector<HTMLElement>(".reader-click");
const lastQuestion = document.querySelector<HTMLElement>(".reader-7");
const storageKey = "leaderChallengeUnlocked";

const unlockChallenge = () => {
  if (dakutenTarget) {
    dakutenTarget.textContent = "ダ";
  }
  if (lastQuestion) {
    lastQuestion.textContent = "や";
  }
};

if (dakutenTarget && lastQuestion) {
  // ページ読み込み時にlocalStorageを確認
  if (localStorage.getItem(storageKey) === "true") {
    unlockChallenge();
  }

  // クリックイベントの設定
  dakutenTarget.addEventListener("click", () => {
    unlockChallenge();
    localStorage.setItem(storageKey, "true");
  });
}
