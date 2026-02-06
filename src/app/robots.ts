import { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // General crawlers (Google, Bing, etc.)
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/'],
      },

      // OpenAI crawler
      {
        userAgent: 'GPTBot',
        allow: '/',
      },

      // Anthropic crawler
      {
        userAgent: ['ClaudeBot', 'anthropic-ai'],
        allow: '/',
      },

      // Perplexity crawler
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },

      // Google AI training crawler
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },

      // Common Crawl
      {
        userAgent: 'CCBot',
        allow: '/',
      },

      // Facebook / Meta preview crawler
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
