# BD Job Circulars (বাংলাদেশ জব সার্কুলার)

[![CI Quality Pipeline](https://github.com/maruf-pfc/bd-job-circulars/actions/workflows/ci.yml/badge.svg)](https://github.com/maruf-pfc/bd-job-circulars/actions/workflows/ci.yml)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](LICENSE)
[![Framework: Svelte 5](https://img.shields.io/badge/Svelte-5.x%20(Runes)-FF3E00.svg)](https://svelte.dev)
[![i18n: Paraglide](https://img.shields.io/badge/i18n-Paraglide%20JS-10B981.svg)](https://inlang.com)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-black.svg)](https://bd-job-circulars.vercel.app/)

A modern, high-performance, open-source portal for official government gazettes, BCS announcements, state-owned bank vacancies, and verified corporate job circulars in Bangladesh.

**🌐 Live Portal:** [https://bd-job-circulars.vercel.app/](https://bd-job-circulars.vercel.app/)

---

## 🌟 Key Features

1. **Dual Data Architecture (Zero-Database Overhead)**:
   - All circular data is stored in **exactly two** strongly typed files:
     - [`src/lib/data/government-jobs.ts`](file:///home/maruf/Documents/Hobby%20Projects/Frontend/bd-job-circulars/src/lib/data/government-jobs.ts) (Ministries, BPSC, Police, DGHS, NTRCA)
     - [`src/lib/data/corporate-jobs.ts`](file:///home/maruf/Documents/Hobby%20Projects/Frontend/bd-job-circulars/src/lib/data/corporate-jobs.ts) (Commercial Banks, NGOs, Tech, Enterprises)

2. **Accurate Real-Time Visitor Tracking**:
   - Each job post displays verified visitor reader counts (`readers viewed this circular`), tracked server-side with deduplicated visitor sessions.

3. **Embedded Web Notice Viewer**:
   - Streams official publisher notices (e.g., Teletalk government portals) directly inside the circular dossier via a secure, unblocking proxy (`/api/proxy`).
   - Supports fullscreen modal reading (`Esc` shortcut) and direct external launch.

4. **Bilingual Localization (i18n)**:
   - Full support for both **English** (`en-us`) and **Bengali** (`bn-bd`) powered by Inlang Paraglide JS with an instant language switcher in the navigation bar.

5. **Search Engine & Social Media Optimization**:
   - 100% Google for Jobs compliant JSON-LD (`JobPosting`, `WebSite`, `Organization`, `BreadcrumbList`).
   - Dynamic Open Graph social sharing cards: sharing circular URLs displays rich preview cards and redirects readers directly to this portal.
   - W3C Datetime compliant dynamic `sitemap.xml` and structured `robots.txt`.

6. **Automated Expiry & Real-Time Alerts**:
   - Circulars dynamically update their status to `closed` as soon as their deadline (`DD-MM-YYYY`) passes.

---

## 📁 Data Entry Guide (For Maintainers & Contributors)

To publish a new job notice, edit **only one** of these two files:
- `src/lib/data/government-jobs.ts`
- `src/lib/data/corporate-jobs.ts`

### Schema Specification:
```ts
{
  id: 2,
  slug: 'primary-assistant-teacher-circular-2026',
  title: 'Assistant Teacher Recruitment 2026',
  organization: 'Directorate of Primary Education (DPE)',
  category: 'government',
  employmentType: 'full-time',
  location: 'Nationwide, Bangladesh',
  vacancies: 6531,
  salary: 'National Pay Scale 2015 (Grade 13)',
  applicationStartDate: '01-11-2026',
  applicationDeadline: '30-11-2026',
  publishedAt: '24-10-2026',
  education: 'Graduation / Equivalent degree from an approved university.',
  ageLimit: '21 to 30 years (32 years for quota candidates)',
  applicationLink: 'http://dpe.teletalk.com.bd',
  officialNoticeLink: 'http://dpe.teletalk.com.bd',
  featured: true,
  status: 'open',
  description: `Detailed position description.
Multiple lines and paragraphs are automatically preserved.`,
  applicationInstructions: `1. Visit official Teletalk portal.
2. Complete online application form.
3. Pay fee via Teletalk prepaid SIM within 72 hours.`
}
```

> [!NOTE]
> All dates must use the standard **`DD-MM-YYYY`** format.

---

## 🛠️ Local Development & Scripts

```bash
# Clone the repository
git clone https://github.com/maruf-pfc/bd-job-circulars.git
cd bd-job-circulars

# Install dependencies with pnpm
pnpm install

# Start local development server (http://localhost:5173)
pnpm dev

# Compile translations (Paraglide)
pnpm exec paraglide-js compile --project ./project.inlang --outdir ./src/lib/paraglide

# Typecheck with SvelteKit & TypeScript
pnpm check

# Run unit & server tests
pnpm vitest run --project server

# Build for production
pnpm build

# Preview production build locally
pnpm preview
```

---

## 🤝 Open Source Contributions

We welcome contributions from the community! Whether you want to add new circular notices, enhance UI/UX design, or improve translations, please see our [**Contributing Guide**](CONTRIBUTING.md) for PR submission standards and workflows.

---

## 📄 License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
