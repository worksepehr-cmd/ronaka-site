// src/config/media.ts

// این متغیر بعداً با آدرس هاست دانلود پر می‌شود (مثلاً "https://cdn.ronaka.com")
const CDN_BASE_URL = ""; 

export const MEDIA = {
  hero: {
    desktop: {
      mp4: `${CDN_BASE_URL}/videos/hero-cinematic.mp4`,
      webm: `${CDN_BASE_URL}/videos/hero-cinematic.webm`,
      poster: `${CDN_BASE_URL}/videos/hero-poster.jpg`,
    },
    mobile: {
      mp4: `${CDN_BASE_URL}/videos/hero-mobile.mp4`,
      webm: `${CDN_BASE_URL}/videos/hero-mobile.webm`,
      poster: `${CDN_BASE_URL}/videos/hero-mobile-poster.jpg`,
    }
  },
  
  // 👈 لیست عکسِ لوگوی مشتریان
  clients: [
    { id: "nexus", src: `${CDN_BASE_URL}/clients/nexus.png`, alt: "Nexus" },
    { id: "apple", src: `${CDN_BASE_URL}/clients/apple.png`, alt: "Apple" },
    { id: "bmw", src: `${CDN_BASE_URL}/clients/bmw.png`, alt: "BMW" },
    // هر لوگوی جدیدی داشتی فقط اینجا اضافه می‌کنی
  ],

  // می‌توانی در آینده عکس‌های مربوط به پروژه‌ها را هم اینجا اضافه کنی
};