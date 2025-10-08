import { CURRENT_QUIZ_MODE_LEVEL_KEY } from "../../../constants/localStorage.ts";

const params = new URLSearchParams(window.location.search);
const mode = params.get("mode");
const level = params.get("difficulty") || "none";

// 難易度パラメータをグローバルに保存（各モジュールから参照可能に）
window.quizDifficulty = level === "none" ? "dialect" : level;

const loadCss = (mode: string | null) => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  let cssFile = "";

  switch (mode) {
    case "reading":
      cssFile = "./styles/reading.css";
      break;
    case "expression":
      cssFile = "./styles/expression.css";
      break;
    case "dialect":
      cssFile = "./styles/reading.css"; // 方言モードは読み取りモードと同じCSS
      break;
    default:
      // デフォルトのCSS
      cssFile = "./styles/quiz.css";
      break;
  }
  link.href = cssFile;
  document.head.appendChild(link);
};

loadCss(mode);

if (mode === "reading") {
  import("./reading.ts");
} else if (mode === "dialect") {
  import("./dialect.ts");
} else {
  // modeが'expression'の場合、または指定されていない場合のデフォルトとしてexpression.tsを読み込む
  import("./expression.ts");
}

// localStorageに現在のクイズモードと何度を保存する
localStorage.setItem(
  CURRENT_QUIZ_MODE_LEVEL_KEY,
  `${mode}${level !== "none" ? `-${level}` : ""}`,
);
