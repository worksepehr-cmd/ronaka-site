import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // آدرس اصلی سایت
  const baseUrl = 'https://ronakastudio.ir';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1, // بالاترین اولویت برای صفحه اصلی
    },
    // در آینده وقتی صفحات زیر را ساختی، این‌ها هم به نقشه اضافه می‌شوند
    {
      url: `${baseUrl}/portfolio/cinematic`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}