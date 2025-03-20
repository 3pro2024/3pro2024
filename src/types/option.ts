import { Quiz } from "./quiz";

export type Option = {
  id: number;
  quizId: number;
  quiz: Quiz;
  text: string;
  order: number; // 表示順（ランダムにする前のデフォルトの並び方）
  createdAt: Date;
  updatedAt?: Date;
};
