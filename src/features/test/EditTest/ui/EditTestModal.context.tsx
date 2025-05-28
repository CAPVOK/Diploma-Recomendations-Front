import { createFormContext } from "@mantine/form";
import { IEditTestSchema } from "../model";

export const [EditTestFormProvider, useEditTestFormContext, useEditTestForm] =
  createFormContext<IEditTestSchema>();
