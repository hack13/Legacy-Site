import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";

import { renderOgCard } from "../../lib/og";
import { postSlug } from "../../lib/posts";

/**
 * One WebP social card per post, rendered during `astro build`. Posts that set
 * an `image` in frontmatter are skipped, since that image is used instead.
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("blog");
  return posts
    .filter((post) => !post.data.image)
    .map((post) => ({
      params: { slug: postSlug(post) },
      props: { post },
    }));
};

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: CollectionEntry<"blog"> };

  const webp = await renderOgCard({
    title: post.data.title,
    description: post.data.description,
    eyebrow: post.data.category,
    date: post.data.published,
    tags: post.data.tags,
  });

  return new Response(webp, {
    headers: { "Content-Type": "image/webp" },
  });
};
