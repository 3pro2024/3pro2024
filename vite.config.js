export default {
  root: "./src/pages",
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
      },
    },
  },
  // フォールバック無効化
  preview: {
    port: 4173,
  },
};
