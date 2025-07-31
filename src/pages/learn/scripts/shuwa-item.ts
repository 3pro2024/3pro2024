import data from "../../../../data/shuwa.json";
import VideoPlayer from "../../../components/video/video-player";
import type { ShuwaData, ShuwaQuizLevel, ShuwaRank } from "../../../types";
import "../styles/shuwa-item.css";
import { createSearchForm } from "./search-form";

const shuwaData: ShuwaData[] = data as ShuwaData[];

/**
 * 特定の手話単語の詳細なHTMLコンテンツを生成します。（モーダル対応可のコンポーネント）
 * @param shuwa - 表示する手話のデータオブジェクト
 * @returns 生成されたHTML文字列
 */
export function createShuwaDetailHTML(shuwa: ShuwaData): string {
  if (!shuwa) return "<p>該当するデータが見つかりませんでした。</p>";

  return `
    <div class="shuwa-detail">
      <h1 class="shuwa-item-name">単語：${shuwa.name}</h1>
      <div class="shuwa-content">
        <div class="shuwa-video">${VideoPlayer(shuwa.youtube_url)}</div>
        <div class="shuwa-text">
          <p class="shuwa-how-to">やり方：${shuwa.how_to}</p>
          <p class="shuwa-example-sentence">例文：${shuwa.example_sentence}</p>
        </div>
      </div>
    </div>
  `;
}

const params = new URLSearchParams(window.location.search);
const currentLevelId = (params.get("level") as ShuwaQuizLevel) || null;
const currentRankId = (params.get("rank") as ShuwaRank) || null;
const currentShuwaId = params.get("id");
const validShuwaId = currentShuwaId ? Number(currentShuwaId) : null;

const isValidId =
  validShuwaId !== null &&
  Number.isInteger(validShuwaId) &&
  validShuwaId > 0 &&
  validShuwaId <= shuwaData.length;

function searchResults(
  shuwaData: ShuwaData[],
  level: ShuwaQuizLevel | null,
  rank: ShuwaRank | null,
): ShuwaData[] {
  if (!shuwaData) return [];
  else if (!level && !rank) return shuwaData;
  else if (!level && rank)
    return shuwaData.filter((shuwa) => shuwa.shuwa_rank == rank);
  else if (level && !rank)
    return shuwaData.filter((shuwa) => shuwa.quiz_level == level);
  return shuwaData.filter((shuwa) => {
    return shuwa.quiz_level == level && shuwa.shuwa_rank == rank;
  });
}

// 学習ページが直接表示された場合の処理
const shuwaItemsContainer =
  document.querySelector<HTMLDivElement>(".shuwa-items");
if (shuwaItemsContainer) {
  shuwaItemsContainer.innerHTML = isValidId
    ? `${createShuwaDetailHTML(shuwaData[validShuwaId - 1])}
       <button id="quiz-back" onclick="location.href='../learn/'">戻る</button>`
    : `${createSearchForm()}
        ${searchResults(shuwaData, currentLevelId, currentRankId)
          .map(
            (shuwa) => `
              <div class="shuwa-item">
                <a href="./?id=${shuwa.id}">
                  <h2 class="shuwa-item-name">${shuwa.name}</h2>
                </a>
              </div>
            `,
          )
          .join("")}
        <button id="quiz-back" onclick="location.href='../title/'">戻る</button>`;
}
