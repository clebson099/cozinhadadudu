import { z } from "zod";

export const unitEnum = z.enum(["kg","g","l","ml","un","caixa","pacote","bandeja"]);

export const dishIngredientSchema = z.object({
  ingredientId: z.string().optional(),
  name: z.string().min(1, "Informe o ingrediente"),
  quantity: z.coerce.number().positive("Quantidade inválida"),
  unit: unitEnum,
});

export const dishSchema = z.object({
  name: z.string().min(2, "Informe o nome do prato"),
  photoUrl: z.string().url("URL inválida").or(z.literal("")).optional(),
  intro: z.string().min(1, "Informe uma introdução"),
  description: z.string().min(1, "Informe a descrição"),
  baseServings: z.coerce.number().int().positive("Informe quantas pessoas atende"),
  ingredients: z.array(dishIngredientSchema).min(1, "Adicione ao menos 1 ingrediente"),
});
export type DishFormValues = z.infer<typeof dishSchema>;

export const menuLinkSchema = z.object({
  title: z.string().min(2, "Informe um título"),
  welcomeMessage: z.string().min(1, "Informe uma mensagem de boas-vindas"),
  dishIds: z.array(z.string()).min(1, "Selecione ao menos 1 prato"),
  validityDays: z.union([z.literal(1), z.literal(3), z.literal(7), z.literal(15), z.literal(30)]),
});
export type MenuLinkFormValues = z.infer<typeof menuLinkSchema>;

export const customerSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  phone: z.string().min(8, "Informe um telefone válido"),
  notes: z.string().optional(),
});
export type CustomerFormValues = z.infer<typeof customerSchema>;
