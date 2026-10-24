<script lang="ts">
	import { goto } from '$app/navigation';
	import { page as pageState } from '$app/state';
	import JobCard from '$lib/components/jobs/JobCard.svelte';
	import JobFilters from '$lib/components/filters/JobFilters.svelte';
	import Pagination from '$lib/components/pagination/Pagination.svelte';
	import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
	import { buildSeoMeta } from '$lib/utils/seo.js';
	import type { PageData } from './$types';
	import type { JobFilters as FiltersType, SortOrder } from '$lib/utils/jobs.js';
	import { Search, RotateCcw } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	const seo = buildSeoMeta({
		title: 'All Job Circulars in Bangladesh — Government & Corporate',
		description: 'Browse all government and corporate job circulars in Bangladesh. Filter by ministry, location, employment type, and live application deadlines.',
		path: '/jobs',
	});

	function updateUrl(params: Record<string, string | number>) {
		const sp = new URLSearchParams(pageState.url.searchParams.toString());
		for (const [k, v] of Object.entries(params)) {
			if (v === '' || v === 'all' || v === 'newest' || v === 0) {
				sp.delete(k);
			} else {
				sp.set(k, String(v));
			}
		}
		goto(`/jobs?${sp.toString()}`, { reset: false });
	}

	function handleQueryChange(q: string) {
		updateUrl({ q, page: 1 });
	}

	function handleFiltersChange(f: FiltersType) {
		updateUrl({
			category: f.category ?? 'all',
			location: f.location ?? '',
			type: f.employmentType ?? 'all',
			status: f.status ?? 'all',
			page: 1,
		});
	}

	function handleSortChange(s: SortOrder) {
		updateUrl({ sort: s, page: 1 });
	}

	function handlePageChange(p: number) {
		updateUrl({ page: p });
	}

	function handlePerPageChange(per: number) {
		updateUrl({ per, page: 1 });
	}

	function handleReset() {
		goto('/jobs');
	}
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta name="keywords" content={seo.keywords} />
	{#if seo.canonical}<link rel="canonical" href={seo.canonical} />{/if}
	<meta property="og:title" content={seo.ogTitle} />
	<meta property="og:description" content={seo.ogDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={seo.ogUrl} />
	<meta property="og:image" content={seo.ogImage} />
	<meta name="twitter:card" content={seo.twitterCard} />
	<meta name="twitter:title" content={seo.ogTitle} />
	<meta name="twitter:description" content={seo.ogDescription} />
	<meta name="twitter:image" content={seo.ogImage} />
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
	<!-- Page Header & Breadcrumbs -->
	<div class="rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50/80 via-white to-white p-6 shadow-xs">
		<Breadcrumb items={[{ label: 'All Job Circulars' }]} />
		<div class="mt-4 flex flex-wrap items-center justify-between gap-4">
			<div>
				<div class="flex items-center gap-2">
					<h1 class="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
						All Job Circulars
					</h1>
					<span class="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-800">
						Directory
					</span>
				</div>
				<p class="mt-1 text-xs text-slate-600 max-w-2xl">
					Explore verified government gazettes, autonomous agency notices, and private recruitment circulars across Bangladesh.
				</p>
			</div>

			<div class="rounded-xl border border-sky-200/80 bg-white px-4 py-2 text-xs font-semibold text-sky-900 shadow-2xs text-center">
				<div class="flex items-baseline justify-center gap-1.5">
					<span class="text-2xl font-extrabold text-sky-700">{data.activeCount}</span>
					<span class="text-xs font-semibold text-slate-500">/ {data.totalCount}</span>
				</div>
				<span class="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
					Active Circulars
				</span>
			</div>
		</div>
	</div>

	<!-- Filter Controls -->
	<div>
		<JobFilters
			query={data.q}
			filters={data.filters}
			sort={data.sort}
			locations={data.locations}
			resultCount={data.pagination.totalItems}
			onQueryChange={handleQueryChange}
			onFiltersChange={handleFiltersChange}
			onSortChange={handleSortChange}
			onReset={handleReset}
		/>
	</div>

	<!-- Results List or Empathetic Empty State -->
	{#if data.pagination.items.length === 0}
		<div class="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs animate-fade-up">
			<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4 animate-pulse-subtle">
				<Search size={26} />
			</div>
			<h2 class="font-heading text-base font-bold text-slate-800">
				No job circulars match your criteria
			</h2>
			<p class="mt-1.5 text-xs text-slate-500 max-w-md">
				We couldn't find any notices matching your query. Try broadening your keywords, changing the location, or resetting filters.
			</p>
			<button
				type="button"
				class="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800 active:scale-[0.98]"
				onclick={handleReset}
			>
				<RotateCcw size={13} />
				Reset All Filters
			</button>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
			{#each data.pagination.items as job, i (job.id)}
				<div class="animate-fade-up stagger-{(i % 6) + 1}">
					<JobCard {job} />
				</div>
			{/each}
		</div>

		<!-- Pagination Footer -->
		<div class="pt-4 border-t border-slate-200">
			<Pagination
				pagination={data.pagination}
				onPageChange={handlePageChange}
				onPerPageChange={handlePerPageChange}
			/>
		</div>
	{/if}
</div>
