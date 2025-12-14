import { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // General crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // OpenAI ChatGPT crawler
      {
        userAgent: 'GPTBot',
        allow: '/',
        crawlDelay: 2,
      },
      // Anthropic Claude crawler
      {
        userAgent: ['ClaudeBot', 'anthropic-ai'],
        allow: '/',
        crawlDelay: 2,
      },
      // Perplexity AI crawler
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        crawlDelay: 2,
      },
      // Google's AI training crawler
      {
        userAgent: 'Google-Extended',
        allow: '/',
        crawlDelay: 2,
      },
      // Common Crawl (used by many AI models)
      {
        userAgent: 'CCBot',
        allow: '/',
        crawlDelay: 2,
      },
      // Meta AI crawler
      {
        userAgent: 'FacebookBot',
        allow: '/',
        crawlDelay: 2,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
