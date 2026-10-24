/**
 * SEO utilities: page metadata, Open Graph, structured data.
 */

export const SITE_NAME = 'BD Job Circulars';
export const SITE_DESCRIPTION =
	'Find the latest government and corporate job circulars in Bangladesh. Search thousands of opportunities and apply today.';
export const SITE_URL = 'https://bdjobcirculars.com';

export interface SeoMeta {
	title: string;
	description: string;
	canonical?: string;
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: string;
	ogType?: string;
}

/**
 * Build consistent SEO metadata for a page.
 */
export function buildSeoMeta(options: {
	title: string;
	description: string;
	path?: string;
	ogImage?: string;
	ogType?: string;
}): SeoMeta {
	const fullTitle =
		options.title === SITE_NAME ? SITE_NAME : `${options.title} — ${SITE_NAME}`;

	return {
		title: fullTitle,
		description: options.description.slice(0, 160),
		canonical: options.path ? `${SITE_URL}${options.path}` : undefined,
		ogTitle: fullTitle,
		ogDescription: options.description.slice(0, 200),
		ogImage: options.ogImage ?? `${SITE_URL}/og-image.png`,
		ogType: options.ogType ?? 'website',
	};
}

import type { Job } from '$lib/types/job.js';
import { getJobStatus } from './jobs.js';
import { parseDate } from './dates.js';

/**
 * Map internal employment type to schema.org values.
 */
function toSchemaEmploymentType(type: string | undefined): string | undefined {
	const map: Record<string, string> = {
		'full-time': 'FULL_TIME',
		'part-time': 'PART_TIME',
		contractual: 'CONTRACTOR',
		internship: 'INTERN',
		other: 'OTHER',
	};
	return type ? map[type] : undefined;
}

/**
 * Build a JobPosting JSON-LD object for a job.
 * Only includes properties that have real data.
 * Returns null if the job doesn't meet minimum requirements.
 */
export function buildJobPostingSchema(job: Job, absoluteUrl: string): object | null {
	// Minimum required fields for a valid JobPosting
	if (!job.title || !job.organization || !job.publishedAt || !job.description) {
		return null;
	}

	const status = getJobStatus(job);
	// Don't emit schema for closed jobs implying they're hiring
	if (status === 'closed') return null;

	const schema: Record<string, unknown> = {
		'@context': 'https://schema.org',
		'@type': 'JobPosting',
		title: job.title,
		description: job.description,
		datePosted: parseDate(job.publishedAt)?.toISOString().split('T')[0],
		hiringOrganization: {
			'@type': 'Organization',
			name: job.organization,
		},
		url: absoluteUrl,
		directApply: !!job.applicationLink,
	};

	if (job.applicationDeadline) {
		const d = parseDate(job.applicationDeadline);
		if (d) schema.validThrough = d.toISOString().split('T')[0];
	}

	if (job.location) {
		schema.jobLocation = {
			'@type': 'Place',
			address: {
				'@type': 'PostalAddress',
				addressLocality: job.location,
				addressCountry: 'BD',
			},
		};
	}

	const empType = toSchemaEmploymentType(job.employmentType);
	if (empType) schema.employmentType = empType;

	if (job.vacancies) schema.totalJobOpenings = job.vacancies;

	return schema;
}

/**
 * Build breadcrumb JSON-LD.
 */
export function buildBreadcrumbSchema(
	items: Array<{ name: string; url: string }>,
): object {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	};
}

/**
 * Build WebSite JSON-LD.
 */
export function buildWebSiteSchema(): object {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE_NAME,
		url: SITE_URL,
		description: SITE_DESCRIPTION,
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: `${SITE_URL}/jobs?q={search_term_string}`,
			},
			'query-input': 'required name=search_term_string',
		},
	};
}
