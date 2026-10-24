import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { findJobBySlug, getRelatedJobs } from '$lib/utils/jobs.js';
import { SITE_URL, buildJobPostingSchema, buildBreadcrumbSchema } from '$lib/utils/seo.js';

export const prerender = false;

export const load: PageServerLoad = ({ params }) => {
	const slug = params.slug ? decodeURIComponent(params.slug).trim() : '';
	const job = findJobBySlug(slug);

	if (!job) {
		error(404, `No job circular found for "${slug}".`);
	}

	const absoluteUrl = `${SITE_URL}/jobs/${slug}`;
	const relatedJobs = getRelatedJobs(job, 3);

	const jobSchema = buildJobPostingSchema(job, absoluteUrl);
	const breadcrumbSchema = buildBreadcrumbSchema([
		{ name: 'Home', url: SITE_URL },
		{ name: 'All Jobs', url: `${SITE_URL}/jobs` },
		{
			name: job.category === 'government' ? 'Government Jobs' : 'Corporate Jobs',
			url: `${SITE_URL}/jobs/${job.category}`,
		},
		{ name: job.title ?? 'Job Detail', url: absoluteUrl },
	]);

	return {
		job,
		relatedJobs,
		absoluteUrl,
		jobSchema,
		breadcrumbSchema,
	};
};
