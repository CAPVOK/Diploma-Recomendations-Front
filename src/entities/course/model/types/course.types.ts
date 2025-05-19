import { IBaseEntity } from "@/shared/lib/types/common";

export interface ICourse extends IBaseEntity {
  name: string;
  description?: string;
}
