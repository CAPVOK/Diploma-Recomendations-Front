import { IQuestion } from "@/entities/question";

export interface ICreateTestSchema {
  name: string;
  description: string;
  deadline: string;
  questions: IQuestion[];
}
