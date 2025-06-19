import data from "../../../../data/shuwa.json";
import type { ShuwaData } from "../../../types";
import "../styles/shuwa-item.css";

const shuwaData: ShuwaData[] = data;

document.querySelector<HTMLDivElement>(".shuwa-items")!.innerHTML = `
  <div class="shuwa-items">
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
  </div>
`;
