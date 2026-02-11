export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-6xl px-6 py-20">
        {/* Top bar */}
        <header className="flex items-center justify-between">
          <div className="text-sm tracking-[0.35em] uppercase text-white/70">
            RONAKA
          </div>
          <a
            href="#contact"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/90 hover:border-white/40"
          >
            همکاری
          </a>
        </header>

        {/* Hero */}
        <section className="mt-16 grid gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
              نوری برای مدیای شما
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
              تولید ویدیوهای High-End با ترکیب خلاقیت، موشن و سیستم‌های هوشمند.
              خروجی تمیز، سریع و قابل اتکا برای برندهایی که معمولی نمی‌خوان.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#work"
                className="rounded-full bg-white px-6 py-3 text-center text-sm font-medium text-black hover:bg-white/90"
              >
                دیدن نمونه‌کارها
              </a>
              <a
                href="#contact"
                className="rounded-full border border-white/20 px-6 py-3 text-center text-sm font-medium text-white hover:border-white/40"
              >
                شروع همکاری
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-3 text-xs text-white/50">
              <span className="rounded-full border border-white/10 px-3 py-1">
                AI Video
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1">
                Hybrid Editing
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1">
                Motion Design
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1">
                Creative Automation
              </span>
            </div>
          </div>

          {/* Preview Card (placeholder for video later) */}
          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.10),transparent_55%)]" />

              <div className="relative flex h-full flex-col justify-between p-6">
                <div className="text-xs tracking-[0.3em] uppercase text-white/60">
                  Featured Reel
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
                  اینجا بعداً ویدیوی Reel یا یک تصویر شاخص میاد (با لینک از هاست
                  ویدیو).
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sections anchors */}
        <section id="work" className="mt-24">
          <h2 className="text-xl font-semibold">نمونه‌کارها</h2>
          <p className="mt-3 text-white/60">
            فعلاً این بخش اسکلتشه. بعداً پروژه‌ها رو اینجا لیست می‌کنیم.
          </p>
        </section>

        <section id="contact" className="mt-20 border-t border-white/10 pt-10">
          <h2 className="text-xl font-semibold">شروع همکاری</h2>
          <p className="mt-3 text-white/60">
            برای همکاری، پیام بده:{" "}
            <span className="text-white/90">work.sepehr@gmail.com</span>
          </p>
        </section>

        <footer className="mt-16 text-xs text-white/40">
          © {new Date().getFullYear()} RONAKA
        </footer>
      </main>
    </div>
  );
}
