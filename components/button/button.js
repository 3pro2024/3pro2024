"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createButtonHTML = createButtonHTML;
function createButtonHTML(label, onClicks) {
    return "<button onclick=\"".concat(onClicks, "\">").concat(label, "</button>");
}
