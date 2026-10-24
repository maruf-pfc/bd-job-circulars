import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import https from 'node:https';
import http from 'node:http';
import { Readable } from 'node:stream';

export const GET: RequestHandler = async ({ url }) => {
	const targetUrl = url.searchParams.get('url');
	if (!targetUrl) {
		error(400, 'Missing "url" query parameter.');
	}

	let parsed: URL;
	try {
		parsed = new URL(targetUrl);
		if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
			error(400, 'Invalid URL protocol.');
		}
	} catch {
		error(400, 'Malformed URL.');
	}

	const client = parsed.protocol === 'https:' ? https : http;

	return new Promise((resolve) => {
		const req = client.get(
			targetUrl,
			{
				rejectUnauthorized: false,
				headers: {
					'User-Agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
					Accept: '*/*',
				},
			},
			(res) => {
				// Handle HTTP redirects (301, 302, 307, 308)
				if (
					res.statusCode &&
					res.statusCode >= 300 &&
					res.statusCode < 400 &&
					res.headers.location
				) {
					const redirectUrl = new URL(res.headers.location, targetUrl).toString();
					resolve(
						new Response(null, {
							status: 302,
							headers: { Location: `/api/proxy?url=${encodeURIComponent(redirectUrl)}` },
						}),
					);
					res.resume();
					return;
				}

				if (!res.statusCode || res.statusCode >= 400) {
					res.resume();
					resolve(
						new Response(`Failed to load target content (Status: ${res.statusCode})`, {
							status: res.statusCode || 502,
						}),
					);
					return;
				}

				const contentType = res.headers['content-type'] || 'application/octet-stream';
				const responseHeaders = new Headers();
				responseHeaders.set('Content-Type', contentType);
				responseHeaders.set('Content-Disposition', 'inline');
				responseHeaders.set('Cache-Control', 'public, max-age=3600');
				// Allow this site to frame it, while preventing clickjacking from external origins
				responseHeaders.set('X-Frame-Options', 'SAMEORIGIN');

				if (contentType.includes('text/html')) {
					// For HTML, inject <base> so relative assets load from origin
					let htmlData = '';
					res.setEncoding('utf-8');
					res.on('data', (chunk) => {
						htmlData += chunk;
					});
					res.on('end', () => {
						const origin = `${parsed.protocol}//${parsed.host}`;
						let modifiedHtml = htmlData;
						if (modifiedHtml.includes('<head>')) {
							modifiedHtml = modifiedHtml.replace(
								'<head>',
								`<head><base href="${origin}/">`,
							);
						} else if (modifiedHtml.includes('<HEAD>')) {
							modifiedHtml = modifiedHtml.replace(
								'<HEAD>',
								`<HEAD><base href="${origin}/">`,
							);
						}
						resolve(
							new Response(modifiedHtml, {
								status: 200,
								headers: responseHeaders,
							}),
						);
					});
				} else {
					// For PDFs, documents, images, stream directly
					const stream = Readable.toWeb(res) as ReadableStream;
					resolve(
						new Response(stream, {
							status: 200,
							headers: responseHeaders,
						}),
					);
				}
			},
		);

		req.on('error', (err) => {
			resolve(
				new Response(`Error proxying target: ${err.message}`, {
					status: 502,
				}),
			);
		});
	});
};
