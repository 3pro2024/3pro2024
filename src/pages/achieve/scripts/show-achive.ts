export function showAchieve() {
  const reader = localStorage.getItem("reader-3");
  const readerElement = document.querySelector(".reader-click");

  if (!readerElement) return;

  readerElement.innerHTML = reader == "true" ? "だ" : "？";
}
