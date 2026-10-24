<script lang="ts">
	import { ExternalLink, Maximize2, Minimize2, Globe, Loader2 } from 'lucide-svelte';

	interface Props {
		noticeUrl: string;
		title?: string;
		organization?: string;
	}

	let { noticeUrl, title, organization }: Props = $props();

	let isExpanded = $state(false);
	let isLoading = $state(true);

	const computedTitle = $derived(title || 'Official Notice & Application Portal');

	const viewerSrc = $derived(
		noticeUrl.startsWith('http://') || noticeUrl.startsWith('https://')
			? `/api/proxy?url=${encodeURIComponent(noticeUrl)}`
			: noticeUrl,
	);

	function toggleExpand() {
		isExpanded = !isExpanded;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isExpanded) {
			isExpanded = false;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Fullscreen backdrop -->
{#if isExpanded}
	<div
		class="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
		onclick={toggleExpand}
		aria-hidden="true"
	></div>
{/if}

<section
	class="mt-8 rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-200 {isExpanded
		? 'fixed inset-3 sm:inset-6 z-50 flex flex-col rounded-2xl shadow-2xl bg-white border-slate-300'
		: ''}"
	aria-labelledby="web-notice-heading"
>
	<!-- Header Bar -->
	<div
		class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/90 px-5 py-3.5 rounded-t-2xl"
	>
		<div class="flex items-center gap-3">
			<div
				class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
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
				class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
				title="Open notice webpage in new tab"
			>
				<ExternalLink size={13} />
				<span class="hidden sm:inline">Open in New Tab</span>
			</a>

			<button
				type="button"
				onclick={toggleExpand}
				class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-1.5 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
				aria-label={isExpanded ? 'Minimize webpage viewer (Esc)' : 'Expand webpage viewer to full screen'}
				title={isExpanded ? 'Minimize viewer (Esc)' : 'Expand full view'}
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
	<div class="relative w-full overflow-hidden bg-slate-100 {isExpanded ? 'flex-1' : 'h-[750px]'}">
		{#if isLoading}
			<div class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-xs">
				<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md border border-slate-200">
					<Loader2 size={24} class="animate-spin text-[#0284C7]" />
				</div>
				<p class="mt-3 text-xs font-semibold text-slate-700">Connecting to official circular portal...</p>
				<p class="text-[11px] text-slate-400 mt-0.5">Streaming document from publisher server</p>
			</div>
		{/if}

		<iframe
			src={viewerSrc}
			title="{computedTitle} — Embedded Webpage"
			class="h-full w-full border-0 bg-white"
			loading="lazy"
			allow="fullscreen"
			onload={() => (isLoading = false)}
		></iframe>
	</div>

	<!-- Helpful Footer Note -->
	<div
		class="border-t border-slate-200 bg-slate-50/60 px-5 py-2.5 text-xs text-slate-500 rounded-b-2xl flex flex-wrap items-center justify-between gap-2"
	>
		<span class="flex items-center gap-1.5">
			<span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
			Official Circular Webpage. You can interact and scroll inside the frame.
		</span>
		<a
			href={noticeUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="text-emerald-700 hover:underline font-semibold inline-flex items-center gap-1"
		>
			<span>Direct Webpage URL</span>
			<ExternalLink size={11} />
		</a>
	</div>
</section>

