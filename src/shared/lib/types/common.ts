export interface IBaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface IBaseErrorResponse {
  Message: string;
}
