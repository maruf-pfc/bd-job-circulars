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
	import { Briefcase, Search, RotateCcw, Building2 } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	const seo = buildSeoMeta({
		title: 'Corporate & Bank Jobs Bangladesh — Private Sector & NGOs',
		description: 'Browse corporate job vacancies in Bangladesh. Find verified career opportunities in technology, banking, NGOs, telecom, and multinational companies.',
		path: '/jobs/corporate',
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
		goto(`/jobs/corporate?${sp.toString()}`, { reset: false });
	}

	function handleQueryChange(q: string) { updateUrl({ q, page: 1 }); }
	function handleFiltersChange(f: FiltersType) {
		updateUrl({
			location: f.location ?? '',
			type: f.employmentType ?? 'all',
			status: f.status ?? 'all',
			page: 1
		});
	}
	function handleSortChange(s: SortOrder) { updateUrl({ sort: s, page: 1 }); }
	function handlePageChange(p: number) { updateUrl({ page: p }); }
	function handlePerPageChange(per: number) { updateUrl({ per, page: 1 }); }
	function handleReset() { goto('/jobs/corporate'); }
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta name="keywords" content="Bank Jobs Bangladesh, Corporate Job Circular, Private Sector Jobs BD, NGO Jobs Bangladesh, Software Engineer Jobs Dhaka, Commercial Bank Recruitment" />
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
	<!-- Corporate Identity Header -->
	<div class="rounded-2xl border border-indigo-200/80 bg-gradient-to-r from-indigo-50/80 via-white to-white p-6 shadow-sm">
		<Breadcrumb items={[{ label: 'All Jobs', href: '/jobs' }, { label: 'Corporate Circulars' }]} />
		<div class="mt-4 flex flex-wrap items-center justify-between gap-4">
			<div class="flex items-start gap-3.5">
				<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm ring-4 ring-indigo-100">
					<Briefcase size={24} strokeWidth={2.2} />
				</div>
				<div>
					<div class="flex items-center gap-2">
						<h1 class="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
							Corporate & Bank Jobs
						</h1>
						<span class="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-800">
							<Building2 size={12} />
							Private Sector
						</span>
					</div>
					<p class="mt-1 text-xs text-slate-600 max-w-2xl">
						Leading commercial financial institutions, NGOs (BRAC, Grameen), telecommunication networks, software hubs, and pharmaceutical conglomerates.
					</p>
				</div>
			</div>

			<div class="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-xs font-semibold text-indigo-900 text-center min-w-[130px]">
				<div class="flex items-baseline justify-center gap-1.5">
					<span class="text-2xl font-extrabold text-indigo-800">{data.activeCount}</span>
					<span class="text-xs font-semibold text-indigo-600">/ {data.totalCount}</span>
				</div>
				<span class="text-[11px] font-semibold text-indigo-800 uppercase tracking-wide">
					Active Openings
				</span>
				<span class="block text-[10px] text-indigo-600 mt-0.5">
					({data.totalCount - data.activeCount} closed)
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
			showCategoryFilter={false}
			onQueryChange={handleQueryChange}
			onFiltersChange={handleFiltersChange}
			onSortChange={handleSortChange}
			onReset={handleReset}
		/>
	</div>

	<!-- Results List or Empty State -->
	{#if data.pagination.items.length === 0}
		<div class="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs animate-fade-up">
			<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4 animate-pulse-subtle">
				<Search size={26} />
			</div>
			<h2 class="font-heading text-base font-bold text-slate-800">
				No corporate jobs match your search
			</h2>
			<p class="mt-1.5 text-xs text-slate-500 max-w-md">
				No corporate circulars found matching these filters. Try searching for different company names or reset filters.
			</p>
			<button
				type="button"
				class="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-indigo-700 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-800 active:scale-[0.98]"
				onclick={handleReset}
			>
				<RotateCcw size={13} />
				Reset Corporate Filters
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
