const params = new URLSearchParams(window.location.search);
const mode = params.get('mode');

if (mode === 'reading') {
  import('./reading.ts');
} else {
  // modeが'expression'の場合、または指定されていない場合のデフォルトとしてexpression.tsを読み込む
  import('./expression.ts');
}
