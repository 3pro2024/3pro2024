// クイズのデータ構造を定義
export interface QuizData {
    quizWords: number[];
    choices: number[][];
}

export async function startQuiz(): Promise<QuizData | null> {
    let quizWords :number[] = [];//問題格納用配列
    const choices: number[][] = []; // 各問題の選択肢を格納する2次元配列

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

        // 配列をシャッフルする（フィッシャー–イェーツのシャッフル）
        for (let i = numberPool.length - 1; i > 0; i--) {
            // 0からiまでのランダムなインデックスを生成
            const j = Math.floor(Math.random() * (i + 1));
            // 要素を交換する
            [numberPool[i], numberPool[j]] = [numberPool[j], numberPool[i]];
        }

        // シャッフルされた配列の先頭から7個を取得して、問題用の配列に格納
        //    slice(0, 7) は、0番目から7個分の要素を新しい配列として取り出す
        quizWords = numberPool.slice(0, 7);//データができ次第、slice(0,10)にする

        // --- 選択肢の生成 ---
        // 全問題のIDリストを作成 (1からdataCountまで)
        const allIds = Array.from({ length: dataCount }, (_, i) => i + 1);

        for (const correctAnswerId of quizWords) {
            // 1. 正解以外の選択肢候補をフィルタリング
            const wrongChoiceCandidates = allIds.filter(id => id !== correctAnswerId);

            // 2. 不正解の選択肢候補をシャッフル
            for (let i = wrongChoiceCandidates.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [wrongChoiceCandidates[i], wrongChoiceCandidates[j]] = [wrongChoiceCandidates[j], wrongChoiceCandidates[i]];
            }

            // 3. 不正解の選択肢を3つ選ぶ
            const wrongChoices = wrongChoiceCandidates.slice(0, 3);

            // 4. 正解と不正解を合わせて選択肢リストを作成
            const currentChoices = [correctAnswerId, ...wrongChoices];

            // 5. 選択肢の順番をシャッフル
            for (let i = currentChoices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [currentChoices[i], currentChoices[j]] = [currentChoices[j], currentChoices[i]];
            }
            choices.push(currentChoices);
        }
        
        console.log(`生成された問題（重複なしランダム7件）:`, quizWords);
        console.log(`生成された選択肢:`, choices);

        // 生成した問題と選択肢のセットを返す
        return { quizWords, choices };
        
    }catch(error){// エラーが起きたときの処理
        console.error("jsonファイルが読み込めませんでした", error);
        return null;
    }
}