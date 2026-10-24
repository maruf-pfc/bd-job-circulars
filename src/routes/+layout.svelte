<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import type { LayoutProps } from './$types';
	import { locales, localizeHref } from '#lib/paraglide/runtime.js';
	import { page } from '$app/state';
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import { buildWebSiteSchema, SITE_NAME, SITE_DESCRIPTION } from '$lib/utils/seo.js';

	let { children }: LayoutProps = $props();

	const websiteSchema = buildWebSiteSchema();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<!-- Default meta — individual pages override these -->
	<title>{SITE_NAME}</title>
	<meta name="description" content={SITE_DESCRIPTION} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:type" content="website" />
</svelte:head>

{@html `<script type="application/ld+json">${JSON.stringify(websiteSchema)}</script>`}

<div class="flex min-h-dvh flex-col">
	<Header />
	<main id="main-content" class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>

<!-- Hidden locale links for paraglide (SEO / alternate hreflang) -->
<div style="display:none" aria-hidden="true">
	{#each locales as locale (locale)}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>
