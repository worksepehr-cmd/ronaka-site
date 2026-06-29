import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // مسیرهایی که نمی‌خواهیم گوگل ایندکس کند را اینجا می‌بندیم
      disallow: ['/api/', '/_next/', '/private/'], 
    },
    sitemap: 'https://ronakastudio.ir/sitemap.xml',
  };
}