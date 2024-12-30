import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

export const postsDefaultSortFunc = (
  a: CollectionEntry<"posts">,
  b: CollectionEntry<"posts">,
) => {
  const aDate = a.data.publishedAt;
  const bDate = b.data.publishedAt;
  if (aDate > bDate) {
    return -1;
  } else if (aDate < bDate) {
    return 1;
  } else {
    return 0;
  }
};

export const getTagMap = async () => {
  const tags = await getCollection("tags");
  return new Map(tags.map((tag) => [tag.data.id, tag.data]));
};