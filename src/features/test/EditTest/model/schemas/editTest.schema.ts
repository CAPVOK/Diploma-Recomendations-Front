import { IQuestion } from "@/entities/question";

export interface IEditTestSchema {
  name: string;
  description: string;
  deadline: string;
  questions: IQuestion[];
}
