import type { Handle, HandleServerError } from '@sveltejs/kit/hooks';
import { getTextDirection } from '#lib/paraglide/runtime.js';
import { paraglideMiddleware } from '#lib/paraglide/server.js';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		return resolve(
			{ ...event, request },
			{
				transformPageChunk: ({ html }) =>
					html
						.replace('%paraglide.lang%', locale)
						.replace('%paraglide.dir%', getTextDirection(locale)),
			},
		);
	});

export const handle: Handle = handleParaglide;

export const handleError: HandleServerError = ({ error, event }) => {
	const errObj = error as any;
	console.error('[SVELTEKIT SERVER ERROR]', event.url.pathname, errObj);
	return {
		message: errObj?.message || 'Internal Error',
	};
};
