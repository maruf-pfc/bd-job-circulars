<script lang="ts">
	import { FileText, Download, ExternalLink, Maximize2, Minimize2, ShieldAlert, Globe } from 'lucide-svelte';
	import { isPdfUrl } from '$lib/utils/jobs.js';

	interface Props {
		pdfUrl: string;
		title?: string;
		organization?: string;
	}

	let { pdfUrl, title, organization }: Props = $props();

	let isExpanded = $state(false);

	const isPdf = $derived(isPdfUrl(pdfUrl));

	const computedTitle = $derived(
		title || (isPdf ? 'Official Circular Notice (PDF)' : 'Official Notice & Application Portal')
	);

	const viewerSrc = $derived(
		isPdf && (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://'))
			? `/api/pdf-proxy?url=${encodeURIComponent(pdfUrl)}`
			: pdfUrl,
	);

	function toggleExpand() {
		isExpanded = !isExpanded;
	}
</script>

<section
	class="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 {isExpanded
		? 'fixed inset-4 z-50 flex flex-col rounded-2xl shadow-2xl bg-white'
		: ''}"
	aria-labelledby="pdf-notice-heading"
>
	<!-- Header Bar -->
	<div
		class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-5 py-3.5 rounded-t-xl"
	>
		<div class="flex items-center gap-3">
			<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200">
				{#if isPdf}
					<FileText size={18} />
				{:else}
					<Globe size={18} />
				{/if}
			</div>
			<div>
				<h2 id="pdf-notice-heading" class="font-heading text-sm font-bold text-slate-900">
					{computedTitle}
				</h2>
				{#if organization}
					<p class="text-xs text-slate-500">{organization}</p>
				{/if}
			</div>
		</div>

		<!-- Action buttons -->
		<div class="flex items-center gap-2">
			<a
				href={pdfUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
				title="Open notice in new tab"
			>
				<ExternalLink size={13} />
				<span class="hidden sm:inline">Open in New Tab</span>
			</a>

			{#if isPdf}
				<a
					href={pdfUrl}
					download
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-1.5 rounded-lg bg-[#0284C7] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0369A1]"
					title="Download PDF Notice"
				>
					<Download size={13} />
					<span class="hidden sm:inline">Download PDF</span>
				</a>
			{/if}

			<button
				type="button"
				onclick={toggleExpand}
				class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
				aria-label={isExpanded ? 'Minimize PDF viewer' : 'Expand PDF viewer to full screen'}
				title={isExpanded ? 'Minimize viewer' : 'Expand full view'}
			>
				{#if isExpanded}
					<Minimize2 size={15} />
				{:else}
					<Maximize2 size={15} />
				{/if}
			</button>
		</div>
	</div>

	<!-- Scrollable PDF Viewport -->
	<div class="relative w-full overflow-hidden bg-slate-100 {isExpanded ? 'flex-1' : 'h-[750px]'}">
		<iframe
			src={viewerSrc}
			title="{title} — PDF Document"
			class="h-full w-full border-0"
			loading="lazy"
		>
			<div class="p-8 text-center bg-white flex flex-col items-center justify-center h-full">
				<ShieldAlert size={36} class="text-slate-400 mb-3" />
				<p class="text-sm font-semibold text-slate-800 mb-1">
					Official Notice PDF Document
				</p>
				<p class="text-xs text-slate-500 mb-4 max-w-md">
					If your browser disables inline PDF rendering for external government servers, you can view or download the authentic file directly.
				</p>
				<a
					href={pdfUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 rounded-lg bg-[#0284C7] px-4 py-2 text-xs font-semibold text-white"
				>
					<Download size={13} />
					Open Official Notice PDF
				</a>
			</div>
		</iframe>
	</div>

	<!-- Helpful Footer Note -->
	<div class="border-t border-slate-200 bg-slate-50/50 px-5 py-2.5 text-xs text-slate-500 rounded-b-xl flex flex-wrap items-center justify-between gap-2">
		<span class="flex items-center gap-1.5">
			<span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
			Official Government Gazette / Circular Notice. Scroll inside to read all pages.
		</span>
		<a
			href={pdfUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="text-[#0284C7] hover:underline font-medium"
		>
			Direct Document URL
		</a>
	</div>
</section>
