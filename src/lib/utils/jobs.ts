/**
 * Core job data utilities: combining, sorting, filtering, searching, pagination.
 * Never mutates the original data arrays.
 */

import { governmentJobs } from '$lib/data/government-jobs.js';
import { corporateJobs } from '$lib/data/corporate-jobs.js';
import type { Job, JobCategory, JobStatus } from '$lib/types/job.js';
import { parseDate, isDeadlinePassed, isDeadlineApproaching } from './dates.js';

// ─── Development-time validation ─────────────────────────────────────────────

function validateJobs(jobs: Job[]): void {
	const seenIds = new Set<number>();
	const seenSlugs = new Set<string>();

	for (const job of jobs) {
		if (seenIds.has(job.id)) {
			console.error(`[BD Jobs] Duplicate job ID detected: ${job.id}`);
		}
		seenIds.add(job.id);

		if (job.slug) {
			if (seenSlugs.has(job.slug)) {
				console.error(`[BD Jobs] Duplicate slug detected: "${job.slug}"`);
			}
			seenSlugs.add(job.slug);
		}

		if (job.applicationLink && !isValidUrl(job.applicationLink)) {
			console.warn(`[BD Jobs] Job ${job.id} has an invalid applicationLink: ${job.applicationLink}`);
		}

		if (job.applicationStartDate && job.applicationDeadline) {
			const start = parseDate(job.applicationStartDate);
			const end = parseDate(job.applicationDeadline);
			if (start && end && start > end) {
				console.warn(
					`[BD Jobs] Job ${job.id} has applicationStartDate after applicationDeadline.`,
				);
			}
		}
	}
}

// ─── Derived status ───────────────────────────────────────────────────────────

/**
 * Determine the effective status of a job.
 * If the application deadline has passed, the job is ALWAYS dynamically marked
 * as 'closed', even if the hardcoded database record says 'open'.
 */
export function getJobStatus(job: Job): JobStatus {
	if (job.applicationDeadline && isDeadlinePassed(job.applicationDeadline)) {
		return 'closed';
	}
	if (job.status) return job.status;
	if (job.applicationStartDate) {
		const start = parseDate(job.applicationStartDate);
		if (start && start > new Date()) return 'upcoming';
	}
	return 'open';
}

// ─── URL validation & detection ────────────────────────────────────────────────

export function isValidUrl(url: string): boolean {
	try {
		const parsed = new URL(url);
		return parsed.protocol === 'https:' || parsed.protocol === 'http:';
	} catch {
		return false;
	}
}

/**
 * Check if a URL points to a PDF document.
 */
export function isPdfUrl(url: string | undefined): boolean {
	if (!url) return false;
	try {
		const parsed = new URL(url);
		return (
			parsed.pathname.toLowerCase().endsWith('.pdf') ||
			parsed.search.toLowerCase().includes('.pdf')
		);
	} catch {
		return url.toLowerCase().endsWith('.pdf');
	}
}

// ─── All jobs combined ────────────────────────────────────────────────────────

/**
 * Returns all jobs from both data files combined.
 */
export function getAllJobs(): Job[] {
	const all = [...governmentJobs, ...corporateJobs];
	if (import.meta.env.DEV) {
		validateJobs(all);
	}
	return all;
}

// ─── Sorting ──────────────────────────────────────────────────────────────────

export type SortOrder = 'newest' | 'oldest' | 'deadline' | 'title';

/**
 * Sort jobs without mutating the input array.
 */
export function sortJobs(jobs: Job[], order: SortOrder = 'newest'): Job[] {
	const copy = [...jobs];

	switch (order) {
		case 'newest':
			return copy.sort((a, b) => {
				const da = parseDate(a.publishedAt)?.getTime() ?? 0;
				const db = parseDate(b.publishedAt)?.getTime() ?? 0;
				if (db !== da) return db - da;
				return b.id - a.id;
			});

		case 'oldest':
			return copy.sort((a, b) => {
				const da = parseDate(a.publishedAt)?.getTime() ?? Infinity;
				const db = parseDate(b.publishedAt)?.getTime() ?? Infinity;
				if (da !== db) return da - db;
				return a.id - b.id;
			});

		case 'deadline':
			return copy.sort((a, b) => {
				const da = parseDate(a.applicationDeadline)?.getTime() ?? Infinity;
				const db = parseDate(b.applicationDeadline)?.getTime() ?? Infinity;
				return da - db;
			});

		case 'title':
			return copy.sort((a, b) => {
				const ta = (a.title ?? '').toLowerCase();
				const tb = (b.title ?? '').toLowerCase();
				return ta.localeCompare(tb);
			});

		default:
			return copy;
	}
}

// ─── Filtering ────────────────────────────────────────────────────────────────

export interface JobFilters {
	category?: JobCategory | 'all';
	location?: string;
	employmentType?: string;
	status?: JobStatus | 'all';
}

/**
 * Filter a jobs array. Returns a new array; original is never mutated.
 */
export function filterJobs(jobs: Job[], filters: JobFilters): Job[] {
	return jobs.filter((job) => {
		if (filters.category && filters.category !== 'all' && job.category !== filters.category) {
			return false;
		}
		if (
			filters.location &&
			job.location &&
			!job.location.toLowerCase().includes(filters.location.toLowerCase())
		) {
			return false;
		}
		if (filters.employmentType && filters.employmentType !== 'all') {
			if (!job.employmentType || job.employmentType !== filters.employmentType) return false;
		}
		if (filters.status && filters.status !== 'all') {
			if (getJobStatus(job) !== filters.status) return false;
		}
		return true;
	});
}

// ─── Search ───────────────────────────────────────────────────────────────────

/**
 * Case-insensitive search across title, organization, description, location,
 * category, and requirements.
 */
export function searchJobs(jobs: Job[], query: string): Job[] {
	const q = query.trim().toLowerCase();
	if (!q) return jobs;

	return jobs.filter((job) => {
		const fields = [
			job.title,
			job.organization,
			job.description,
			job.location,
			job.category,
			job.salary,
			job.education,
			...(job.requirements ?? []),
		];
		return fields.some((f) => f?.toLowerCase().includes(q));
	});
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationResult<T> {
	items: T[];
	totalItems: number;
	totalPages: number;
	currentPage: number;
	perPage: number;
}

/**
 * Paginate an array. Page is 1-indexed.
 */
export function paginate<T>(
	items: T[],
	page: number,
	perPage: number,
): PaginationResult<T> {
	const totalItems = items.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
	const safePage = Math.min(Math.max(1, page), totalPages);
	const start = (safePage - 1) * perPage;
	const end = start + perPage;

	return {
		items: items.slice(start, end),
		totalItems,
		totalPages,
		currentPage: safePage,
		perPage,
	};
}

// ─── Slug lookup ──────────────────────────────────────────────────────────────

/**
 * Find a job by slug or numeric ID string.
 * Returns undefined if no match.
 */
export function findJobBySlug(slugOrId: string): Job | undefined {
	const all = getAllJobs();
	const normalized = slugOrId.trim().toLowerCase();
	// Try slug match first (exact or lowercase)
	const bySlug = all.find((j) => j.slug === slugOrId || j.slug?.toLowerCase() === normalized);
	if (bySlug) return bySlug;
	// Fall back to numeric ID match
	const numId = parseInt(slugOrId, 10);
	if (!isNaN(numId)) return all.find((j) => j.id === numId);
	return undefined;
}

/**
 * Get related jobs (same category, different id), up to `limit`.
 */
export function getRelatedJobs(job: Job, limit = 4): Job[] {
	const all = getAllJobs();
	return sortJobs(
		all.filter((j) => j.id !== job.id && j.category === job.category),
		'newest',
	).slice(0, limit);
}

/**
 * Get featured jobs across all categories.
 */
export function getFeaturedJobs(): Job[] {
	return sortJobs(
		getAllJobs().filter((j) => j.featured),
		'newest',
	);
}

/**
 * Get jobs with approaching deadlines (within N days, not yet closed).
 */
export function getUpcomingDeadlineJobs(withinDays = 14, limit = 6): Job[] {
	return getAllJobs()
		.filter((job) => {
			if (!job.applicationDeadline) return false;
			if (getJobStatus(job) === 'closed') return false;
			return isDeadlineApproaching(job.applicationDeadline, withinDays);
		})
		.sort((a, b) => {
			const da = parseDate(a.applicationDeadline)?.getTime() ?? 0;
			const db = parseDate(b.applicationDeadline)?.getTime() ?? 0;
			return da - db;
		})
		.slice(0, limit);
}

/**
 * Collect unique locations from all jobs.
 */
export function getAllLocations(): string[] {
	const locs = new Set<string>();
	getAllJobs().forEach((j) => { if (j.location) locs.add(j.location); });
	return Array.from(locs).sort();
}
