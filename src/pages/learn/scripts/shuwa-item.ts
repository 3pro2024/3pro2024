import data from "../../../../data/shuwa.json";
import type { ShuwaData } from "../../../types";
import "../styles/shuwa-item.css";

const shuwaData: ShuwaData[] = data;

const params = new URLSearchParams(window.location.search);
const currentShuwaId = params.get("id");

document.querySelector<HTMLDivElement>(".shuwa-items")!.innerHTML =
  currentShuwaId
    ? `
      <div>
        <h1>単語：${shuwaData[Number(currentShuwaId) - 1].name}</h1>
        <div>
          <a href=${shuwaData[Number(currentShuwaId) - 1].youtube_url}>動画：${shuwaData[Number(currentShuwaId) - 1].youtube_url}</a>
          <p>やり方：${shuwaData[Number(currentShuwaId) - 1].how_to}</p>
          <p>例文：${shuwaData[Number(currentShuwaId) - 1].example_sentence}</p>
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
