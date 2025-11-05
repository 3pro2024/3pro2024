import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import noCommentedCode from "eslint-plugin-no-commented-code";
import unusedImports from "eslint-plugin-unused-imports";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: {
      js,
      "no-commented-code": noCommentedCode,
      "unused-imports": unusedImports,
    },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: { globals: globals.browser },
    rules: {
      // console.logなどを警告（warn/errorは許可）
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],

      // デバッガーの使用を警告
      "no-debugger": "warn",

      // コメントアウトされたコードを検出
      "no-commented-code/no-commented-code": "warn",

      // 未使用のimportを検出
      "unused-imports/no-unused-imports": "warn",

      // 未使用の変数を検出（unused-importsと併用）
      "unused-imports/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  tseslint.configs.recommended,
]);
