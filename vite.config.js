import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: "./src/pages",
  appType: "mpa",
  server: {
    fs: {
      strict: false,
      allow: ["../../"], // プロジェクトルート全体へのアクセスを許可
    },
    host: true,
  },
  resolve: {
    alias: {
      "@data": path.resolve(__dirname, "./data"), // dataフォルダへのエイリアス
    },
  },
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "./src/pages/index.html"),
        learn: path.resolve(__dirname, "./src/pages/learn/index.html"),
        title: path.resolve(__dirname, "./src/pages/title/index.html"),
        modeselect: path.resolve(
          __dirname,
          "./src/pages/modeselect/index.html",
        ),
        achieve: path.resolve(__dirname, "./src/pages/achieve/index.html"),
        explain: path.resolve(__dirname, "./src/pages/explain/index.html"),
        quiz: path.resolve(__dirname, "./src/pages/quiz/index.html"),
      },
    },
  },
  preview: {
    port: 4173,
  },
});
