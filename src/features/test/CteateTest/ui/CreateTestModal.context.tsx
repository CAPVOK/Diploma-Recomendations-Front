import { createFormContext } from "@mantine/form";
import { ICreateTestSchema } from "../model";

export const [
  CreateTestFormProvider,
  useCreateTestFormContext,
  useCreateTestForm,
] = createFormContext<ICreateTestSchema>();
