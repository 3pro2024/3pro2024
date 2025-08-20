import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: "./src/pages",
  publicDir: "../../public", // publicディレクトリの場所をプロジェクトルートからの相対パスで指定
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
        modeselect: path.resolve(
          __dirname,
          "./src/pages/modeselect/index.html",
        ),
        achieve: path.resolve(__dirname, "./src/pages/achieve/index.html"),
        explain: path.resolve(__dirname, "./src/pages/explain/index.html"),
        quiz: path.resolve(__dirname, "./src/pages/quiz/index.html"),
        result: path.resolve(__dirname, "./src/pages/result/index.html"),
      },
    },
  },
  preview: {
    port: 4173,
  },
});
