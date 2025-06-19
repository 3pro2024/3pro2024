export function createButtonHTML(label: string, onClicks: string): string{
    return `<button onclock="${onClicks}">${label}</button>`;
}