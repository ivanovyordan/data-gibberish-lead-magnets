# Lead Magnet Landing Pages — Design Spec

## Context

We need a simple site to host static landing pages for newsletter lead magnets. Each page collects emails via an embedded SendFox form. Think ClickFunnels-style squeeze pages, but self-hosted on Cloudflare Pages with content managed through PagesCMS.

## Stack

- **Astro** — static site generator, zero JS by default
- **Tailwind CSS** — utility-first styling
- **Cloudflare Pages** — hosting and deployment
- **PagesCMS** — GitHub-based CMS for editing landing page content

## Layout

One Astro template with two modes, determined by whether `heroImage` is provided:

### Mode 1: With Image (split)
```
┌─────────────────┬────────────────┐
│                 │     Copy       │
│                 │  (title,       │
│     Image       │   subtitle,    │
│                 │   benefits)    │
│                 ├────────────────┤
│                 │     Form       │
│                 │  (SendFox)     │
└─────────────────┴────────────────┘
```
- Image takes ~55% width, copy+form take ~45%
- Image fills full height of the section

### Mode 2: Without Image (centered)
```
┌──────────────────────────────────┐
│            Copy                  │
│   (title, subtitle, benefits)    │
├──────────────────────────────────┤
│            Form                  │
│         (SendFox)                │
└──────────────────────────────────┘
```
- Content centered, max-width constrained
- Copy and form stacked vertically

### Mobile (both modes)
Both modes stack vertically on mobile: image (if present) → copy → form.

## Content Model

Each landing page is a Markdown file with YAML frontmatter. Managed as a PagesCMS collection.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | yes | Page headline |
| `subtitle` | string | no | Subheadline / value proposition |
| `slug` | string | yes | URL path (e.g. `free-guide`) |
| `heroImage` | image | no | Hero image (triggers split layout when present) |
| `heroImageAlt` | string | no | Alt text for hero image |
| `benefits` | list of strings | no | Bullet points (e.g. "✓ Learn X") |
| `formEmbed` | text (raw HTML) | yes | SendFox form embed code |
| `ogImage` | image | no | Social sharing image |
| `metaDescription` | string | no | SEO meta description |

### Example frontmatter

```yaml
---
title: "The Ultimate Data Newsletter Toolkit"
subtitle: "Everything you need to grow your data audience"
slug: "newsletter-toolkit"
heroImage: "/media/toolkit-hero.png"
heroImageAlt: "Screenshot of the toolkit dashboard"
benefits:
  - "50+ proven subject line templates"
  - "Audience growth playbook"
  - "Weekly analytics tracker"
formEmbed: '<div id="sf-form-abc123">...</div><script>...</script>'
ogImage: "/media/toolkit-og.png"
metaDescription: "Get the free data newsletter toolkit"
---
```

## File Structure

```
/
├── .pages.yml                    # PagesCMS configuration
├── astro.config.mjs              # Astro config + Cloudflare adapter
├── tailwind.config.mjs           # Tailwind config
├── package.json
├── src/
│   ├── layouts/
│   │   └── Landing.astro         # The landing page template
│   └── pages/
│       └── [...slug].astro       # Dynamic route from content collection
├── content/
│   └── landing-pages/            # Markdown files (PagesCMS collection)
│       └── example.md
└── public/
    └── media/                    # Uploaded images (PagesCMS media target)
```

## PagesCMS Configuration (.pages.yml)

```yaml
media:
  input: public/media
  output: /media

content:
  - name: landing-pages
    label: Landing Pages
    type: collection
    path: content/landing-pages
    filename: "{fields.slug}.md"
    fields:
      - name: title
        label: Title
        type: string
        required: true
      - name: subtitle
        label: Subtitle
        type: string
      - name: slug
        label: URL Slug
        type: string
        required: true
      - name: heroImage
        label: Hero Image
        type: image
      - name: heroImageAlt
        label: Hero Image Alt Text
        type: string
      - name: benefits
        label: Benefits
        type: string
        list: true
      - name: formEmbed
        label: SendFox Form Embed
        type: rich-text
        required: true
        options:
          format: html
      - name: ogImage
        label: OG Image
        type: image
      - name: metaDescription
        label: Meta Description
        type: string
```

## Astro Configuration

- Use `@astrojs/cloudflare` adapter for Cloudflare Pages deployment
- Content collection defined for `landing-pages` with the schema above
- Dynamic `[...slug].astro` route that renders each entry using `Landing.astro`
- All packages installed via `npm install` (latest versions, never hardcoded)

## Tracking & Analytics

### Google Analytics (GA4)
- Site-wide GA4 snippet in the layout `<head>`
- Measurement ID stored as a site-level config (not per-page)
- Fire a custom `generate_lead` conversion event when the SendFox form submits (listen for form submit or iframe message, depending on embed type)

### Meta Pixel (Facebook)
- Site-wide Meta Pixel base code in the layout `<head>`
- Pixel ID stored as a site-level config
- Fire `PageView` on load (standard) and `Lead` event on form submission
- This enables building retargeting audiences and optimizing ad delivery for conversions

### Implementation
- Both tracking IDs configured in a single `src/config.ts` file (easy to change, not in frontmatter)
- The `Landing.astro` layout injects both scripts conditionally (only when IDs are set)
- A small inline `<script>` listens for form submission and fires conversion events to both GA4 and Meta

### Config file (`src/config.ts`)
```ts
export const tracking = {
  ga4MeasurementId: "", // e.g. "G-XXXXXXXXXX"
  metaPixelId: "",      // e.g. "1234567890"
};
```

## Styling Notes

- Full-viewport-height landing pages (min-h-screen)
- Clean, modern typography — no navigation, no footer
- Subtle background color or gradient (configurable per page if desired later)
- Form area visually distinct (card-like container)
- Responsive breakpoint: split → stacked at `md` (768px)

## Deployment

- Connect GitHub repo to Cloudflare Pages
- Build command: `npm run build`
- Output directory: `dist`
- PagesCMS manages content via GitHub — edits commit to the repo, Cloudflare Pages auto-deploys

## Verification

1. `npm run dev` — local Astro dev server shows landing pages
2. Create a test landing page with image and one without — verify both layout modes
3. Verify mobile responsiveness (stacked layout)
4. Verify SendFox embed renders and form submits
5. `.pages.yml` works in PagesCMS (connect repo, verify fields appear)
6. Deploy to Cloudflare Pages and verify production build
