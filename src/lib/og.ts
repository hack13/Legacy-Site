import { readFile } from "node:fs/promises";
import path from "node:path";

import satori from "satori";
import sharp from "sharp";

import { OG_HEIGHT, OG_WIDTH, SITE_DOMAIN, SITE_TAGLINE } from "../consts";

/**
 * Build-time social card renderer. Satori lays the card out and emits SVG with
 * the text already converted to paths, then sharp rasterises it to WebP so the
 * result needs no fonts on the viewer's side.
 *
 * Colours mirror the site chrome in src/layouts/Layout.astro.
 */
const COLORS = {
  pageBg: "#f9a8d4", // pink-300
  panelBg: "#fbcfe8", // pink-200
  border: "#c084fc", // purple-400
  title: "#581c87", // purple-900
  body: "#6b21a8", // purple-800
  accent: "#db2777", // pink-600
  date: "#4f46e5", // indigo-600
};

const FONT_FAMILY = "Comic Neue";
const FONT_DIR = path.join(process.cwd(), "src/assets/fonts");
const AVATAR_FILE = path.join(process.cwd(), "public/favicon.svg");
const TILE_FILE = path.join(process.cwd(), "public/images/bg-img.webp");

const AVATAR_HEIGHT = 126;

/** Wide enough that the tiled background reads as a pattern, not as noise. */
const CARD_PADDING = 34;

export interface OgCardInput {
  title: string;
  description?: string;
  /** Rendered above the title as a pill; falls back to the site tagline. */
  eyebrow?: string;
  date?: Date;
  tags?: string[];
}

/**
 * Satori accepts React elements, but the site has no UI framework installed, so
 * we hand it the same plain `{ type, props }` shape that JSX would compile to.
 */
type Element = { type: string; props: Record<string, unknown> };
type Child = Element | string | null | undefined | false;

function el(
  type: string,
  style: Record<string, unknown>,
  ...children: Child[]
): Element {
  return {
    type,
    props: { style, children: children.filter(Boolean) },
  };
}

async function loadFonts() {
  const [regular, bold] = await Promise.all([
    readFile(path.join(FONT_DIR, "comic-neue-latin-400-normal.woff")),
    readFile(path.join(FONT_DIR, "comic-neue-latin-700-normal.woff")),
  ]);
  return [
    { name: FONT_FAMILY, data: regular, weight: 400 as const, style: "normal" as const },
    { name: FONT_FAMILY, data: bold, weight: 700 as const, style: "normal" as const },
  ];
}

/** The site avatar, inlined because satori cannot read from the filesystem. */
async function loadAvatar() {
  const image = sharp(AVATAR_FILE, { density: 200 });
  const { width = 1, height = 1 } = await image.metadata();
  // Rasterise at 2x so the badge stays crisp in the PNG.
  const png = await image.resize({ height: AVATAR_HEIGHT * 2 }).png().toBuffer();
  return {
    src: `data:image/png;base64,${png.toString("base64")}`,
    width: Math.round((width / height) * AVATAR_HEIGHT),
    height: AVATAR_HEIGHT,
  };
}

/** The tiled page background, so cards sit on the same texture as the site. */
async function loadTile() {
  const image = sharp(TILE_FILE);
  const { width = 1, height = 1 } = await image.metadata();
  const png = await image.png().toBuffer();
  return {
    src: `data:image/png;base64,${png.toString("base64")}`,
    width,
    height,
  };
}

// Every post reuses these, so do the decoding once per build rather than 68 times.
let assets: Promise<{
  fonts: Awaited<ReturnType<typeof loadFonts>>;
  avatar: Awaited<ReturnType<typeof loadAvatar>>;
  tile: Awaited<ReturnType<typeof loadTile>>;
}> | null = null;

function loadAssets() {
  assets ??= Promise.all([loadFonts(), loadAvatar(), loadTile()]).then(
    ([fonts, avatar, tile]) => ({ fonts, avatar, tile }),
  );
  return assets;
}

/** Trim to a word boundary so satori never has to clip mid-glyph. */
function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const kept = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${kept.replace(/[\s,.;:!?-]+$/, "")}…`;
}

/** Keep long titles inside three lines without needing to measure text. */
function titleFontSize(title: string): number {
  if (title.length <= 30) return 68;
  if (title.length <= 50) return 60;
  if (title.length <= 75) return 52;
  return 44;
}

export async function renderOgCard(input: OgCardInput): Promise<Buffer> {
  const { fonts, avatar, tile } = await loadAssets();

  const title = truncate(input.title, 95);
  const description = input.description
    ? truncate(input.description, 135)
    : undefined;
  const eyebrow = input.eyebrow ?? SITE_TAGLINE;
  const date = input.date?.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  const tags = input.tags?.slice(0, 3).map((tag) => `#${tag}`).join("  ");

  const card = el(
    "div",
    {
      display: "flex",
      width: OG_WIDTH,
      height: OG_HEIGHT,
      padding: CARD_PADDING,
      fontFamily: FONT_FAMILY,
      backgroundColor: COLORS.pageBg,
      backgroundImage: `url(${tile.src})`,
      backgroundSize: `${tile.width}px ${tile.height}px`,
      backgroundRepeat: "repeat",
    },
    el(
      "div",
      {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: 18,
        borderRadius: 18,
        border: `8px solid ${COLORS.border}`,
        backgroundColor: COLORS.panelBg,
      },
      el(
        "div",
        {
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "space-between",
          padding: "28px 34px",
          borderRadius: 10,
          border: `4px dashed ${COLORS.border}`,
        },
        // Eyebrow pill + publication date.
        el(
          "div",
          { display: "flex", alignItems: "center", justifyContent: "space-between" },
          el(
            "div",
            {
              display: "flex",
              padding: "6px 22px",
              borderRadius: 999,
              backgroundColor: COLORS.accent,
              color: "#ffffff",
              fontSize: 26,
              fontWeight: 700,
            },
            eyebrow,
          ),
          date &&
            el(
              "div",
              { display: "flex", color: COLORS.date, fontSize: 26, fontWeight: 700 },
              date,
            ),
        ),
        // Title + description, centred in whatever space the rows above and below leave.
        el(
          "div",
          {
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            gap: 14,
            padding: "18px 0",
          },
          el(
            "div",
            {
              display: "flex",
              color: COLORS.title,
              fontSize: titleFontSize(title),
              fontWeight: 700,
              lineHeight: 1.15,
            },
            title,
          ),
          description &&
            el(
              "div",
              { display: "flex", color: COLORS.body, fontSize: 28, lineHeight: 1.35 },
              description,
            ),
        ),
        // Avatar, domain and tags.
        el(
          "div",
          { display: "flex", alignItems: "center", justifyContent: "space-between" },
          el(
            "div",
            { display: "flex", alignItems: "center", gap: 18 },
            {
              type: "img",
              props: {
                src: avatar.src,
                width: avatar.width,
                height: avatar.height,
                style: { width: avatar.width, height: avatar.height },
              },
            },
            el(
              "div",
              {
                display: "flex",
                color: COLORS.title,
                fontSize: 34,
                fontWeight: 700,
              },
              SITE_DOMAIN,
            ),
          ),
          tags &&
            el(
              "div",
              { display: "flex", color: COLORS.accent, fontSize: 26, fontWeight: 700 },
              tags,
            ),
        ),
      ),
    ),
  );

  const svg = await satori(card as never, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts,
  });

  return sharp(Buffer.from(svg)).webp({ quality: 90 }).toBuffer();
}
