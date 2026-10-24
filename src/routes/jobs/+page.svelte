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
	{#if seo.canonical}<link rel="canonical" href={seo.canonical} />{/if}
	<meta property="og:title" content={seo.ogTitle} />
	<meta property="og:description" content={seo.ogDescription} />
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
	<!-- Page Header & Breadcrumbs -->
	<div class="border-b border-slate-200 pb-5">
		<Breadcrumb items={[{ label: 'All Job Circulars' }]} />
		<div class="mt-3 flex flex-wrap items-baseline justify-between gap-2">
			<div>
				<h1 class="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
					All Job Circulars
				</h1>
				<p class="mt-1 text-xs text-slate-500">
					Explore verified government gazettes, autonomous agency notices, and private recruitment circulars.
				</p>
			</div>
			<div class="rounded-full bg-slate-100 px-3.5 py-1 text-xs font-semibold text-slate-700">
				{data.activeCount} Active • {data.totalCount} Total Circulars
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
		<div class="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
			<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-4">
				<Search size={24} />
			</div>
			<h2 class="font-heading text-base font-bold text-slate-800">
				No job circulars match your criteria
			</h2>
			<p class="mt-1.5 text-xs text-slate-500 max-w-md">
				We couldn't find any notices matching your query. Try broadening your keywords, changing the location, or resetting filters.
			</p>
			<button
				type="button"
				class="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
				onclick={handleReset}
			>
				<RotateCcw size={13} />
				Reset All Filters
			</button>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
			{#each data.pagination.items as job (job.id)}
				<JobCard {job} />
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
