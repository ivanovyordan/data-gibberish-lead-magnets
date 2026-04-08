import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const landingPages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/landing-pages" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    slug: z.string(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    benefits: z.array(z.string()).optional(),
    sendfoxFormId: z.string(),
    formButtonLabel: z.string().default("Submit"),

    metaDescription: z.string().optional(),
  }),
});

export const collections = {
  "landing-pages": landingPages,
};
