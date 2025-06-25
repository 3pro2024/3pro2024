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
        main: "./index.html",
        learn: "./learn/index.html",
        modeselect: "./modeselect/index.html",
      },
    },
  },
  // フォールバック無効化
  preview: {
    port: 4173,
  },
};
