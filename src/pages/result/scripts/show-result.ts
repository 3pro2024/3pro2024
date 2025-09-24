import { createShuwaDetailHTML } from "../../../components/shuwa-detail/shuwa-detail";
import type { ShuwaData } from "../../../types";
import data from "../../../../data/shuwa.json";
import { CURRENT_QUIZ_MODE_LEVEL_KEY } from "../../../constants/localStorage";

const shuwaData: ShuwaData[] = data as ShuwaData[];

/**
 * LocalStorageから取得したレベル文字列をアチーブメント定義に合わせた形式に変換する
 * @param level LocalStorageから取得したレベル（例: "easy", "normal", "hard"）
 * @returns 変換後のレベル文字列（例: "Easy", "Normal", "Hard"）
 */
function formatLevelForAchievement(
  level: string | null,
): "Easy" | "Normal" | "Hard" | "" {
  if (!level) return "";
  const lowerLevel = level.toLowerCase();
  if (lowerLevel === "easy" || lowerLevel === "beginner") return "Easy";
  if (lowerLevel === "normal" || lowerLevel === "intermediate") return "Normal";
  if (lowerLevel === "hard" || lowerLevel === "advanced") return "Hard";
  return ""; // 方言(dialect)モードなどはlevelがない
}

/**
 * クイズ結果のHTML要素を生成し、実績データを更新する
 */
function resultItems(): string {
  const results: boolean[] | null = JSON.parse(
    localStorage.getItem("quizResults") || "[]",
  );
  const quizIds: string[] | null = JSON.parse(
    localStorage.getItem("quizIds") || "[]",
  );
  if (!results || !quizIds) return "結果の情報がありません。";

  // クイズのモードとレベルを取得
  const modeLevel = localStorage.getItem(CURRENT_QUIZ_MODE_LEVEL_KEY);

  const [mode, level] = modeLevel?.split("-") || [];

  // resultsとquizIdを1つのオブジェクトにする
  const quizData = results.map((result, index) => ({
    id: quizIds[index],
    result,
  }));

  // 今回のクイズでの正解数を計算
  const correctAnswersInThisQuiz = quizData.filter((q) => q.result).length;

  // モードが取得できた場合のみ実績関連のカウンターを更新
  if (mode) {
    const keyBase = `quiz-${mode}${level ? `-${level}` : ""}`;

    // --- 正解数の更新 ---
    const correctAnswersKey = `${keyBase}-count`;
    const totalCorrectAnswers = parseInt(
      localStorage.getItem(correctAnswersKey) || "0",
      10,
    );
    localStorage.setItem(
      correctAnswersKey,
      String(totalCorrectAnswers + correctAnswersInThisQuiz),
    );

    // --- 満点記録の更新 ---
    const isPerfect = correctAnswersInThisQuiz === quizData.length;
    if (isPerfect) {
      const perfectCountKey = `${keyBase}-perfect_count`;
      const totalPerfectCount = parseInt(
        localStorage.getItem(perfectCountKey) || "0",
        10,
      );
      localStorage.setItem(perfectCountKey, String(totalPerfectCount + 1));
    }
  }

  console.log(quizData);

  return `
  ${quizData
    .map((quiz, index: number) => {
      const resultClass = quiz.result ? "result-correct" : "result-incorrect";
      return `
      <div class="result-item">
        <h2>第${index + 1}問</h2>
        <p class="${resultClass}">${quiz.result ? "○" : "×"}</p>
        <button class="explanation-button" data-index="${quiz.id}">解説</button>
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

  const detailHTML = createShuwaDetailHTML(shuwaData[index - 1]);

  // 閉じるボタンを.shuwa-detail内に配置
  const modifiedDetailHTML = detailHTML.replace(
    '<div class="shuwa-detail">',
    '<div class="shuwa-detail"><button class="modal-close-button">×</button>',
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
