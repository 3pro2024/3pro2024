export type ShuwaData = {
  id: number;
  name: string;
  how_to: string;
  youtube_url: string;
  example_sentence: string;
  quiz_level: ShuwaQuizLevel;
  shuwa_rank: ShuwaRank;
};

export type ShuwaQuizLevel = "初級" | "中級" | "上級" | "方言";
export type ShuwaRank = "5級" | "4級" | "3級" | "2級";

// 統合ユーザー進捗データ
export interface UserStats {
  // 読み取りモード: レベル別正解数
  reading_beginner: number;
  reading_intermediate: number;
  reading_advanced: number;
  reading_dialect: number;

  // 表現モード: レベル別正解数
  expression_beginner: number;
  expression_intermediate: number;
  expression_advanced: number;
  expression_dialect: number;

  // 満点回数: モード・レベル別
  perfect_reading_beginner: number;
  perfect_reading_intermediate: number;
  perfect_reading_advanced: number;
  perfect_expression_beginner: number;
  perfect_expression_intermediate: number;
  perfect_advanced_total: number; // 上級満点（読み取り+表現）
  perfect_total: number; // 全体満点回数

  // 学習関連
  learned_words: number[]; // 学習済み単語IDの配列

  // 特殊フラグ
  played_reading: boolean;
  played_expression: boolean;
  viewed_finger_chart: boolean;
  learned_nessie_word: boolean; // ネッシー単語学習フラグ
}

// アチーブメント定義型
export interface AchievementDefinition {
  id: string; // 内部ID (kagimoto-1, itoga-3など)
  displayName: string; // 表示名 (鍵本①, 今日①など)
  description: string; // 説明文
  condition: (stats: UserStats) => boolean; // 達成条件
  category: "member" | "special"; // カテゴリ
  memberName?: string; // メンバー名（メンバーカテゴリの場合）
  order: number; // 表示順序
}
