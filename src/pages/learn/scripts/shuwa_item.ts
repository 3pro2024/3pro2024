import * as data from "../../../../data/shuwa.json";

let shuwaData = data;
console.log(shuwaData);

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
    </div>
    <p class="read-the-docs">
    </p>
  </div>
`;
