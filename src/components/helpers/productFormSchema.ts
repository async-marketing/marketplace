import z from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "Name field is required"),
  price: z.string().min(1, "Price field is required"),
});

export type ProductFormSchema = z.infer<typeof productFormSchema>;
