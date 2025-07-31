import data from "../../../../data/shuwa.json";
import VideoPlayer from "../../../components/video/video-player";
import type { ShuwaData, ShuwaQuizLevel, ShuwaRank } from "../../../types";
import "../styles/shuwa-item.css";
import { createSearchForm } from "./search-form";

const shuwaData: ShuwaData[] = data as ShuwaData[];

const params = new URLSearchParams(window.location.search);
const currentLevelId = (params.get("level") as ShuwaQuizLevel) || null;
const currentRankId = (params.get("rank") as ShuwaRank) || null;
const currentShuwaId = params.get("id");
// URLに?id=1などがなかった場合は、nullを設定する。ある場合はidの数字を取得する。
const validShuwaId = currentShuwaId ? Number(currentShuwaId) : null;

console.log(currentRankId, currentLevelId);
/**
 * 無効なIDかチェックをする, booleanの値を持つ定数
 * チェック内容：nullチェック, 0以上かつ手話のデータの範囲内、整数値
 */
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

document.querySelector<HTMLDivElement>(".shuwa-items")!.innerHTML = isValidId
  ? `
      <div class="shuwa-detail">
        <h1 class="shuwa-item-name">単語：${shuwaData[validShuwaId - 1].name}</h1>
        <div class="shuwa-content">
          <div class="shuwa-video">${VideoPlayer(shuwaData[validShuwaId - 1].youtube_url)}</div>
          <div class="shuwa-text">
            <p class="shuwa-how-to">やり方：${shuwaData[validShuwaId - 1].how_to}</p>
            <p class="shuwa-example-sentence">例文：${shuwaData[validShuwaId - 1].example_sentence}</p>
          </div>
        </div>
        <button id="quiz-back" onclick="location.href='../learn/'">戻る</button>
      </div>
    `
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
        .join(
          "",
        )}     <button id="quiz-back" onclick="location.href='../title/'">戻る</button>
`;
