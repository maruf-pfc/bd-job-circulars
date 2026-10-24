<script lang="ts">
	import { ChevronRight, Home } from 'lucide-svelte';

	interface BreadcrumbItem {
		label: string;
		href?: string;
	}

	interface Props {
		items: BreadcrumbItem[];
	}

	let { items }: Props = $props();
</script>

<nav aria-label="Breadcrumbs" class="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
	<a href="/" class="flex items-center gap-1 transition-colors hover:text-[#0284C7] focus:outline-none focus:underline">
		<Home size={13} class="text-slate-400" />
		<span>Home</span>
	</a>
	{#each items as item}
		<ChevronRight size={12} class="shrink-0 text-slate-300" aria-hidden="true" />
		{#if item.href}
			<a href={item.href} class="transition-colors hover:text-[#0284C7] focus:outline-none focus:underline font-medium">
				{item.label}
			</a>
		{:else}
			<span class="font-semibold text-slate-900 truncate max-w-[240px] sm:max-w-none" aria-current="page">
				{item.label}
			</span>
		{/if}
	{/each}
</nav>
