import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import dayjs from "dayjs";

export async function GET(context) {
  const Blog = await getCollection("blog");
  Blog.sort((a, b) => dayjs(b.data.published).diff(dayjs(a.data.published)));
  return rss({
    title: "Hack13 Ramblings",
    description: "A fox with a blog, that rambles about tech, games, and life.",
    site: "https://hack13.me",
    feed_url: "https://hack13.me/blog/rss.xml",
    image_url: "https://hack13.me/favicon.png",
    items: Blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.published,
      description: post.data.description,
      link: `https://hack13.me/blog/${post.slug}`,
    })),
  });
}
