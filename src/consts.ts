export const SITE_TITLE = "HACK13";
export const SITE_TAGLINE = "Just a Fox on the Internet";
export const SITE_DESCRIPTION =
  "A fox with a blog, that rambles about tech, games, and life.";
export const SITE_DOMAIN = "hack13.me";
export const FEDIVERSE_CREATOR = "@hack13@cyberfurz.social";

/** Fallback used when `site` is missing from astro.config.mjs. */
export const SITE_URL = `https://${SITE_DOMAIN}`;

/** Social cards are the 1.91:1 ratio that X, Mastodon, Bluesky and Discord expect. */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** Routes under here are WebP images built by src/pages/og/. */
export const OG_ROUTE_PREFIX = "/og/";
export const OG_DEFAULT_IMAGE = `${OG_ROUTE_PREFIX}default.webp`;
