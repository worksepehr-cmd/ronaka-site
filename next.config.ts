import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // غیرفعال کردن هدر پیش‌فرض برای امنیت بیشتر
  poweredByHeader: false,
  
  // تنظیمات تصاویر برای اجازه دادن به لود از CDN ها و سورس‌های خارجی
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // 👈 چون در پورتفولیو از عکس‌های unsplash استفاده کرده بودی
      },
      // بعداً دامنه CDN ابری خودت (مثل لیارا یا آروان) را هم اینجا اضافه می‌کنیم
      // { protocol: 'https', hostname: 'cdn.ronaka.com' },
    ],
  },

  // تزریق هدرهای امنیتی به تمام صفحات سایت
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN' // جلوگیری از باز شدن سایت در iframe سایت‌های دیگر
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};

export default nextConfig;