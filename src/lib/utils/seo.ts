/**
 * SEO utilities: page metadata, Open Graph, structured data.
 */

export const SITE_NAME = 'BD Job Circulars';
export const SITE_DESCRIPTION =
	'Discover official Bangladesh government job circulars, BCS gazettes, 2026 ministry notices, state bank recruitments, and corporate vacancies. Verified circulars with live application portals.';
export const SITE_URL = 'https://bd-job-circulars.vercel.app';

export interface SeoMeta {
	title: string;
	description: string;
	canonical?: string;
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: string;
	ogType?: string;
	ogUrl?: string;
	twitterCard?: 'summary' | 'summary_large_image';
	keywords?: string;
}

/**
 * Build consistent, search-engine-optimized metadata for a page.
 */
export function buildSeoMeta(options: {
	title: string;
	description: string;
	path?: string;
	ogImage?: string;
	ogType?: string;
	keywords?: string;
}): SeoMeta {
	const fullTitle =
		options.title === SITE_NAME ? `${SITE_NAME} — Official Bangladesh Job Circulars 2026` : `${options.title} — ${SITE_NAME}`;

	const canonicalUrl = options.path ? `${SITE_URL}${options.path}` : SITE_URL;

	return {
		title: fullTitle,
		description: options.description.slice(0, 160),
		canonical: canonicalUrl,
		ogTitle: fullTitle,
		ogDescription: options.description.slice(0, 200),
		ogImage: options.ogImage ?? `${SITE_URL}/og-image.png`,
		ogType: options.ogType ?? 'website',
		ogUrl: canonicalUrl,
		twitterCard: 'summary_large_image',
		keywords:
			options.keywords ??
			'BD Job Circular, Government Job Circular 2026, BCS Circular, Bangladesh Chakrir Khobor, Teletalk Govt Job, Bank Job Circular, Ministry Jobs BD, Bangladesh Career Notice',
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

/**
 * Build Organization JSON-LD for rich brand knowledge graph snippets.
 */
export function buildOrganizationSchema(): object {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: SITE_NAME,
		url: SITE_URL,
		logo: `${SITE_URL}/favicon.svg`,
		image: `${SITE_URL}/og-image.png`,
		sameAs: [
			'https://bpsc.gov.bd',
			'http://www.teletalk.com.bd',
			'https://erecruitment.bb.org.bd',
		],
		description: SITE_DESCRIPTION,
		areaServed: {
			'@type': 'Country',
			name: 'Bangladesh',
		},
	};
}

