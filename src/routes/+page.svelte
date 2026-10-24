<script lang="ts">
	import { Search, Landmark, Briefcase, ArrowRight, Clock, Star, ShieldCheck, CheckCircle2 } from 'lucide-svelte';
	import JobCard from '$lib/components/jobs/JobCard.svelte';
	import { getAllJobs, sortJobs, getFeaturedJobs, getUpcomingDeadlineJobs, getJobStatus } from '$lib/utils/jobs.js';
	import { buildSeoMeta, SITE_NAME, SITE_DESCRIPTION } from '$lib/utils/seo.js';
	import type { JobCategory } from '$lib/types/job.js';

	const allJobs = getAllJobs();
	const activeJobs = allJobs.filter((j) => getJobStatus(j) === 'open');
	const latestJobs = sortJobs(allJobs, 'newest').slice(0, 6);
	const featuredJobs = getFeaturedJobs().slice(0, 3);
	const upcomingDeadlines = getUpcomingDeadlineJobs(14, 4);

	const governmentJobsList = allJobs.filter((j) => j.category === 'government');
	const corporateJobsList = allJobs.filter((j) => j.category === 'corporate');
	const activeGovernmentCount = governmentJobsList.filter((j) => getJobStatus(j) === 'open').length;
	const activeCorporateCount = corporateJobsList.filter((j) => getJobStatus(j) === 'open').length;

	const seo = buildSeoMeta({
		title: 'BD Job Circulars — Official Bangladesh Government & Corporate Career Notices',
		description: SITE_DESCRIPTION,
		path: '/',
	});

	let searchQuery = $state('');
	let selectedCategory = $state<'all' | JobCategory>('all');

	function handleSearch(e: SubmitEvent) {
		e.preventDefault();
		const params = new URLSearchParams();
		if (searchQuery.trim()) params.set('q', searchQuery.trim());
		if (selectedCategory !== 'all') params.set('category', selectedCategory);
		window.location.href = `/jobs?${params.toString()}`;
	}
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta name="keywords" content={seo.keywords} />
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

<!-- ── Editorial Hero ──────────────────────────────────────────────────────── -->
<section class="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-sky-50/50 via-white to-slate-50/50 py-12 sm:py-16">
	<!-- Ambient Background Blur Glows -->
	<div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-gradient-to-r from-sky-400/10 via-emerald-400/10 to-indigo-400/10 blur-3xl rounded-full" aria-hidden="true"></div>

	<div class="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
		<!-- Live Notice Pill -->
		<div class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 backdrop-blur-xs px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-xs mb-5 transition-transform hover:scale-105">
			<span class="relative flex h-2 w-2">
				<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
				<span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
			</span>
			<span>{activeJobs.length} Active Circulars ({allJobs.length} Total)</span>
			<span class="text-slate-300">•</span>
			<span class="text-slate-500">Updated Daily</span>
		</div>

		<!-- Main Editorial Headline -->
		<h1 class="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl max-w-3xl mx-auto leading-[1.15]">
			Bangladesh Official Career & Recruitment Circulars
		</h1>

		<!-- Subtitle -->
		<p class="mt-4 text-base text-slate-600 sm:text-lg max-w-2xl mx-auto leading-relaxed">
			Discover verified government gazettes, BCS announcements, state-owned bank vacancies, and top corporate job circulars with live official circular portals.
		</p>

		<!-- Multi-Field Integrated Search Bar -->
		<form
			onsubmit={handleSearch}
			class="mt-8 mx-auto max-w-2xl rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-sm focus-within:border-[#0284C7] focus-within:ring-4 focus-within:ring-[#0284C7]/15 transition-all duration-200"
			role="search"
			aria-label="Find circulars"
		>
			<div class="flex flex-col sm:flex-row gap-2">
				<!-- Search Keyword -->
				<div class="relative flex-1">
					<Search size={18} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
					<input
						type="search"
						id="hero-search-input"
						placeholder="Job title, ministry, organization, or qualification…"
						bind:value={searchQuery}
						class="w-full rounded-xl border-0 bg-transparent py-3 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0"
						aria-label="Search keywords"
					/>
				</div>

				<!-- Category Select -->
				<div class="sm:border-l sm:border-slate-200 sm:pl-2 flex items-center">
					<label for="hero-category-select" class="sr-only">Category</label>
					<select
						id="hero-category-select"
						bind:value={selectedCategory}
						class="w-full sm:w-auto rounded-xl border-0 bg-transparent py-3 pl-3 pr-8 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-0 cursor-pointer"
					>
						<option value="all">All Categories</option>
						<option value="government">Government Only</option>
						<option value="corporate">Corporate Only</option>
					</select>
				</div>

				<!-- Search Submit Button -->
				<button
					type="submit"
					class="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0369A1] px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:shadow-md hover:brightness-105 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#0284C7]"
				>
					<span>Search</span>
					<ArrowRight size={14} class="transition-transform duration-150 group-hover:translate-x-0.5" />
				</button>
			</div>
		</form>

		<!-- Trending Circular Tags -->
		<div class="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
			<span class="font-semibold text-slate-400">Popular:</span>
			<a href="/jobs?q=BCS" class="rounded-lg border border-slate-200 bg-white/80 px-2.5 py-1 text-slate-700 hover:border-sky-300 hover:text-[#0284C7] hover:bg-sky-50/50 transition-all shadow-2xs">
				BCS Cadre
			</a>
			<a href="/jobs?q=Tax" class="rounded-lg border border-slate-200 bg-white/80 px-2.5 py-1 text-slate-700 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all shadow-2xs">
				Taxes Zone
			</a>
			<a href="/jobs?q=Police" class="rounded-lg border border-slate-200 bg-white/80 px-2.5 py-1 text-slate-700 hover:border-sky-300 hover:text-[#0284C7] hover:bg-sky-50/50 transition-all shadow-2xs">
				Police SI
			</a>
			<a href="/jobs?q=Teacher" class="rounded-lg border border-slate-200 bg-white/80 px-2.5 py-1 text-slate-700 hover:border-sky-300 hover:text-[#0284C7] hover:bg-sky-50/50 transition-all shadow-2xs">
				NTRCA Teacher
			</a>
			<a href="/jobs?q=Officer" class="rounded-lg border border-slate-200 bg-white/80 px-2.5 py-1 text-slate-700 hover:border-sky-300 hover:text-[#0284C7] hover:bg-sky-50/50 transition-all shadow-2xs">
				Bank Officer
			</a>
			<a href="/jobs?q=Engineer" class="rounded-lg border border-slate-200 bg-white/80 px-2.5 py-1 text-slate-700 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50/50 transition-all shadow-2xs">
				Software Engineer
			</a>
		</div>
	</div>
</section>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
	<!-- ── Category Pathways ────────────────────────────────────────────────── -->
	<section aria-labelledby="pathways-heading">
		<h2 id="pathways-heading" class="sr-only">Browse by Sector</h2>
		<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
			<!-- Government Pathway -->
			<a
				href="/jobs/government"
				class="group card-interactive relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-white to-emerald-50/30 p-6 sm:p-7 shadow-xs hover:border-emerald-300 hover:shadow-lg"
			>
				<div>
					<div class="flex items-center justify-between mb-4">
						<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200">
							<Landmark size={22} strokeWidth={2.2} />
						</div>
						<span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
							{activeGovernmentCount} Active • {governmentJobsList.length} Total
						</span>
					</div>
					<h3 class="font-heading text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
						Government Job Circulars
					</h3>
					<p class="mt-2 text-xs leading-relaxed text-slate-600">
						Ministries, BPSC, Bangladesh Police, DGHS, NTRCA, Directorate departments, and public autonomous bodies with official gazette notices.
					</p>
				</div>
				<div class="mt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
					<span>Browse all government vacancies</span>
					<ArrowRight size={13} class="transition-transform duration-150 group-hover:translate-x-1" />
				</div>
			</a>

			<!-- Corporate Pathway -->
			<a
				href="/jobs/corporate"
				class="group card-interactive relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-white to-indigo-50/30 p-6 sm:p-7 shadow-xs hover:border-indigo-300 hover:shadow-lg"
			>
				<div>
					<div class="flex items-center justify-between mb-4">
						<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200">
							<Briefcase size={22} strokeWidth={2.2} />
						</div>
						<span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-800 ring-1 ring-indigo-200">
							{activeCorporateCount} Active • {corporateJobsList.length} Total
						</span>
					</div>
					<h3 class="font-heading text-xl font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
						Corporate & Bank Jobs
					</h3>
					<p class="mt-2 text-xs leading-relaxed text-slate-600">
						Leading commercial banks, NGOs (BRAC, bKash), telecommunications, IT startups, and manufacturing enterprises in Bangladesh.
					</p>
				</div>
				<div class="mt-6 flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
					<span>Browse all corporate vacancies</span>
					<ArrowRight size={13} class="transition-transform duration-150 group-hover:translate-x-1" />
				</div>
			</a>
		</div>
	</section>

	<!-- ── Latest Job Circulars Grid ────────────────────────────────────────── -->
	<section aria-labelledby="latest-heading">
		<div class="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
			<div>
				<h2 id="latest-heading" class="font-heading text-xl font-bold text-slate-900">
					Latest Circulars
				</h2>
				<p class="mt-0.5 text-xs text-slate-500">
					Recently posted government and private job advertisements
				</p>
			</div>

			<a
				href="/jobs"
				class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284C7] hover:text-[#0369A1] transition"
			>
				<span>View All {allJobs.length} Circulars</span>
				<ArrowRight size={13} />
			</a>
		</div>

		<div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
			{#each latestJobs as job, i (job.id)}
				<div class="animate-fade-up stagger-{(i % 6) + 1}">
					<JobCard {job} />
				</div>
			{:else}
				<div class="col-span-full rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-12 text-center">
					<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-3">
						<Briefcase size={22} />
					</div>
					<h3 class="font-heading text-sm font-bold text-slate-800">No circulars published yet</h3>
					<p class="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
						New government gazettes and corporate vacancies will appear here as soon as they are added to the database.
					</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- ── Closing Soon Notice Bar ──────────────────────────────────────────── -->
	{#if upcomingDeadlines.length > 0}
		<section class="card-interactive rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/40 p-6 shadow-xs" aria-labelledby="closing-soon-heading">
			<div class="flex items-center justify-between border-b border-amber-200/60 pb-3 mb-4">
				<div class="flex items-center gap-2.5 text-amber-900">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
						<Clock size={16} />
					</div>
					<h2 id="closing-soon-heading" class="font-heading text-sm font-bold uppercase tracking-wider">
						Closing Soon — Deadlines Approaching
					</h2>
				</div>
				<span class="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
					Next 14 Days
				</span>
			</div>

			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
				{#each upcomingDeadlines as job (job.id)}
					<a
						href={`/jobs/${job.slug ?? job.id}`}
						class="group flex flex-col justify-between rounded-xl border border-amber-200/80 bg-white p-3.5 shadow-2xs transition-all duration-200 hover:border-amber-400 hover:shadow-sm"
					>
						<div>
							<div class="flex items-center justify-between text-[11px] font-semibold">
								<span class="text-amber-800 uppercase tracking-wide">{job.category}</span>
								<span class="rounded bg-amber-50 px-1.5 py-0.5 text-amber-700 text-[10px]">Expiring</span>
							</div>
							<h3 class="font-heading mt-1.5 text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-amber-800 transition-colors">
								{job.title}
							</h3>
							<p class="mt-0.5 text-[11px] text-slate-500 truncate">{job.organization}</p>
						</div>
						<div class="mt-3 pt-2.5 border-t border-amber-100 flex items-center justify-between text-[11px] text-amber-800 font-semibold">
							<span>Deadline: {job.applicationDeadline}</span>
							<ArrowRight size={12} class="transition-transform duration-150 group-hover:translate-x-0.5 text-amber-600" />
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}
</div>

