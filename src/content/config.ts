import { z, defineCollection } from "astro:content";

const posts = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
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
  tags: tags
};