import { createShuwaDetailHTML } from "../../../components/shuwa-detail/shuwa-detail";
import type { ShuwaData } from "../../../types";
import data from "../../../../data/shuwa.json";

const shuwaData: ShuwaData[] = data as ShuwaData[];

/**
 * クイズ結果のHTML要素を生成する
 */
function resultItems(): string {
  const results: boolean[] | null = JSON.parse(
    localStorage.getItem("quizResults") || "[]",
  );
  if (!results) return "結果の情報がありません。";

  return `
  ${results
    .map((result: boolean, index: number) => {
      const resultClass = result ? "result-correct" : "result-incorrect";
      return `
      <div class="result-item">
        <h2>第${index + 1}問</h2>
        <p class="${resultClass}">${result ? "○" : "×"}</p>
        <button class="explanation-button" data-index="${index}">解説</button>
      </div>
    `;
    })
    .join("")}
  `;
}

/**
 * 指定された問題の解説モーダルを表示する
 * @param index 解説を表示する問題のインデックス
 */
function showExplanation(index: number) {
  const shuwaModal = document.querySelector<HTMLDivElement>(".shuwa-modal");
  if (!shuwaModal) return;

  const detailHTML = createShuwaDetailHTML(shuwaData[index]);

  // 閉じるボタンを.shuwa-detail内に配置
  const modifiedDetailHTML = detailHTML.replace(
    '<div class="shuwa-detail">',
    '<div class="shuwa-detail"><button class="modal-close-button">×</button>'
  );

  shuwaModal.innerHTML = modifiedDetailHTML;
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
