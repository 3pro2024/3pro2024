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

## 重要な注意点

- 常にTypeScriptの型安全性を保つ
- ESLintエラーは必ず修正してからコミット
- 新しいコンポーネントは再利用性を考慮して作成
- YouTube URLは埋め込み形式で使用
- LocalStorageを使用してユーザー進捗を保存
