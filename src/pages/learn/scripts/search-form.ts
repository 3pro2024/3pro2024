import "../styles/shuwa-item.css";
import "../styles/search-form.css";

/**
 * URLパラメータを取得
 */
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    rank: params.get("rank") || "",
    level: params.get("level") || "",
  };
}

/**
 * セレクト要素のオプションを生成（選択状態を反映）
 */
function createOption(
  value: string,
  text: string,
  selectedValue: string,
): string {
  const selected = value === selectedValue ? "selected" : "";
  return `<option value="${value}" ${selected}>${text}</option>`;
}

export function createSearchForm(includeBackButton: boolean = false) {
  const urlParams = getUrlParams();

  return `
    <div class="search-form-wrapper">
      <form class="shuwa-search-form">
        <input type="text" placeholder="検索ワードを入力" />
        <select name="rank" class="shuwa-rank">
          ${createOption("", "手話検定の階級を選択", urlParams.rank)}
          ${createOption("5級", "5級", urlParams.rank)}
          ${createOption("4級", "4級", urlParams.rank)}
          ${createOption("3級", "3級", urlParams.rank)}
          ${createOption("2級", "2級", urlParams.rank)}
        </select>
        <select name="level" class="shuwa-quiz-level-select">
          ${createOption("", "クイズのレベルを選択", urlParams.level)}
          ${createOption("初級", "初級", urlParams.level)}
          ${createOption("中級", "中級", urlParams.level)}
          ${createOption("方言", "方言", urlParams.level)}
        </select>
      </form>
      ${includeBackButton ? '<button class="btn secondary" onclick="location.href=\'../\'">タイトルへ戻る</button>' : ""}
    </div>
  `;
}
