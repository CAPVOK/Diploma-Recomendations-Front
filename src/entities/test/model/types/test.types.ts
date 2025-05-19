import { IQuestion } from "@/entities/question";
import { IBaseEntity } from "@/shared/lib/types/common";

export interface ITest extends IBaseEntity {
  name: string;
  description: string;
  deadline: string;
}

export interface ITestWithQuestions extends ITest {
  questions: IQuestion[];
}
