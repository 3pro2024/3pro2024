import data from "../../../../data/shuwa.json";
import type { ShuwaData } from "../../../types";
import "../styles/shuwa-item.css";

const shuwaData: ShuwaData[] = data;

const params = new URLSearchParams(window.location.search);
const currentShuwaId = params.get("id");
// URLに?id=1などがなかった場合は、nullを設定する。ある場合はidの数字を取得する。
const validShuwaId = currentShuwaId ? Number(currentShuwaId) : null;

/**
 * 無効なIDかチェックをする, booleanの値を持つ定数
 * チェック内容：nullチェック, 0以上かつ手話のデータの範囲内、整数値
 */
const isValidId =
  validShuwaId !== null &&
  Number.isInteger(validShuwaId) &&
  validShuwaId > 0 &&
  validShuwaId <= shuwaData.length;

document.querySelector<HTMLDivElement>(".shuwa-items")!.innerHTML = isValidId
  ? `
      <div>
        <h1>単語：${shuwaData[validShuwaId - 1].name}</h1>
        <div>
          <a href=${shuwaData[validShuwaId - 1].youtube_url}>動画：${shuwaData[validShuwaId - 1].youtube_url}</a>
          <p>やり方：${shuwaData[validShuwaId - 1].how_to}</p>
          <p>例文：${shuwaData[validShuwaId - 1].example_sentence}</p>
        </div>
      </div>
    `
  : `<div class="shuwa-items">
      ${shuwaData
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
  </div>`;
