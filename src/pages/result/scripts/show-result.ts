import { createShuwaDetailHTML } from "../../learn/scripts/shuwa-item";
import type { ShuwaData } from "../../../types";
import data from "../../../../data/shuwa.json";

const shuwaData: ShuwaData[] = data as ShuwaData[];

/**
 * クイズ結果のHTML要素を生成する
 */
function resultItems(): string {
  // TODO: クイズ機能実装後に、実際のクイズ結果をlocalStorageから取得するように修正する
  localStorage.setItem(
    "results",
    JSON.stringify(new Array(10).fill(false).map(() => Math.random() > 0.5)),
  );

  const results: boolean[] | null = JSON.parse(
    localStorage.getItem("results") || "[]",
  );
  if (!results) return "結果の情報がありません。";

  return `
  ${results
    .map((result: boolean, index: number) => {
      return `
      <div class="result-item">
        <h2>第${index + 1}問</h2>
        <p>${result ? "○" : "×"}</p>
        <button class="explanation-button" data-index="${index}">解説</button>
      </div>
    `;
    })
    .join("")}
  <button id="quiz-back" onclick="location.href='../title/'">戻る</button>`;
}

/**
 * 指定された問題の解説モーダルを表示する
 * @param index 解説を表示する問題のインデックス
 */
function showExplanation(index: number) {
  const shuwaModal = document.querySelector<HTMLDivElement>(".shuwa-modal");
  if (!shuwaModal) return;

  const detailHTML = createShuwaDetailHTML(shuwaData[index]);

  const contentWithCloseButton = `
    ${detailHTML}
    <button class="modal-close-button">×</button>
  `;

  shuwaModal.innerHTML = contentWithCloseButton;
  shuwaModal.classList.add("is-visible");

  const closeButton = shuwaModal.querySelector(".modal-close-button");
  closeButton?.addEventListener("click", () => {
    shuwaModal.classList.remove("is-visible");
    // モーダルを閉じる際に、内容を空にしてメモリリークや意図しない動作を防ぐ
    shuwaModal.innerHTML = "";
  });
}

/**
 * クイズ結果画面を初期化し、イベントリスナーを設定する
 */
function showResult() {
  const resultContainer = document.querySelector(".result-container");
  if (!resultContainer) return;

  resultContainer.innerHTML = resultItems();

  const explanationButtons = resultContainer.querySelectorAll(
    ".explanation-button",
  );
  explanationButtons.forEach((button) => {
    const buttonIndex = parseInt(button.getAttribute("data-index") || "0", 10);
    button.addEventListener("click", () => showExplanation(buttonIndex));
  });
}

showResult();
