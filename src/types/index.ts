export type ShuwaData = {
  id: number;
  name: string;
  how_to: string;
  youtube_url: string;
  example_sentence: string;
  quiz_level: ShuwaQuizLevel;
  shuwa_rank: ShuwaRank;
};

export type ShuwaQuizLevel = "初級" | "中級" | "方言";
export type ShuwaRank = "5級" | "4級" | "3級" | "2級";
