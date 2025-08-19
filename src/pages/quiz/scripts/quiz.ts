import { startQuiz, type QuizData } from "./reading.js";
import { type ShuwaData } from "../../../types/index.js";
import data from "../../../../data/shuwa.json";
import VideoPlayer from "../../../components/video/video-player.js";
// shuwa.jsonのデータ構造を仮定（実際の構造に合わせて変更してください）
// interface ShuwaData {
//   id: number;
//   name: string;
//   youtube_url: string;
// }

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
const correctAnswerVideo = document.getElementById(
  "correct-answer-video",
) as HTMLVideoElement;
const yourAnswerVideo = document.getElementById(
  "your-answer-video",
) as HTMLVideoElement;
const nextButton = document.getElementById("next-button") as HTMLButtonElement;

// --- クイズの状態管理 ---
let currentQuestionIndex = 0; //現在何問目かを記録
let quizData: QuizData | null = null; //問題と選択肢を保存
let allShuwaData: ShuwaData[] = []; //手話の全データ保存
const results: boolean[] = []; // クイズの正負を保存（正ならtrue、負ならfalse）

// --- メイン処理 ---
document.addEventListener("DOMContentLoaded", async () => {
  // shuwa.json全体を最初に読み込んでおく
  allShuwaData = data as ShuwaData[];
  quizData = await startQuiz("some-mode"); // 'some-mode'は適切なモード名に
  if (quizData) {
    displayQuestion();
  }
});

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
  const questionVideoUrl = findDataById(questionId)?.youtube_url;

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

  const correctVideoUrl = findDataById(correctId)?.youtube_url;
  const selectedVideoUrl = findDataById(selectedId)?.youtube_url;

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
  return allShuwaData.find((item) => item.id === id);
}

// 最終結果の表示（例）
function showFinalResult() {
  const correctCount = results.filter((r) => r).length;
  alert(`クイズ終了！ ${results.length}問中 ${correctCount}問正解でした！`);
  console.log("クイズ終了");
  // タイトル画面などに戻る処理
  //
  window.location.href = "/result/";
}

// 終了ボタン
retireButton.addEventListener("click", () => {
  if (confirm("クイズを中断してタイトルに戻りますか？")) {
    window.location.href = "../title/"; // タイトル画面のパス
  }
});
