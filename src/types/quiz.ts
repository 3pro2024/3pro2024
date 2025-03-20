import { Shuwa } from "./shuwa";
import { Option } from "./option";

export type Quiz = {
  id: number;
  shuwaId: number;
  shuwa: Shuwa;
  question: string;
  options: Option[];
  answerIndex: number;
  quizVideoUrl: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy: string;
};
