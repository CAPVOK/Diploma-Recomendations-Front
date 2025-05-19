import { IBaseEntity } from "@/shared/lib/types/common";

export enum IQuestionTypeEnum {
  Single = "SINGLE",
  Multiple = "MULTIPLE",
  Text = "TEXT",
  Number = "NUMBER",
}

export interface IQuestion extends IBaseEntity {
  title: string;
  type: IQuestionTypeEnum;
  variants: Record<string, string>;
  answer?: string[] | number | string;
}
