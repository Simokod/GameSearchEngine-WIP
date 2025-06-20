import { z } from "zod";

export const validateRequest = <T>(schema: z.ZodType<T>, data: any): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    console.log("data", data);
    console.error(error);
    throw error;
  }
};
