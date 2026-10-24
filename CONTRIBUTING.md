# Contributing to BD Job Circulars

Thank you for your interest in contributing to **BD Job Circulars**! This is an open-source initiative dedicated to providing fast, tracker-free, and verified official government gazettes, BCS announcements, and corporate career notices for job seekers in Bangladesh.

---

## 📌 Ways to Contribute

You can contribute to this project in several ways:
1. **Adding New Circulars**: Submitting verified government or corporate notices to `src/lib/data/government-jobs.ts` or `src/lib/data/corporate-jobs.ts`.
2. **Feature Enhancements**: Improving UI/UX, animations, search filters, or accessibility.
3. **Localization (i18n)**: Adding or refining Bengali (`bn-bd`) and English (`en-us`) translations in `messages/`.
4. **Bug Reports & Fixes**: Reporting broken links, proxy issues, or layout bugs.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v22 or higher (v24 recommended)
- **Package Manager**: `pnpm` (v9+)
- **Git**

### 2. Fork & Clone
```bash
git clone https://github.com/maruf-pfc/bd-job-circulars.git
cd bd-job-circulars
pnpm install
```

### 3. Local Development
```bash
# Run dev server with hot reload
pnpm dev

# Type check
pnpm check

# Run tests
pnpm vitest run --project server

# Build for production
pnpm build
```

---

## 📝 Adding Job Circular Data (Zero-Database Architecture)

All job circulars are stored in **exactly two TypeScript files**:
- Government Notices: [`src/lib/data/government-jobs.ts`](file:///home/maruf/Documents/Hobby%20Projects/Frontend/bd-job-circulars/src/lib/data/government-jobs.ts)
- Corporate & Bank Notices: [`src/lib/data/corporate-jobs.ts`](file:///home/maruf/Documents/Hobby%20Projects/Frontend/bd-job-circulars/src/lib/data/corporate-jobs.ts)

### Data Guidelines:
1. **Dates**: Use `DD-MM-YYYY` format (e.g., `'15-11-2026'`).
2. **ID**: Ensure `id` is unique across both files.
3. **Official Notice Link**: Provide official Teletalk or department webpage URL (e.g., `https://tax6.teletalk.com.bd`).
4. **Formatting**: Multiline text in `description` or `applicationInstructions` is fully supported using standard template string newlines.

---

## 🌐 Adding & Updating Translations (i18n)

This project uses **Inlang Paraglide JS** for compile-time type-safe internationalization.

- English messages: `messages/en-us.json`
- Bengali messages: `messages/bn-bd.json`

After adding new translation keys, recompile with:
```bash
pnpm exec paraglide-js compile --project ./project.inlang --outdir ./src/lib/paraglide
```

---

## 🧪 Quality Standards & Pull Request Checklist

Before submitting a Pull Request, please ensure:
- [ ] `pnpm check` passes with **0 errors and 0 warnings**.
- [ ] `pnpm vitest run --project server` passes all unit tests.
- [ ] `pnpm build` completes successfully.
- [ ] Your code adheres to existing formatting conventions (`prettier`).
- [ ] Commit messages are descriptive (e.g., `feat: add NTRCA teacher circular 2026`).

---

## 📜 Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free experience for everyone. Please be respectful and constructive in all discussions, issues, and code reviews.

---

## 📄 License

This project is open-source under the **GPL-3.0 License**.
