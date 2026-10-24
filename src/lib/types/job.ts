/**
 * Job category - government or corporate.
 */
export type JobCategory = 'government' | 'corporate';

/**
 * Job employment type.
 */
export type EmploymentType = 'full-time' | 'part-time' | 'contractual' | 'internship' | 'other';

/**
 * Job status.
 */
export type JobStatus = 'open' | 'closed' | 'upcoming';

/**
 * Core job interface. Every field except `id` and `category` is optional,
 * allowing site owners to publish partial circulars without placeholder values.
 *
 * ### How to add a new circular
 * 1. Open the relevant file: `src/lib/data/government-jobs.ts` or `src/lib/data/corporate-jobs.ts`.
 * 2. Find the current highest `id` across **both** files.
 * 3. Add your new record with `id = highestId + 1`.
 * 4. Set `publishedAt` to today's date ('DD-MM-YYYY', e.g. `"24-10-2026"`).
 * 5. Fill in as many fields as you have; leave the rest out entirely.
 * 6. Save and the site will pick it up automatically.
 *
 * ### How to remove a circular
 * Delete the record from the array. Do **not** reuse its `id`.
 *
 * ### How to close a circular
 * Either set `status: 'closed'` explicitly, or let the deadline pass — the
 * site derives closure from `applicationDeadline` automatically.
 */
export interface Job {
	/** Unique positive integer. Never reuse after deletion. */
	id: number;
	/** URL-friendly slug, e.g. "senior-engineer-brac-2026". Used in `/jobs/[slug]`. */
	slug?: string;
	/** Job title shown on cards and detail pages. */
	title?: string;
	/** Employer or recruiting organisation name. */
	organization?: string;
	/** Government or corporate classification. Required by the UI. */
	category: JobCategory;
	/** Employment type. */
	employmentType?: EmploymentType;
	/** City, district, or "Bangladesh" for nationwide roles. */
	location?: string;
	/** Number of available positions. */
	vacancies?: number;
	/** Salary description or BDT range, e.g. "BDT 30,000–50,000/month". */
	salary?: string;
	/** Required educational qualifications. */
	education?: string;
	/** Required work experience. */
	experience?: string;
	/** Age limits, e.g. "18–30 years". */
	ageLimit?: string;
	/** Date when applications open in 'DD-MM-YYYY' format, e.g. "01-11-2026". */
	applicationStartDate?: string;
	/** Date of the last application day in 'DD-MM-YYYY' format, e.g. "30-11-2026". */
	applicationDeadline?: string;
	/** Date when this circular was published in 'DD-MM-YYYY' format, e.g. "24-10-2026". */
	publishedAt?: string;
	/** Short description shown on listing cards. */
	description?: string;
	/** Array of responsibility bullet points. */
	responsibilities?: string[];
	/** Eligibility and qualification requirements. */
	requirements?: string[];
	/** Step-by-step instructions for how to apply. */
	applicationInstructions?: string;
	/** External application URL. Must be a valid HTTPS URL. */
	applicationLink?: string;
	/** URL to the official PDF or circular notice. */
	officialNoticeLink?: string;
	/** Source organisation or publication name. */
	sourceName?: string;
	/** Official contact email address. */
	contactEmail?: string;
	/** Whether to feature this circular on the homepage. */
	featured?: boolean;
	/** Explicit status override. Derived from deadline when absent. */
	status?: JobStatus;
}
