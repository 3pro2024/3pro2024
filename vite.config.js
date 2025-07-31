export default {
  appType: "mpa", // マルチページアプリケーションモードを明示的に指定
  server: {
    fs: {
      strict: false,
    },
    host: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: "./src/pages/index.html",
        learn: "./src/pages/learn/index.html",
        title: "./src/pages/title/index.html",
        modeselect: "./src/pages/modeselect/index.html",
        achieve: "./src/pages/achieve/index.html",
        explain: "./src/pages/explain/index.html",
        quiz: "./src/pages/quiz/index.html",
        result: "./src/pages/result/index.html",
      },
    },
  },
  // フォールバック無効化
  preview: {
    port: 4173,
  },
};
