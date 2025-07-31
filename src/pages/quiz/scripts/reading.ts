export async function startQuiz(mode:string){
    let quizWords :number[] = new Array(7);//問題格納用配列
    //テストデータのため7個に設定.本当は10個
    let ansWords :number[] = new Array(4);//選択肢格納用配列

    console.log("reading.tsを読み込みました");// テスト用

    try{// わんちゃんエラーが起きそうな所
        //--jsonファイルの大きさ取得----
        const response = await fetch("/data/shuwa.json");
        // fetchをつかったjsonの取得

        const jsonData: any[] = await response.json();
        // any[]:どんな型でも要素として持つことのできる配列
        // await respons.json()：fetchで取得したresponseをjsが使える形に変換

        const dataCount = jsonData.length;
        //-----------
        //--Fisher-Yatesアルゴリズムで問題ランダム出題--

        const numberPool: number[] = [];
        // 簡単に言うとくじ引きの箱を作成
        for (let i = 0; i < dataCount; i++) {
            numberPool.push(i+1); // 1から始まるように調整
            // jsonにかかれているidは1からスタートのため
        }

        // 2. 配列をシャッフルする（フィッシャー–イェーツのシャッフル）
        for (let i = numberPool.length - 1; i > 0; i--) {
            // 0からiまでのランダムなインデックスを生成
            const j = Math.floor(Math.random() * (i + 1));
            // 要素を交換する
            [numberPool[i], numberPool[j]] = [numberPool[j], numberPool[i]];
        }

        // 3. シャッフルされた配列の先頭から7個を取得して、問題用の配列に格納
        //    slice(0, 7) は、0番目から7個分の要素を新しい配列として取り出す
        quizWords = numberPool.slice(0, 7);

        // 4. 結果をコンソールに出力して確認
        console.log(`全データ数: ${dataCount}`);
        console.log(`生成された問題（重複なしランダム7件）:`, quizWords);
        //----------
        
    }catch{// エラーが起きたときの処理
        console.log("jsonファイルが読み込めませんでした");
    }


}