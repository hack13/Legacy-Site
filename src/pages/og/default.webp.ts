import type { APIRoute } from "astro";

import { SITE_DESCRIPTION, SITE_TITLE } from "../../consts";
import { renderOgCard } from "../../lib/og";

/** Fallback social card for pages that are not blog posts. */
export const GET: APIRoute = async () => {
  const webp = await renderOgCard({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  });

  return new Response(webp, {
    headers: { "Content-Type": "image/webp" },
  });
};
