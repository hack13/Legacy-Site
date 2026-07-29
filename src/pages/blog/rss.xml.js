import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import dayjs from "dayjs";

import { OG_DEFAULT_IMAGE, SITE_DESCRIPTION, SITE_URL } from "../../consts";
import { postPath } from "../../lib/posts";

export async function GET(context) {
  const site = context.site ?? new URL(SITE_URL);

  const Blog = await getCollection("blog");
  Blog.sort((a, b) => dayjs(b.data.published).diff(dayjs(a.data.published)));

  return rss({
    title: "Hack13 Ramblings",
    description: SITE_DESCRIPTION,
    site,
    feed_url: new URL("/blog/rss.xml", site).href,
    image_url: new URL(OG_DEFAULT_IMAGE, site).href,
    items: Blog.filter((post) => !post.data.draft).map((post) => ({
      title: post.data.title,
      pubDate: post.data.published,
      description: post.data.description,
      categories: post.data.tags,
      link: new URL(postPath(post), site).href,
    })),
  });
}
