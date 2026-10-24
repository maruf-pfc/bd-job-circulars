<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import type { PaginationResult } from '$lib/utils/jobs.js';

	interface Props {
		pagination: PaginationResult<unknown>;
		onPageChange: (page: number) => void;
		onPerPageChange?: (perPage: number) => void;
		showPerPageSelector?: boolean;
	}

	let {
		pagination,
		onPageChange,
		onPerPageChange,
		showPerPageSelector = true,
	}: Props = $props();

	const PER_PAGE_OPTIONS = [20, 50, 100];

	function getPageNumbers(current: number, total: number): (number | '…')[] {
		if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

		const pages: (number | '…')[] = [1];
		if (current > 3) pages.push('…');
		const start = Math.max(2, current - 1);
		const end = Math.min(total - 1, current + 1);
		for (let i = start; i <= end; i++) pages.push(i);
		if (current < total - 2) pages.push('…');
		pages.push(total);
		return pages;
	}

	const pageNumbers = $derived(
		getPageNumbers(pagination.currentPage, pagination.totalPages),
	);
</script>

<div class="flex flex-col items-center justify-between gap-4 sm:flex-row py-2">
	<!-- Result count & per-page selector -->
	<div class="flex items-center gap-3 text-xs text-slate-500">
		<span>
			Showing
			<strong class="font-semibold text-slate-800"
				>{pagination.totalItems === 0 ? 0 : (pagination.currentPage - 1) * pagination.perPage + 1}–{Math.min(
					pagination.currentPage * pagination.perPage,
					pagination.totalItems,
				)}</strong
			>
			of <strong class="font-semibold text-slate-800">{pagination.totalItems}</strong> circulars
		</span>

		{#if showPerPageSelector && onPerPageChange}
			<label class="flex items-center gap-1.5 ml-2">
				<span class="sr-only">Results per page</span>
				<select
					class="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-[#0284C7] focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
					value={pagination.perPage}
					onchange={(e) => onPerPageChange(parseInt((e.target as HTMLSelectElement).value, 10))}
					aria-label="Results per page"
				>
					{#each PER_PAGE_OPTIONS as opt}
						<option value={opt}>{opt} / page</option>
					{/each}
				</select>
			</label>
		{/if}
	</div>

	<!-- Page navigation numbers -->
	{#if pagination.totalPages > 1}
		<nav aria-label="Pagination" class="flex items-center gap-1">
			<button
				class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
				disabled={pagination.currentPage <= 1}
				onclick={() => onPageChange(pagination.currentPage - 1)}
				aria-label="Previous page"
			>
				<ChevronLeft size={16} />
			</button>

			{#each pageNumbers as p}
				{#if p === '…'}
					<span class="flex h-8 w-8 items-center justify-center text-xs text-slate-400">…</span>
				{:else}
					<button
						class="flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition-colors
						{pagination.currentPage === p
							? 'border-[#0284C7] bg-[#0284C7] text-white shadow-sm'
							: 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}"
						onclick={() => onPageChange(p as number)}
						aria-label="Page {p}"
						aria-current={pagination.currentPage === p ? 'page' : undefined}
					>
						{p}
					</button>
				{/if}
			{/each}

			<button
				class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
				disabled={pagination.currentPage >= pagination.totalPages}
				onclick={() => onPageChange(pagination.currentPage + 1)}
				aria-label="Next page"
			>
				<ChevronRight size={16} />
			</button>
		</nav>
	{/if}
</div>
