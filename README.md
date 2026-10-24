# Bangladesh Job Circulars Portal (BD Job Circulars)

A modern, fast, responsive job circulars portal for Bangladesh built with **SvelteKit (Svelte 5 runes)**, **TypeScript**, and **Tailwind CSS**.

The site publishes government and corporate job circulars in Bangladesh with zero database overhead — all circular data is maintained in two straightforward TypeScript data files.

---

## 🌟 Key Features

1. **Dual Circular Management**:
   - Government jobs database: [`src/lib/data/government-jobs.ts`](file:///home/maruf/Documents/Hobby%20Projects/Frontend/bd-job-circulars/src/lib/data/government-jobs.ts)
   - Corporate jobs database: [`src/lib/data/corporate-jobs.ts`](file:///home/maruf/Documents/Hobby%20Projects/Frontend/bd-job-circulars/src/lib/data/corporate-jobs.ts)

2. **Inline Scrollable PDF Circular Notice**:
   - For government (and corporate) circulars with official notice PDFs (e.g. `https://tax6.teletalk.com.bd/docs/TAX620261018.pdf`), users can view and scroll through the official circular notice directly inside the web page.
   - Includes controls to open in a new tab, direct download, and fullscreen expand toggle.

3. **Dynamic Deadline Expiry**:
   - If the application deadline passes, the system **automatically and dynamically labels the circular as closed** (with red badge, deadline passed warning, and disabled application link), even if the hardcoded status was left as `open`.

4. **Search, Filter & Sort**:
   - Instant client-side & URL-driven query filtering by keyword, category (Government / Corporate), location, employment type, and status.
   - Sort by Newest, Closing Soonest, Oldest, or Alphabetical.

5. **SEO & Structured Data**:
   - Dynamic meta tags, OpenGraph preview cards, Twitter cards, and canonical URLs.
   - Automated Google-compliant `JobPosting` and `BreadcrumbList` schema JSON-LD injection on detail pages.
   - Dynamic `sitemap.xml` and standard `robots.txt` endpoints.

---

## 📁 How Site Owners Manage Job Circulars

All job data lives exclusively in two files:
- [src/lib/data/government-jobs.ts](file:///home/maruf/Documents/Hobby%20Projects/Frontend/bd-job-circulars/src/lib/data/government-jobs.ts)
- [src/lib/data/corporate-jobs.ts](file:///home/maruf/Documents/Hobby%20Projects/Frontend/bd-job-circulars/src/lib/data/corporate-jobs.ts)

### Adding a New Circular
1. Open the relevant file (`government-jobs.ts` or `corporate-jobs.ts`).
2. Check the highest `id` across both files and increment by 1 (e.g. `id: 9`).
3. Add the record at the **top** of the array so it appears as the newest entry.
4. Add the fields you have (all fields except `id` and `category` are optional).
5. If you have an official PDF notice, set `officialNoticeLink: 'https://example.com/notice.pdf'` — the website will automatically render an inline scrollable PDF viewer!

```ts
{
  id: 9,
  slug: 'officer-cash-sonali-bank-2026',
  title: 'Officer (Cash)',
  organization: 'Sonali Bank PLC',
  category: 'government',
  employmentType: 'full-time',
  location: 'Nationwide, Bangladesh',
  vacancies: 500,
  salary: 'Grade 10 (BDT 16,000–38,640)',
  applicationDeadline: '2026-12-15',
  publishedAt: '2026-10-24',
  applicationLink: 'https://erecruitment.bb.org.bd',
  officialNoticeLink: 'https://tax6.teletalk.com.bd/docs/TAX620261018.pdf',
  featured: true,
  status: 'open'
}
```

### Closing a Circular
- **Automatic**: Simply let the `applicationDeadline` date pass. The website automatically marks it as closed.
- **Manual**: Set `status: 'closed'` on the object.

---

## 🛠️ Development & Commands

```bash
# Start development server
pnpm dev

# Type check with SvelteKit & TypeScript
pnpm check

# Run unit tests
pnpm vitest run --project server

# Build for production
pnpm build

# Preview production build
pnpm preview
```
