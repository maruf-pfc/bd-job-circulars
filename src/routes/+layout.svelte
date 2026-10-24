<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import type { LayoutProps } from './$types';
	import { locales, localizeHref } from '#lib/paraglide/runtime.js';
	import { page } from '$app/state';
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import { buildWebSiteSchema, buildOrganizationSchema, SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '$lib/utils/seo.js';

	let { children }: LayoutProps = $props();

	const websiteSchema = buildWebSiteSchema();
	const organizationSchema = buildOrganizationSchema();
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href={favicon} />
	<!-- Base Canonical & Meta Tags -->
	<link rel="canonical" href={`${SITE_URL}${page.url.pathname}`} />
	<title>{SITE_NAME} — Official Bangladesh Job Circulars 2026</title>
	<meta name="description" content={SITE_DESCRIPTION} />
	<meta name="keywords" content="BD Job Circular, Government Job Circular 2026, BCS Circular, Bangladesh Chakrir Khobor, Teletalk Govt Job, Bank Job Circular, Ministry Jobs BD" />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={`${SITE_URL}${page.url.pathname}`} />
	<meta property="og:title" content={`${SITE_NAME} — Official Bangladesh Job Circulars 2026`} />
	<meta property="og:description" content={SITE_DESCRIPTION} />
	<meta property="og:image" content={`${SITE_URL}/og-image.png`} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:locale:alternate" content="bn_BD" />

	<!-- Twitter / X Cards -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={`${SITE_NAME} — Official Bangladesh Job Circulars 2026`} />
	<meta name="twitter:description" content={SITE_DESCRIPTION} />
	<meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
</svelte:head>

{@html `<script type="application/ld+json">${JSON.stringify(websiteSchema)}</script>`}
{@html `<script type="application/ld+json">${JSON.stringify(organizationSchema)}</script>`}


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
