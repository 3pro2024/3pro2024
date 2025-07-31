function retire(){// 終了ボタンを押したときの処理
    const result = confirm("クイズを終了しますか？");
    if (result) {
        location.href = "../title/index.html";
    }
}
// ボタンにイベントリスナーを追加
const retireButton = document.getElementById('retireButton');
if (retireButton) {
    retireButton.addEventListener('click', retire);
}

const urlParams = new URLSearchParams(location.search);
// URLからクエリ文字列（URLパラメータ）を取得・扱いやすい形に変換
const mode = urlParams.get('mode');
// クエリパラメータからmodeを取得
const difficulty = urlParams.get('difficulty');
// クエリパラメータからdifficultyを取得

console.log('mode:', mode);
console.log('difficulty:', difficulty);

const filePath = `./${mode}.ts`;// modeの値を文字列として組み立てる

import(filePath)// 指定されたパス(filePath)を非同期に読み込む
    .then( module =>{// importの処理が成功したときの処理
        console.log(filePath + "imported.");
        module.startQuiz(mode);
    })
