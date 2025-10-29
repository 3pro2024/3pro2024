import { CURRENT_QUIZ_MODE_LEVEL_KEY } from "../../../constants/localStorage.ts";

const params = new URLSearchParams(window.location.search);
const mode = params.get("mode");
const level = params.get("difficulty") || "none";

// 難易度パラメータをグローバルに保存（各モジュールから参照可能に）
window.quizDifficulty = level === "none" ? "dialect" : level;

// モード別にCSSとJSを動的にインポート（Viteが自動的にコード分割を行う）
if (mode === "reading") {
  import("../styles/reading.css");
  import("./reading.ts");
} else if (mode === "dialect") {
  import("../styles/reading.css"); // 方言モードは読み取りモードと同じCSS
  import("./dialect.ts");
} else {
  // modeが'expression'の場合、または指定されていない場合のデフォルトとしてexpression.tsを読み込む
  import("../styles/expression.css");
  import("./expression.ts");
}

// localStorageに現在のクイズモードと難度を保存する
localStorage.setItem(
  CURRENT_QUIZ_MODE_LEVEL_KEY,
  `${mode}${level !== "none" ? `-${level}` : ""}`,
);
