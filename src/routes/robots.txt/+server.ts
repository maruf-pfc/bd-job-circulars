import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = () => {
	const body = `User-agent: *
Allow: /

Sitemap: https://bdjobcirculars.com/sitemap.xml
`;
	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'max-age=3600',
		},
	});
};
