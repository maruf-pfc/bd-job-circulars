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
	import { Landmark, Search, RotateCcw, ShieldCheck } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	const seo = buildSeoMeta({
		title: 'Government Job Circulars Bangladesh — BCS, Ministries, Defence & Health',
		description: 'Browse authentic government job circulars in Bangladesh including BCS, state banks, primary & secondary teaching, police, and healthcare recruitment.',
		path: '/jobs/government',
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
		goto(`/jobs/government?${sp.toString()}`, { reset: false });
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
	function handleReset() { goto('/jobs/government'); }
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	{#if seo.canonical}<link rel="canonical" href={seo.canonical} />{/if}
	<meta property="og:title" content={seo.ogTitle} />
	<meta property="og:description" content={seo.ogDescription} />
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
	<!-- Government Identity Header -->
	<div class="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/80 via-white to-white p-6 shadow-sm">
		<Breadcrumb items={[{ label: 'All Jobs', href: '/jobs' }, { label: 'Government Circulars' }]} />
		<div class="mt-4 flex flex-wrap items-center justify-between gap-4">
			<div class="flex items-start gap-3.5">
				<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-100">
					<Landmark size={24} strokeWidth={2.2} />
				</div>
				<div>
					<div class="flex items-center gap-2">
						<h1 class="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
							Government Job Circulars
						</h1>
						<span class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
							<ShieldCheck size={12} />
							Verified Gazettes
						</span>
					</div>
					<p class="mt-1 text-xs text-slate-600 max-w-2xl">
						BCS Cadres, Ministries, Public Service Commission (BPSC), Bangladesh Police, DGHS, NTRCA, and autonomous state bodies.
					</p>
				</div>
			</div>

			<div class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-900 text-center min-w-[130px]">
				<div class="flex items-baseline justify-center gap-1.5">
					<span class="text-2xl font-extrabold text-emerald-800">{data.activeCount}</span>
					<span class="text-xs font-semibold text-emerald-600">/ {data.totalCount}</span>
				</div>
				<span class="text-[11px] font-semibold text-emerald-800 uppercase tracking-wide">
					Active Notices
				</span>
				<span class="block text-[10px] text-emerald-600 mt-0.5">
					({data.totalCount - data.activeCount} expired)
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
			<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4 animate-pulse-subtle">
				<Search size={26} />
			</div>
			<h2 class="font-heading text-base font-bold text-slate-800">
				No government circulars match your search
			</h2>
			<p class="mt-1.5 text-xs text-slate-500 max-w-md">
				No active government job circulars found for these parameters. Try clearing your filters or changing search keywords.
			</p>
			<button
				type="button"
				class="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-800 active:scale-[0.98]"
				onclick={handleReset}
			>
				<RotateCcw size={13} />
				Reset Government Filters
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
