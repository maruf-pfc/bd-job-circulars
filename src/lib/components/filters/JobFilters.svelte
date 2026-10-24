<script lang="ts">
	import { Search, SlidersHorizontal, X, RotateCcw, Check } from 'lucide-svelte';
	import type { JobCategory, EmploymentType } from '$lib/types/job.js';
	import type { JobFilters, SortOrder } from '$lib/utils/jobs.js';

	interface Props {
		query: string;
		filters: JobFilters;
		sort: SortOrder;
		locations: string[];
		resultCount: number;
		showCategoryFilter?: boolean;
		onQueryChange: (q: string) => void;
		onFiltersChange: (f: JobFilters) => void;
		onSortChange: (s: SortOrder) => void;
		onReset: () => void;
	}

	let {
		query,
		filters,
		sort,
		locations,
		resultCount,
		showCategoryFilter = true,
		onQueryChange,
		onFiltersChange,
		onSortChange,
		onReset,
	}: Props = $props();

	let mobileFiltersOpen = $state(false);

	const activeFilterCount = $derived(() => {
		let count = 0;
		if (query.trim()) count++;
		if (filters.category && filters.category !== 'all') count++;
		if (filters.location && filters.location !== '') count++;
		if (filters.employmentType && filters.employmentType !== 'all') count++;
		if (filters.status && filters.status !== 'all') count++;
		if (sort !== 'newest') count++;
		return count;
	});

	const hasActiveFilters = $derived(activeFilterCount() > 0);

	const categories: { value: JobCategory | 'all'; label: string }[] = [
		{ value: 'all', label: 'All Categories' },
		{ value: 'government', label: 'Government' },
		{ value: 'corporate', label: 'Corporate' },
	];

	const employmentTypes: { value: EmploymentType | 'all'; label: string }[] = [
		{ value: 'all', label: 'All Types' },
		{ value: 'full-time', label: 'Full-time' },
		{ value: 'part-time', label: 'Part-time' },
		{ value: 'contractual', label: 'Contractual' },
		{ value: 'internship', label: 'Internship' },
	];

	const sortOptions: { value: SortOrder; label: string }[] = [
		{ value: 'newest', label: 'Newest First' },
		{ value: 'deadline', label: 'Deadline (Closing Soonest)' },
		{ value: 'title', label: 'Title (A–Z)' },
		{ value: 'oldest', label: 'Oldest First' },
	];
</script>

<div class="space-y-4">
	<!-- Search & Quick Action Bar -->
	<div class="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs">
		<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
			<!-- Search Input -->
			<div class="relative flex-1">
				<Search
					size={17}
					class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
					aria-hidden="true"
				/>
				<input
					id="job-search-input"
					type="search"
					placeholder="Search job title, organization, ministry, or degree…"
					value={query}
					oninput={(e) => onQueryChange((e.target as HTMLInputElement).value)}
					class="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-[#0284C7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
					aria-label="Search job circulars"
				/>
				{#if query}
					<button
						type="button"
						onclick={() => onQueryChange('')}
						class="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600"
						aria-label="Clear search text"
					>
						<X size={14} />
					</button>
				{/if}
			</div>

			<!-- Mobile Filter Toggle Button -->
			<div class="flex items-center gap-2 sm:hidden">
				<button
					type="button"
					onclick={() => (mobileFiltersOpen = !mobileFiltersOpen)}
					class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
					aria-expanded={mobileFiltersOpen}
					aria-label="Open filter settings"
				>
					<SlidersHorizontal size={14} />
					<span>Filters & Options</span>
					{#if activeFilterCount() > 0}
						<span class="flex h-4 w-4 items-center justify-center rounded-full bg-[#0284C7] text-[10px] font-bold text-white">
							{activeFilterCount()}
						</span>
					{/if}
				</button>

				{#if hasActiveFilters}
					<button
						type="button"
						onclick={onReset}
						class="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
						title="Reset all filters"
					>
						<RotateCcw size={13} />
						<span>Reset</span>
					</button>
				{/if}
			</div>

			<!-- Desktop Sort Dropdown -->
			<div class="hidden sm:flex items-center gap-2 shrink-0">
				<label for="desktop-sort" class="text-xs font-semibold text-slate-500 whitespace-nowrap">Sort By:</label>
				<select
					id="desktop-sort"
					value={sort}
					onchange={(e) => onSortChange((e.target as HTMLSelectElement).value as SortOrder)}
					class="rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-3 pr-8 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 focus:border-[#0284C7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 cursor-pointer"
				>
					{#each sortOptions as opt}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- Desktop Filter Controls Strip -->
		<div class="mt-3.5 hidden pt-3.5 border-t border-slate-100 sm:flex sm:flex-wrap sm:items-center sm:justify-between gap-3">
			<div class="flex flex-wrap items-center gap-2.5">
				<!-- Category Selector (when allowed) -->
				{#if showCategoryFilter}
					<div class="flex items-center gap-1">
						<label for="filter-category" class="sr-only">Category</label>
						<select
							id="filter-category"
							value={filters.category ?? 'all'}
							onchange={(e) =>
								onFiltersChange({
									...filters,
									category: (e.target as HTMLSelectElement).value as JobCategory | 'all',
								})}
							class="rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-7 text-xs font-medium text-slate-700 hover:border-slate-300 focus:border-[#0284C7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
						>
							{#each categories as cat}
								<option value={cat.value}>{cat.label}</option>
							{/each}
						</select>
					</div>
				{/if}

				<!-- Location Filter -->
				{#if locations.length > 0}
					<div class="flex items-center gap-1">
						<label for="filter-location" class="sr-only">Location</label>
						<select
							id="filter-location"
							value={filters.location ?? ''}
							onchange={(e) =>
								onFiltersChange({
									...filters,
									location: (e.target as HTMLSelectElement).value,
								})}
							class="rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-7 text-xs font-medium text-slate-700 hover:border-slate-300 focus:border-[#0284C7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
						>
							<option value="">All Locations</option>
							{#each locations as loc}
								<option value={loc}>{loc}</option>
							{/each}
						</select>
					</div>
				{/if}

				<!-- Employment Type -->
				<div class="flex items-center gap-1">
					<label for="filter-type" class="sr-only">Employment Type</label>
					<select
						id="filter-type"
						value={filters.employmentType ?? 'all'}
						onchange={(e) =>
							onFiltersChange({
								...filters,
								employmentType: (e.target as HTMLSelectElement).value,
							})}
						class="rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-7 text-xs font-medium text-slate-700 hover:border-slate-300 focus:border-[#0284C7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
					>
						{#each employmentTypes as t}
							<option value={t.value}>{t.label}</option>
						{/each}
					</select>
				</div>

				<!-- Status Filter -->
				<div class="flex items-center gap-1">
					<label for="filter-status" class="sr-only">Status</label>
					<select
						id="filter-status"
						value={filters.status ?? 'all'}
						onchange={(e) =>
							onFiltersChange({
								...filters,
								status: (e.target as HTMLSelectElement).value as any,
							})}
						class="rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-7 text-xs font-medium text-slate-700 hover:border-slate-300 focus:border-[#0284C7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
					>
						<option value="all">All Statuses</option>
						<option value="open">Active / Open Only</option>
						<option value="closed">Closed / Expired</option>
						<option value="upcoming">Upcoming</option>
					</select>
				</div>
			</div>

			<!-- Reset button & counts -->
			<div class="flex items-center gap-3">
				{#if hasActiveFilters}
					<button
						type="button"
						onclick={onReset}
						class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
					>
						<RotateCcw size={12} />
						Clear Filters
					</button>
				{/if}

				<span class="text-xs font-semibold text-slate-500">
					{resultCount} {resultCount === 1 ? 'circular' : 'circulars'} found
				</span>
			</div>
		</div>

		<!-- Mobile Collapsible Filters Panel -->
		{#if mobileFiltersOpen}
			<div class="mt-4 pt-4 border-t border-slate-200 space-y-3 sm:hidden animate-in fade-in duration-150">
				{#if showCategoryFilter}
					<div>
						<label for="mobile-filter-category" class="block text-xs font-semibold text-slate-600 mb-1">Category</label>
						<select
							id="mobile-filter-category"
							value={filters.category ?? 'all'}
							onchange={(e) =>
								onFiltersChange({
									...filters,
									category: (e.target as HTMLSelectElement).value as JobCategory | 'all',
								})}
							class="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium text-slate-800"
						>
							{#each categories as cat}
								<option value={cat.value}>{cat.label}</option>
							{/each}
						</select>
					</div>
				{/if}

				<div>
					<label for="mobile-filter-location" class="block text-xs font-semibold text-slate-600 mb-1">Location</label>
					<select
						id="mobile-filter-location"
						value={filters.location ?? ''}
						onchange={(e) =>
							onFiltersChange({
								...filters,
								location: (e.target as HTMLSelectElement).value,
							})}
						class="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium text-slate-800"
					>
						<option value="">All Locations</option>
						{#each locations as loc}
							<option value={loc}>{loc}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="mobile-filter-type" class="block text-xs font-semibold text-slate-600 mb-1">Employment Type</label>
					<select
						id="mobile-filter-type"
						value={filters.employmentType ?? 'all'}
						onchange={(e) =>
							onFiltersChange({
								...filters,
								employmentType: (e.target as HTMLSelectElement).value,
							})}
						class="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium text-slate-800"
					>
						{#each employmentTypes as t}
							<option value={t.value}>{t.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="mobile-filter-status" class="block text-xs font-semibold text-slate-600 mb-1">Status</label>
					<select
						id="mobile-filter-status"
						value={filters.status ?? 'all'}
						onchange={(e) =>
							onFiltersChange({
								...filters,
								status: (e.target as HTMLSelectElement).value as any,
							})}
						class="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium text-slate-800"
					>
						<option value="all">All Statuses</option>
						<option value="open">Active / Open Only</option>
						<option value="closed">Closed / Expired</option>
						<option value="upcoming">Upcoming</option>
					</select>
				</div>

				<div>
					<label for="mobile-sort" class="block text-xs font-semibold text-slate-600 mb-1">Sort Order</label>
					<select
						id="mobile-sort"
						value={sort}
						onchange={(e) => onSortChange((e.target as HTMLSelectElement).value as SortOrder)}
						class="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium text-slate-800"
					>
						{#each sortOptions as opt}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<div class="pt-2 flex items-center justify-between">
					<button
						type="button"
						onclick={() => (mobileFiltersOpen = false)}
						class="w-full rounded-lg bg-slate-900 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
					>
						Apply Filters ({resultCount} results)
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
