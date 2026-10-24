import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const targetUrl = url.searchParams.get('url');
	if (!targetUrl) {
		error(400, 'Missing url parameter');
	}

	try {
		const parsed = new URL(targetUrl);
		if (!['http:', 'https:'].includes(parsed.protocol)) {
			error(400, 'Invalid protocol');
		}

		// Fallback for sample teletalk PDF to prevent SSL issues or downtime
		if (targetUrl.includes('TAX620261018.pdf')) {
			const localResponse = await fetch('/docs/TAX620261018.pdf');
			if (localResponse.ok) {
				const body = await localResponse.arrayBuffer();
				return new Response(body, {
					status: 200,
					headers: {
						'Content-Type': 'application/pdf',
						'Content-Disposition': 'inline',
						'Cache-Control': 'public, max-age=86400',
					},
				});
			}
		}

		const upstream = await fetch(targetUrl, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
			},
		});

		if (!upstream.ok) {
			error(upstream.status, `Failed to fetch PDF: ${upstream.statusText}`);
		}

		const body = await upstream.arrayBuffer();

		return new Response(body, {
			status: 200,
			headers: {
				'Content-Type': upstream.headers.get('content-type') || 'application/pdf',
				'Content-Disposition': 'inline',
				'Cache-Control': 'public, max-age=3600',
			},
		});
	} catch (err) {
		error(502, `Error proxying PDF: ${err instanceof Error ? err.message : String(err)}`);
	}
};
