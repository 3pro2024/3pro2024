/**
 * ボタンを生成して返す関数
 * @param label ボタンに表示するテキスト
 * @param onClick クリック時に実行する関数
 * @returns HTMLButtonElement
 */
export function createButton(label: string, onClick: () => void): HTMLButtonElement {
  const button = document.createElement("button");
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}