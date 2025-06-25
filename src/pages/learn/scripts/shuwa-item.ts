import data from "../../../../data/shuwa.json";
import type { ShuwaData } from "../../../types";
import "../styles/shuwa-item.css";

const shuwaData: ShuwaData[] = data;

const params = new URLSearchParams(window.location.search);
const currentShuwaId = params.get("id");
const validShuwaId = currentShuwaId 
  ? Number(currentShuwaId) 
  : null;

const isValidId = validShuwaId !== null 
  && Number.isInteger(validShuwaId) 
  && validShuwaId > 0 
  && validShuwaId <= shuwaData.length;

document.querySelector<HTMLDivElement>(".shuwa-items")!.innerHTML =
  isValidId
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
