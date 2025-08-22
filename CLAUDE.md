# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 手話ぷら プロジェクト設定

## 技術スタック

- フレームワーク: Vite 6.3.5
- 言語: TypeScript 5.8.3
- スタイル: Vanilla CSS
- データ形式: JSON
- 保存方法: LocalStorage
- 動画配信: YouTube埋め込み

## プロジェクト構造

- `src/`: メインのソースコード
- `src/pages/`: 各画面のHTML/CSS/TS
  - `title/`: タイトル画面
  - `quiz/`: クイズモード
  - `learn/`: 学習モード
  - `achieve/`: 実績画面
  - `explain/`: 遊び方画面
- `src/components/`: 共通コンポーネント
- `src/types/`: TypeScript型定義
- `data/`: 手話データ（JSON）
- `public/`: 静的ファイル（画像など）

## 開発コマンド

- `pnpm dev`: 開発サーバー起動
- `pnpm build`: 本番用ビルド
- `pnpm preview`: ビルド結果のプレビュー
- `pnpm lint`: ESLintでコードチェック
- `pnpm format`: Prettierでコード整形
- `pnpm commit`: Commitizenでコミット

## コードスタイル

- インデント: 2スペース
- クォート: シングルクォート推奨
- セミコロン: 必須
- インポート: ES6モジュール形式
- 命名規則: camelCase（変数・関数）、PascalCase（型・クラス）
- ファイル名: kebab-case

## Git運用ルール

- メインブランチ: `main`（本番用）
- 開発ブランチ: `develop`（開発ベース）
- 機能ブランチ: `feat/機能名`、`fix/修正内容`
- コミット形式: `type: 説明`
  - `feat:` 新機能
  - `fix:` バグ修正
  - `docs:` ドキュメント
  - `style:` コードスタイル
  - `refactor:` リファクタリング

## データ型定義

```typescript
export type ShuwaData = {
  id: number;
  name: string;
  how_to: string;
  youtube_url: string;
  example_sentence: string;
  quiz_level: "初級" | "中級" | "上級" | "方言";
  shuwa_rank: "5級" | "4級" | "3級" | "2級";
};
```

## アーキテクチャ詳細

### Multi-Page Application (MPA) 構成
このプロジェクトはViteのMPA設定を使用し、各ページが独立したHTMLエントリーポイントを持つ：

```javascript
// vite.config.js の入力設定
input: {
  main: "./src/pages/index.html",
  learn: "./src/pages/learn/index.html",
  modeselect: "./src/pages/modeselect/index.html",
  achieve: "./src/pages/achieve/index.html",
  explain: "./src/pages/explain/index.html",
  quiz: "./src/pages/quiz/index.html",
  result: "./src/pages/result/index.html"
}
```

### コンポーネント設計パターン
- **関数型コンポーネント**: HTML文字列を返すTypeScript関数として実装
- **VideoPlayerコンポーネント**: YouTube動画埋め込み用の共通コンポーネント
- **ShuwaDetailコンポーネント**: 手話詳細表示用の共通コンポーネント

### データフロー
1. **静的データ**: `data/shuwa.json`から手話データを直接import
2. **ユーザーデータ**: LocalStorageでクイズ進捗と実績を永続化
3. **ナビゲーション**: URLパラメータでクイズレベル・ランク・キーワード検索を制御

## CSS設計原則

### 重要なスタイリングルール
- **pxの使用を避ける**: vh、vw、em、rem等の相対単位を優先使用
- **CSS Custom Properties**: `--frame-color`, `--frame-thickness` 等でテーマ管理
- **レスポンシブデザイン**: Mobile-firstアプローチでBreakpoint設計

### テーマシステム
複数のカラーテーマを提供：
- `theme-nature`: 緑系テーマ
- `theme-sunset`: オレンジ系テーマ  
- `theme-ocean`: 青系テーマ
- `theme-dark`: ダークモードテーマ
- `theme-minimal`: ミニマルテーマ

## 重要な注意点

- 常にTypeScriptの型安全性を保つ
- ESLintエラーは必ず修正してからコミット
- 新しいコンポーネントは再利用性を考慮して作成
- YouTube URLは埋め込み形式で使用
- LocalStorageを使用してユーザー進捗を保存
- **CSSでは相対単位（vh/vw/em/rem）を使用し、pxは避ける**
