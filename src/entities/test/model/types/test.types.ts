import { IQuestion } from "@/entities/question";
import { IBaseEntity } from "@/shared/lib/types/common";

export enum TestStatusEnum {
  Draft = "DRAFT",
  Progress = "PROGRESS",
  Ended = "ENDED",
}

export enum AssigneeEnum {
  Teacher = "TEACHER",
  Recommendation = "RECOMMENDATION",
}

export enum ResultStatusEnum {
  RecNew = "REC_NEW",
  InProgress = "IN_PROGRESS",
  Ended = "ENDED",
  New = "",
}

export interface ITest extends IBaseEntity {
  name: string;
  description: string;
  status: TestStatusEnum;
  assignee: AssigneeEnum;
  deadline: string; // ISO-строка: "2025-05-23T17:40:00Z"
  result: {
    progress: number;
    status: ResultStatusEnum;
  };
}

export interface ITestWithQuestions extends ITest {
  questions: IQuestion[];
}
