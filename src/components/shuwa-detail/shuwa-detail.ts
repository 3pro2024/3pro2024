import VideoPlayer from "../video/video-player";
import type { ShuwaData } from "../../types";

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
