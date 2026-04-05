# Lead Magnet Landing Pages

Static landing pages for newsletter lead magnets. Built with Astro, styled with Tailwind CSS, managed via PagesCMS, hosted on Cloudflare Pages.

## How it works

Each landing page is a Markdown file in `content/landing-pages/` with YAML frontmatter. A single Astro template renders two layout modes:

- **With image** -- split layout (image left, copy + form right)
- **Without image** -- centered layout (copy + form stacked)

Both stack vertically on mobile.

Content is managed through [PagesCMS](https://pagescms.org) which commits edits directly to the repo. Cloudflare Pages auto-deploys on push.

## Setup

```sh
npm install
npm run dev
```

## Adding a landing page

Create a new `.md` file in `content/landing-pages/`:

```yaml
---
title: "Your headline"
subtitle: "Your subheadline"
slug: "your-url-slug"
heroImage: "/media/your-image.png"    # optional -- triggers split layout
heroImageAlt: "Description of image"
benefits:
  - "First benefit"
  - "Second benefit"
  - "Third benefit"
formEmbed: '<your SendFox or other form embed HTML>'
metaDescription: "SEO description"
---

Optional body copy rendered between subtitle and benefits.
```

Upload images to `public/media/`.

## Tracking

Configure GA4 and Meta Pixel in `src/config.ts`:

```ts
export const tracking = {
  ga4MeasurementId: "G-XXXXXXXXXX",
  metaPixelId: "1234567890",
};
```

Both are optional -- leave empty to disable.

## Deployment

Connect the GitHub repo to Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `dist`

## Commands

| Command           | Action                                  |
| :---------------- | :-------------------------------------- |
| `npm install`     | Install dependencies                    |
| `npm run dev`     | Start dev server at `localhost:4321`    |
| `npm run build`   | Build production site to `./dist/`      |
| `npm run preview` | Preview production build locally        |

## License

[MIT](LICENSE)
