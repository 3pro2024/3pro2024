const params = new URLSearchParams(window.location.search);
const mode = params.get('mode');

const loadCss = (mode: string | null) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  let cssFile = '';

  switch (mode) {
    case 'reading':
      cssFile = './styles/reading.css';
      break;
    case 'expression':
      cssFile = './styles/expression.css';
      break;
    default:
      // デフォルトのCSS
      cssFile = './styles/quiz.css';
      break;
  }
  link.href = cssFile;
  document.head.appendChild(link);
};

loadCss(mode);

if (mode === 'reading') {
  import('./reading.ts');
} else {
  // modeが'expression'の場合、または指定されていない場合のデフォルトとしてexpression.tsを読み込む
  import('./expression.ts');
}
