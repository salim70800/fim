# منصة البث العربية - سينماتك

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/cinematech)

منصة بث عربية متكاملة لمشاهدة الأفلام والمسلسلات والأنمي بجودة عالية.

---

## المميزات

- واجهة عربية كاملة مع دعم RTL
- تصميم responsive لجميع الأجهزة
- نظام بحث متقدم
- صفحات تفصيلية للمحتوى
- دعم PWA مع offline mode
- SEO محسّن بالكامل
- Core Web Vitals ممتازة
- Service Worker للأداء
- Lazy Loading للصفحات
- تكامل كامل مع Supabase

---

## التقنيات المستخدمة

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite 6
- **Styling:** TailwindCSS
- **UI Components:** Radix UI
- **Icons:** Lucide React
- **Routing:** React Router v6
- **Backend:** Supabase
- **Database:** PostgreSQL (via Supabase)
- **Deployment:** Vercel

---

## البدء السريع

### المتطلبات

- Node.js 18+
- pnpm 8+

### التثبيت

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/cinematech.git

# Navigate to project
cd cinematech

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Edit .env with your Supabase credentials

# Run development server
pnpm dev
```

الموقع سيعمل على: http://localhost:5173

---

## البناء للإنتاج

```bash
# Build for production
pnpm run build:prod

# Preview production build
pnpm preview
```

---

## النشر على Vercel

### الطريقة 1: من Dashboard

1. Fork هذا المشروع
2. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
3. انقر "Add New Project"
4. اختر repository
5. أضف Environment Variables
6. Deploy

### الطريقة 2: من CLI

```bash
# Install Vercel CLI
pnpm install -g vercel

# Deploy
vercel
```

للدليل الشامل، راجع: [دليل النشر على Vercel](docs/دليل-النشر-على-Vercel.md)

---

## Environment Variables

أنشئ ملف `.env` في المجلد الرئيسي:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
BUILD_MODE=prod
```

---

## هيكل المشروع

```
streaming-platform/
├── public/              # Static assets
│   ├── sw.js           # Service Worker
│   ├── manifest.json   # PWA Manifest
│   └── robots.txt      # SEO
├── src/
│   ├── components/     # React components
│   │   ├── layout/    # Layout components
│   │   └── ui/        # UI components
│   ├── pages/         # Page components
│   ├── lib/           # Utilities & configs
│   └── types/         # TypeScript types
├── docs/              # Documentation
├── vercel.json        # Vercel configuration
└── vite.config.ts     # Vite configuration
```

---

## Scripts المتاحة

```bash
# Development
pnpm dev              # Start dev server

# Production Build
pnpm build            # Build for production
pnpm build:prod       # Build with optimizations

# Preview
pnpm preview          # Preview production build

# Linting
pnpm lint             # Run ESLint

# Clean
pnpm clean            # Clean dependencies
```

---

## التوثيق

- [دليل النشر على Vercel](docs/دليل-النشر-على-Vercel.md)
- [ملخص النشر السريع](docs/ملخص-النشر-السريع.md)
- [دليل تكوين DNS](docs/دليل-تكوين-DNS.md)
- [تقرير تحسينات SEO](docs/تقرير-تحسينات-SEO-الشاملة.md)
- [تقرير نظام Sitemaps](docs/تقرير-نظام-Sitemaps-المتطور.md)
- [تقرير تحسين الأداء](docs/تقرير-تحسين-الأداء-والسرعة.md)

---

## المميزات التقنية

### SEO
- Meta tags محسّنة (عربي/إنجليزي)
- Schema.org markup (Movie, TVSeries, Episode)
- Open Graph & Twitter Cards
- Sitemap ديناميكي
- robots.txt محسّن

### Performance
- Code Splitting
- Lazy Loading
- Image Optimization
- Service Worker Caching
- Bundle Size: < 300KB
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

### Security
- HTTPS فقط
- Security Headers
- XSS Protection
- CSRF Protection
- Content Security Policy

---

## المساهمة

المساهمات مرحب بها! يرجى:

1. Fork المشروع
2. إنشاء branch للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add AmazingFeature'`)
4. Push إلى Branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

---

## الترخيص

هذا المشروع مرخص تحت MIT License.

---

## التواصل

للأسئلة أو الدعم:

- البريد الإلكتروني: support@cinematech.com
- الموقع: https://cinematech.com

---

## الشكر

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/)
- [Radix UI](https://www.radix-ui.com/)

---

**تم التطوير بواسطة MiniMax Agent**  
**الإصدار:** 2.1.0  
**التاريخ:** 2025-10-25
