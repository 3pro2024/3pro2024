export function createButtonHTML(label: string, onClicks: string): string{
    return `<button onclick="${onClicks}">${label}</button>`;
}