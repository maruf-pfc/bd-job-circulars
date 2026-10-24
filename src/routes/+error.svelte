<script lang="ts">
	import { Home, Search, ArrowLeft } from 'lucide-svelte';
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Page Not Found — BD Job Circulars</title>
	<meta name="description" content="The job circular or page you are looking for could not be found." />
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
	<div class="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-sky-50 text-[#0284C7] ring-1 ring-sky-200">
		<span class="font-heading text-3xl font-extrabold">404</span>
	</div>

	<h1 class="font-heading mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">
		Circular or Page Not Found
	</h1>
	<p class="mb-2 max-w-md text-xs sm:text-sm text-slate-600">
		{#if page.error?.message}
			{page.error.message}
		{:else}
			The job notice you requested may have been archived or the URL has changed.
		{/if}
	</p>
	<p class="mb-8 text-xs text-slate-400">
		Attempted path: <code class="rounded bg-slate-100 px-1.5 py-0.5 text-slate-700">{page.url.pathname}</code>
	</p>

	<div class="flex flex-wrap justify-center gap-3">
		<a
			href="/"
			class="inline-flex items-center gap-2 rounded-xl bg-[#0284C7] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0369A1]"
		>
			<Home size={14} /> Go to Homepage
		</a>
		<a
			href="/jobs"
			class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
		>
			<Search size={14} /> Browse All Circulars
		</a>
		<button
			type="button"
			class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
			onclick={() => history.back()}
		>
			<ArrowLeft size={14} /> Go Back
		</button>
	</div>
</div>
