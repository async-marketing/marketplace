import z from "zod";

export const storeFormSchema = z.object({
  name: z.string().min(1, "Name field is required"),
  description: z.string().optional(),
});

export type StoreFormSchema = z.infer<typeof storeFormSchema>;
