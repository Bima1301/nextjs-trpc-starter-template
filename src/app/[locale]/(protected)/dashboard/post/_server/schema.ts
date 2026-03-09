import { z } from "zod";

export const listInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().optional().default(""),
});

export const postBaseSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
});

export const postIdSchema = z.object({
  id: z.string().cuid("Invalid post id"),
});

export const postCreateSchema = postBaseSchema;

export const postUpdateSchema = postBaseSchema.extend({
  id: z.string().cuid("Invalid post id"),
});

export type PostCreateInput = z.infer<typeof postCreateSchema>;
export type PostUpdateInput = z.infer<typeof postUpdateSchema>;
export type PostIdInput = z.infer<typeof postIdSchema>;

