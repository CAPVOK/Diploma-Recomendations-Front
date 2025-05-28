import { IBaseEntity } from "@/shared/lib/types/common";

export type TAnswer = string[] | number | string;

export enum IQuestionTypeEnum {
  Single = "SINGLE",
  Multiple = "MULTIPLE",
  Text = "TEXT",
  Number = "NUMBER",
}

export interface IQuestion extends IBaseEntity {
  title: string;
  type: IQuestionTypeEnum;
  variants: Record<string, string> | null;
  answer?: TAnswer;
}
