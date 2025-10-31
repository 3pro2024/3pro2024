import { getVideoUrl, startQuiz, type QuizData } from "./quiz.js";
import { type ShuwaData } from "../../../types/index.js";
import data from "../../../../data/json.json";
import VideoPlayer from "../../../components/video/video-player.js";

// --- DOM要素の取得 ---
const videoContainer = document.getElementById(
  "video-container",
) as HTMLDivElement;
const choiceButtons = [
  document.getElementById("choice1") as HTMLInputElement,
  document.getElementById("choice2") as HTMLInputElement,
  document.getElementById("choice3") as HTMLInputElement,
  document.getElementById("choice4") as HTMLInputElement,
];
const retireButton = document.getElementById(
  "retireButton",
) as HTMLInputElement;

// --- モーダル関連のDOM要素 (HTMLに追加する必要があり) ---
const modal = document.getElementById("result-modal") as HTMLDivElement;
const modalMessage = document.getElementById(
  "modal-message",
) as HTMLParagraphElement;
const nextButton = document.getElementById("next-button") as HTMLButtonElement;

// --- クイズの状態管理 ---
let currentQuestionIndex = 0; //現在何問目かを記録
let quizData: QuizData | null = null; //問題と選択肢を保存
let allShuwaData: ShuwaData[] = []; //手話の全データ保存
const results: boolean[] = []; // クイズの正負を保存（正ならtrue、負ならfalse）
const quizIds: string[] = [];
const difficulty = "dialect"; // 方言モードは常に "dialect"

// --- メイン処理 ---
// shuwa.json全体を最初に読み込んでおく
allShuwaData = data as ShuwaData[];
(async () => {
  // 方言モードは常に "dialect" を渡す
  quizData = await startQuiz("dialect", difficulty);
  if (quizData) {
    displayQuestion();
  } else {
    // データが見つからない場合の処理
    alert("方言の問題が見つかりませんでした。");
    window.location.href = "../modeselect/";
  }
})();

// --- 関数定義 ---

// 問題と選択肢を画面に表示する関数
function displayQuestion() {
  if (!quizData || currentQuestionIndex >= quizData.quizWords.length) {
    // 全問終了
    showFinalResult();
    return;
  }

  const questionId = quizData.quizWords[currentQuestionIndex];
  const choices = quizData.choices[currentQuestionIndex];
  const questionData = findDataById(questionId);
  const questionVideoUrl = questionData ? getVideoUrl(questionData, difficulty) : undefined;

  // 問題動画を表示
  if (questionVideoUrl) {
    videoContainer.innerHTML = VideoPlayer(questionVideoUrl);
  }

  // 選択肢ボタンに単語とIDを割り当て
  choiceButtons.forEach((button, index) => {
    const choiceId = choices[index];
    const choiceWord = findDataById(choiceId)?.name;
    button.value = choiceWord || "エラー";
    // data属性にIDを保存しておくのが便利
    button.dataset.choiceId = choiceId.toString();
  });
}

// 選択肢ボタンのクリックイベント
choiceButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const target = event.target as HTMLInputElement;
    const selectedId = parseInt(target.dataset.choiceId || "0", 10);
    checkAnswer(selectedId);
  });
});

// 答え合わせをする関数
function checkAnswer(selectedId: number) {
  if (!quizData) return;

  const correctId = quizData.quizWords[currentQuestionIndex];
  const isCorrect = selectedId === correctId;

  // 結果を保存
  results.push(isCorrect);
  localStorage.setItem("quizResults", JSON.stringify(results));
  //ローカルストレージにクイズの正負を保存

  // 問題idを保存
  quizIds.push(correctId.toString());
  localStorage.setItem("quizIds", JSON.stringify(quizIds));
  // モーダルで結果表示
  showResultModal(isCorrect, correctId, selectedId);
}

// 結果表示モーダルを表示
function showResultModal(
  isCorrect: boolean,
  correctId: number,
  selectedId: number,
) {
  modalMessage.textContent = isCorrect ? "正解！" : "不正解...";

  const correctData = findDataById(correctId);
  const selectedData = findDataById(selectedId);
  const correctVideoUrl = correctData ? getVideoUrl(correctData, difficulty) : undefined;
  const selectedVideoUrl = selectedData ? getVideoUrl(selectedData, difficulty) : undefined;

  if (!correctVideoUrl || !selectedVideoUrl) return;

  const correctAnswerVideo = document.getElementById(
    "correct-answer-video",
  ) as HTMLDivElement;
  const yourAnswerVideo = document.getElementById(
    "your-answer-video",
  ) as HTMLDivElement;

  correctAnswerVideo.innerHTML = VideoPlayer(correctVideoUrl);
  yourAnswerVideo.innerHTML = VideoPlayer(selectedVideoUrl);

  modal.style.display = "flex";
}

// 「次へ」ボタンのクリックイベント
nextButton.addEventListener("click", () => {
  modal.style.display = "none";
  currentQuestionIndex++;
  displayQuestion();
});

// IDから手話データを検索するヘルパー関数
function findDataById(id: number): ShuwaData | undefined {
  // Try to find by ID first
  const found = allShuwaData.find((item) => item.id === id);
  if (found) return found;
  // Fallback: if id-1 is a valid index, return that item
  if (id > 0 && id <= allShuwaData.length) {
    return allShuwaData[id - 1];
  }
  return undefined;
}

// 最終結果の表示（例）
function showFinalResult() {
  console.log("クイズ終了");
  // タイトル画面などに戻る処理
  //
  window.location.href = "../result/";
}

// 終了ボタン
retireButton.addEventListener("click", () => {
  if (confirm("クイズを中断してタイトルに戻りますか？")) {
    window.location.href = "../"; // タイトル画面のパス
  }
});
