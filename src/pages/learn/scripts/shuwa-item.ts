import data from "../../../../data/json.json";
import { createButtonHTML } from "../../../components/button/button";
import { createShuwaDetailHTML } from "../../../components/shuwa-detail/shuwa-detail";
import {
  LEARNED_SHUWA_COUNT_KEY,
  LEARNED_SHUWA_LIST_KEY,
} from "../../../constants/localStorage";
import type { ShuwaData, ShuwaQuizLevel, ShuwaRank } from "../../../types";
import "../styles/shuwa-item.css";
import { createSearchForm } from "./search-form";

const shuwaData: ShuwaData[] = data as ShuwaData[];

const params = new URLSearchParams(window.location.search);
const currentLevelId = (params.get("level") as ShuwaQuizLevel) || null;
const currentRankId = (params.get("rank") as ShuwaRank) || null;
const currentKeyword = params.get("keyword") || null;
const currentShuwaId = params.get("id");
const validShuwaId = currentShuwaId ? Number(currentShuwaId) : null;

const targetShuwa =
  validShuwaId !== null
    ? shuwaData.find((shuwa) => shuwa.id === validShuwaId)
    : null;

const isValidId = targetShuwa !== null && targetShuwa !== undefined;

function searchResults(
  shuwaData: ShuwaData[],
  level: ShuwaQuizLevel | null,
  rank: ShuwaRank | null,
  keyword: string | null,
): ShuwaData[] {
  return shuwaData.filter((shuwa) => {
    const levelMatch = !level || shuwa.quiz_level === level;
    const rankMatch = !rank || shuwa.shuwa_rank === rank;
    const keywordMatch =
      !keyword || shuwa.name.toLowerCase().includes(keyword.toLowerCase());
    return levelMatch && rankMatch && keywordMatch;
  });
}

function createCardLayout(data: ShuwaData[]): string {
  const items = data
    .map(
      (shuwa) => `
        <div class="shuwa-item">
          <a href="./?id=${shuwa.id}">
            <h2 class="shuwa-item-name">${shuwa.name}</h2>
          </a>
        </div>
      `,
    )
    .join("");

  return `<div class="shuwa-items-grid">${items}</div>`;
}

const shuwaItemsContainer =
  document.querySelector<HTMLDivElement>(".shuwa-items")!;
document.body.className = "theme-nature";

if (isValidId) {
  const learnedShuwas: string[] =
    localStorage.getItem(LEARNED_SHUWA_LIST_KEY)?.split(",") || [];
  if (currentShuwaId && !learnedShuwas.includes(currentShuwaId.toString())) {
    learnedShuwas.push(currentShuwaId.toString());
    localStorage.setItem(LEARNED_SHUWA_LIST_KEY, learnedShuwas.join(","));
    const shuwaCount = learnedShuwas.length;
    localStorage.setItem(LEARNED_SHUWA_COUNT_KEY, shuwaCount.toString());
  }
  shuwaItemsContainer.innerHTML = `
    ${createShuwaDetailHTML(targetShuwa!)}
    ${createButtonHTML("戻る", "history.back()")}
  `;
} else {
  shuwaItemsContainer.innerHTML = `
    ${createSearchForm(true)}
    <div id="shuwa-grid-container">
      ${createCardLayout(searchResults(shuwaData, currentLevelId, currentRankId, currentKeyword))}
    </div>`;

  const searchInput = document.querySelector(
    ".shuwa-search-form input",
  ) as HTMLInputElement;
  const rankSelect = document.querySelector(
    ".shuwa-search-form .shuwa-rank",
  ) as HTMLSelectElement;
  const levelSelect = document.querySelector(
    ".shuwa-search-form .shuwa-quiz-level-select",
  ) as HTMLSelectElement;
  const gridContainer = document.querySelector(
    "#shuwa-grid-container",
  ) as HTMLDivElement;

  const handleSearch = () => {
    const keyword = searchInput.value;
    const rank = rankSelect.value;
    const level = levelSelect.value;

    const newParams = new URLSearchParams();
    if (keyword) newParams.set("keyword", keyword);
    if (rank) newParams.set("rank", rank);
    if (level) newParams.set("level", level);
    const newUrl = `${window.location.pathname}?${newParams.toString()}`;
    history.pushState({ path: newUrl }, "", newUrl);

    const filteredData = searchResults(
      shuwaData,
      level as ShuwaQuizLevel,
      rank as ShuwaRank,
      keyword,
    );
    gridContainer.innerHTML = createCardLayout(filteredData);
  };

  searchInput.addEventListener("input", handleSearch);
  rankSelect.addEventListener("change", handleSearch);
  levelSelect.addEventListener("change", handleSearch);
}

document.addEventListener("DOMContentLoaded", () => {
  // メインコンテンツ(.shuwa-items)を .app で囲む
  const shuwaItems = document.querySelector(".shuwa-items");
  if (shuwaItems && shuwaItems.parentNode) {
    const appWrapper = document.createElement("div");
    appWrapper.className = "app";

    shuwaItems.parentNode.replaceChild(appWrapper, shuwaItems);
    appWrapper.appendChild(shuwaItems);
  }

  // フレーム要素をbodyの最後に追加する
  if (!document.querySelector(".screen-frame")) {
    const screenFrame = document.createElement("div");
    screenFrame.className = "screen-frame";
    document.body.appendChild(screenFrame);
  }
});
