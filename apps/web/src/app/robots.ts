import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.coastcompetitions.com').replace(/\/+$/, '');

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/api/',
        '/login',
        '/register',
        '/raffles/*/success',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
