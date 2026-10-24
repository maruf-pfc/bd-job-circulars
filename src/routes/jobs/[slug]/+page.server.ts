import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { findJobBySlug, getRelatedJobs } from '$lib/utils/jobs.js';
import { SITE_URL, buildJobPostingSchema, buildBreadcrumbSchema } from '$lib/utils/seo.js';
import { getJobViews, incrementJobViews } from '$lib/server/views.js';

export const prerender = false;

export const load: PageServerLoad = ({ params, cookies }) => {
	const slug = params.slug ? decodeURIComponent(params.slug).trim() : '';
	const job = findJobBySlug(slug);

	if (!job) {
		error(404, `No job circular found for "${slug}".`);
	}

	const viewKey = job.slug ?? String(job.id);
	const cookieName = `v_${viewKey.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 24)}`;

	let views = getJobViews(viewKey);
	if (!cookies.get(cookieName)) {
		views = incrementJobViews(viewKey);
		cookies.set(cookieName, '1', {
			path: '/',
			maxAge: 60 * 60 * 12, // 12h visitor session
			httpOnly: true,
			sameSite: 'lax',
		});
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
		views,
	};
};

