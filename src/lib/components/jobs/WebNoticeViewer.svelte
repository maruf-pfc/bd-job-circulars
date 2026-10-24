<script lang="ts">
	import { ExternalLink, Maximize2, Minimize2, Globe } from 'lucide-svelte';

	interface Props {
		noticeUrl: string;
		title?: string;
		organization?: string;
	}

	let { noticeUrl, title, organization }: Props = $props();

	let isExpanded = $state(false);

	const computedTitle = $derived(title || 'Official Notice & Application Portal');

	const viewerSrc = $derived(
		noticeUrl.startsWith('http://') || noticeUrl.startsWith('https://')
			? `/api/proxy?url=${encodeURIComponent(noticeUrl)}`
			: noticeUrl,
	);

	function toggleExpand() {
		isExpanded = !isExpanded;
	}
</script>

<section
	class="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 {isExpanded
		? 'fixed inset-4 z-50 flex flex-col rounded-2xl shadow-2xl bg-white'
		: ''}"
	aria-labelledby="web-notice-heading"
>
	<!-- Header Bar -->
	<div
		class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-5 py-3.5 rounded-t-xl"
	>
		<div class="flex items-center gap-3">
			<div
				class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
			>
				<Globe size={18} />
			</div>
			<div>
				<h2 id="web-notice-heading" class="font-heading text-sm font-bold text-slate-900">
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
				href={noticeUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 shadow-sm"
				title="Open notice webpage in new tab"
			>
				<ExternalLink size={13} />
				<span class="hidden sm:inline">Open in New Tab</span>
			</a>

			<button
				type="button"
				onclick={toggleExpand}
				class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 shadow-sm"
				aria-label={isExpanded ? 'Minimize webpage viewer' : 'Expand webpage viewer to full screen'}
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

	<!-- Scrollable Webpage Viewport via iframe -->
	<div class="relative w-full overflow-hidden bg-slate-50 {isExpanded ? 'flex-1' : 'h-[750px]'}">
		<iframe
			src={viewerSrc}
			title="{computedTitle} — Embedded Webpage"
			class="h-full w-full border-0 bg-white"
			loading="lazy"
			allow="fullscreen"
		></iframe>
	</div>

	<!-- Helpful Footer Note -->
	<div
		class="border-t border-slate-200 bg-slate-50/50 px-5 py-2.5 text-xs text-slate-500 rounded-b-xl flex flex-wrap items-center justify-between gap-2"
	>
		<span class="flex items-center gap-1.5">
			<span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
			Official Circular Webpage. You can interact and scroll inside the frame.
		</span>
		<a
			href={noticeUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="text-emerald-700 hover:underline font-medium inline-flex items-center gap-1"
		>
			<span>Direct Webpage URL</span>
			<ExternalLink size={11} />
		</a>
	</div>
</section>
