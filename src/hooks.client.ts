import type { HandleClientError } from '@sveltejs/kit/hooks';

export const handleError: HandleClientError = ({ error, event }) => {
	const errObj = error as any;
	console.error('[SVELTEKIT CLIENT ERROR]', event.url.pathname, errObj);
	return {
		message: errObj?.message || 'Internal Client Error',
	};
};
