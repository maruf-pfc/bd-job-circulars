import type { RequestHandler } from '@sveltejs/kit';
import { SITE_URL } from '$lib/utils/seo.js';

export const GET: RequestHandler = () => {
	const body = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
Host: ${SITE_URL}
`;
	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'max-age=3600',
		},
	});
};

