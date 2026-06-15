// 1. Import utilities from `astro:content`
import { defineCollection } from 'astro:content';
import yaml from 'js-yaml';
import fs from 'fs';
import { glob } from 'astro/loaders';

import { loadBlogroll } from './js/loadBlogroll.js';
import { z } from 'astro/zod';

// 1. Posts collection

const posts = defineCollection({
    loader: glob({ pattern: "**/*.(md|mdx)", base: "./src/content/posts" }),
    schema: ({ image }) => z.object({
        status: z.preprocess((val) => val === null ? undefined : val, z.enum(['published', 'draft']).default('draft')),
        title: z.preprocess((val) => val === null ? undefined : val, z.string().default('Post title')),
        description: z.preprocess((val) => val === null ? undefined : val, z.string().default('Post description')),
        pubDate: z.preprocess((val) => val === null ? undefined : val, z.date().default(new Date('2025-01-01'))),
        author: z.preprocess((val) => val === null ? undefined : val, z.string().default('Anonymous')),
        tags: z.preprocess((val) => val === null ? undefined : val, z.array(z.string()).default(['tag'])),

        cover: z.object({
            title: z.string().optional(),
            src: z.string().optional(),
            alt: z.string().optional()
        }).optional()

    }),
});

// 2. Blogroll collection

const blogRolls = defineCollection({
    loader: async () => {
        const blogRollsConfigFile = './src/data/blogrolls.yaml';

        let yamlObject;

        try {
            const fileContents = fs.readFileSync(blogRollsConfigFile, 'utf8');
            yamlObject = yaml.load(fileContents);
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                throw new Error(`Config file not found at path: ${blogRollsConfigFile}` );
            } else if (error.name === 'YAMLException') {
                throw new Error (`Invalid YAML syntax in ${blogRollsConfigFile}: ${error.message}`);
            } else {
                throw new Error( `An unexpected error occurred: ${error.message}` );
            }
        }

        if (!yamlObject) {
            throw new Error( `Blogroll YAML is invalid` );
        }

        const BlogRollSourceSchema = z.array(z.object({
            category: z.string(),
            urls: z.array(z.string().url())
        }));

        const blogRollObject = BlogRollSourceSchema.parse(yamlObject);

        const allBlogRollUrls = blogRollObject.flatMap( blogroll => 
            blogroll.urls.map(url => {
                return {category: blogroll.category, url: url}
            })
        )
        const blogRoll = await loadBlogroll(allBlogRollUrls);
        
        return blogRoll;

    },
    schema: z.object({
        category: z.string(),
        blogTitle: z.string(),
        title: z.string(),
        link: z.string(),
        description: z.string().optional(),
        pubDate: z.string()
    })
})

// 4. Export a single `collections` object to register your collection(s)
export const collections = { posts, blogRolls };

