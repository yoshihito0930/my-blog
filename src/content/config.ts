import { z, defineCollection } from "astro:content";

const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    publishedAt: z.date(),
    modifiedAt: z.date().nullable(),
    draft: z.boolean(),
  }),
});

const tags = defineCollection({
  type: "data",
  schema: z.object({
    id: z.string(),
    name: z.string(),
  }),
});
export const collections = {
  posts: posts,
  tags: tags,
};