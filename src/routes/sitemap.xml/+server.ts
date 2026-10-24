import type { RequestHandler } from '@sveltejs/kit';
import { getAllJobs } from '$lib/utils/jobs.js';
import { SITE_URL } from '$lib/utils/seo.js';

export const GET: RequestHandler = () => {
	const jobs = getAllJobs();

	const staticRoutes = ['', '/jobs', '/jobs/government', '/jobs/corporate'];

	const jobUrls = jobs
		.filter((j) => j.slug)
		.map(
			(j) =>
				`  <url>
    <loc>${SITE_URL}/jobs/${j.slug}</loc>
    <lastmod>${j.publishedAt ?? new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
		);

	const staticUrls = staticRoutes.map(
		(path) =>
			`  <url>
    <loc>${SITE_URL}${path}</loc>
    <changefreq>daily</changefreq>
    <priority>${path === '' ? '1.0' : '0.9'}</priority>
  </url>`,
	);

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.join('\n')}
${jobUrls.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600',
		},
	});
};
