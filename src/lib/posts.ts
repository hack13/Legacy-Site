import type { CollectionEntry } from "astro:content";

import { OG_ROUTE_PREFIX } from "../consts";

type Post = CollectionEntry<"blog">;

/**
 * Frontmatter `url` values are inconsistent about leading and trailing slashes
 * (older imported posts have both, newer ones have neither), so everything that
 * builds a path from one goes through here.
 */
export function postSlug(post: Post): string {
  return post.data.url.replace(/^\/+/, "").replace(/\/+$/, "");
}

export function postPath(post: Post): string {
  return `/blog/${postSlug(post)}/`;
}

/** Social card for a post: the author's own image if given, else the generated one. */
export function postImagePath(post: Post): string {
  return post.data.image ?? `${OG_ROUTE_PREFIX}${postSlug(post)}.webp`;
}
