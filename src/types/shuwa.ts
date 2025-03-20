import { Prefecture } from "./prefectures";
import { Quiz } from "./quiz";

export type Shuwa = {
  id: number;
  word: string;
  level: "初級" | "中級" | "上級";
  grade: "1級" | "2級" | "3級" | "4級" | "5級";
  prefecture?: Prefecture;
  category: string;
  modelSentences: string;
  howToDo: string;
  videoUrl: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy: string;
  quiz?: Quiz;
};
