<script lang="ts">
	import type { PageData } from './$types';
	import { getJobStatus, isValidUrl } from '$lib/utils/jobs.js';
	import { formatDate, daysUntilDeadline, isDeadlineApproaching } from '$lib/utils/dates.js';
	import { buildSeoMeta, SITE_NAME } from '$lib/utils/seo.js';
	import Badge from '$lib/components/ui/Badge.svelte';
	import JobCard from '$lib/components/jobs/JobCard.svelte';
	import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
	import WebNoticeViewer from '$lib/components/jobs/WebNoticeViewer.svelte';
	import {
		MapPin,
		Banknote,
		Users,
		Calendar,
		Clock,
		GraduationCap,
		Briefcase,
		ExternalLink,
		FileText,
		Globe,
		Mail,
		Share2,
		CheckCircle2,
		AlertCircle,
		ChevronRight,
		Landmark,
		ShieldCheck,
		Copy,
		Check,
	} from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	const job = $derived(data.job);
	const relatedJobs = $derived(data.relatedJobs);
	const absoluteUrl = $derived(data.absoluteUrl);
	const jobSchema = $derived(data.jobSchema);
	const breadcrumbSchema = $derived(data.breadcrumbSchema);

	const status = $derived(getJobStatus(job));
	const days = $derived(daysUntilDeadline(job.applicationDeadline));
	const approaching = $derived(isDeadlineApproaching(job.applicationDeadline, 7));
	const hasValidApplyLink = $derived(
		!!job.applicationLink && isValidUrl(job.applicationLink) && status !== 'closed',
	);
	const noticeUrl = $derived(
		job?.officialNoticeLink && isValidUrl(job.officialNoticeLink)
			? job.officialNoticeLink
			: job?.applicationLink && isValidUrl(job.applicationLink)
				? job.applicationLink
				: undefined,
	);
	const hasNoticeFrame = $derived(!!noticeUrl);

	const seo = $derived(
		buildSeoMeta({
			title: job.title
				? `${job.title} — ${job.organization ?? SITE_NAME}`
				: 'Job Circular',
			description:
				job.description?.slice(0, 155) ??
				`View the full details for this ${job.category} job circular in Bangladesh.`,
			path: `/jobs/${job.slug ?? job.id}`,
			ogType: 'article',
		}),
	);

	const employmentTypeLabel: Record<string, string> = {
		'full-time': 'Full-time',
		'part-time': 'Part-time',
		contractual: 'Contractual',
		internship: 'Internship',
		other: 'Other',
	};

	let copied = $state(false);

	async function handleShare() {
		if (navigator.share) {
			try {
				await navigator.share({
					title: job.title,
					text: job.description,
					url: absoluteUrl,
				});
				return;
			} catch {
				// Fallback to clipboard
			}
		}

		await navigator.clipboard.writeText(absoluteUrl);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2500);
	}
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	{#if seo.canonical}<link rel="canonical" href={seo.canonical} />{/if}
	<meta property="og:title" content={seo.ogTitle} />
	<meta property="og:description" content={seo.ogDescription} />
	<meta property="og:type" content={seo.ogType} />
	<meta property="og:url" content={absoluteUrl} />
</svelte:head>

{#if jobSchema}
	{@html `<script type="application/ld+json">${JSON.stringify(jobSchema)}</script>`}
{/if}
{@html `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`}

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
	<!-- Breadcrumb Navigation -->
	<div>
		<Breadcrumb
			items={[
				{ label: 'All Circulars', href: '/jobs' },
				{
					label: job.category === 'government' ? 'Government' : 'Corporate',
					href: `/jobs/${job.category}`,
				},
				{ label: job.title ?? 'Circular Notice' },
			]}
		/>
	</div>

	<!-- ── Full-Width Circular Dossier ─────────────────────────────────── -->
	<article class="space-y-6" aria-label="Job circular announcement details">
		<!-- Header Card -->
		<div class="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50/50 p-6 sm:p-8 shadow-xs">
			<!-- Badges -->
			<div class="mb-4 flex flex-wrap items-center gap-2">
				<Badge
					variant={job.category}
					label={job.category === 'government' ? 'Government Circular' : 'Corporate Vacancy'}
					size="base"
				/>
				<Badge
					variant={status}
					label={status === 'closed' ? 'Closed' : status === 'upcoming' ? 'Upcoming' : 'Open'}
					size="base"
				/>
				{#if job.employmentType}
					<Badge
						variant="employmentType"
						label={employmentTypeLabel[job.employmentType] ?? job.employmentType}
					/>
				{/if}
			</div>

			<!-- Official Circular Title -->
			<h1 class="font-heading text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl leading-snug">
				{job.title ?? 'Official Circular Notice'}
			</h1>

			{#if job.organization}
				<div class="mt-2.5 flex items-center gap-2 text-base font-semibold text-slate-700">
					{#if job.category === 'government'}
						<Landmark size={18} class="text-emerald-700" />
					{:else}
						<Briefcase size={18} class="text-indigo-700" />
					{/if}
					<span>{job.organization}</span>
				</div>
			{/if}

			<!-- Application Deadline Alert Banner -->
			{#if job.applicationDeadline}
				<div
					class="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl p-4 text-xs font-medium border
					{status === 'closed'
						? 'bg-rose-50 border-rose-200 text-rose-800'
						: approaching
							? 'bg-amber-50 border-amber-200 text-amber-900'
							: 'bg-slate-50 border-slate-200 text-slate-800'}"
				>
					<div class="flex items-center gap-3">
						<Clock size={18} class="shrink-0 {status === 'closed' ? 'text-rose-600' : approaching ? 'text-amber-600 animate-pulse' : 'text-[#0284C7]'}" />
						<div>
							{#if status === 'closed'}
								<span class="font-bold">Applications Closed:</span> This circular officially expired on {formatDate(job.applicationDeadline)}.
							{:else if days === 0}
								<span class="font-bold text-amber-700">Urgent Deadline:</span> Applications close <strong>today ({formatDate(job.applicationDeadline)})</strong>.
							{:else if days !== null && days > 0}
								<span><strong>{days} days remaining</strong> to submit application (Last date: {formatDate(job.applicationDeadline)}).</span>
							{:else}
								<span>Application Closing Date: {formatDate(job.applicationDeadline)}</span>
							{/if}
						</div>
					</div>

					{#if hasValidApplyLink}
						<a
							href={job.applicationLink}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 rounded-lg bg-[#0284C7] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#0369A1] transition active:scale-[0.98]"
						>
							<span>Apply Online</span>
							<ExternalLink size={12} />
						</a>
					{/if}
				</div>
			{/if}

			<!-- Actions: Apply, Notice, Share -->
			<div class="mt-6 flex flex-wrap items-center gap-3 pt-5 border-t border-slate-100">
				{#if hasValidApplyLink}
					<a
						href={job.applicationLink}
						target="_blank"
						rel="noopener noreferrer"
						class="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0369A1] px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all duration-200 hover:shadow-md hover:brightness-105 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#0284C7]"
					>
						<span>Apply Online via Official Portal</span>
						<ExternalLink size={14} class="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
					</a>
				{:else if status === 'closed'}
					<div class="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-700 border border-rose-200">
						<AlertCircle size={14} />
						<span>Applications are closed for this circular</span>
					</div>
				{:else}
					<div class="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-600 border border-slate-200">
						<AlertCircle size={14} />
						<span>Follow instructions below to apply</span>
					</div>
				{/if}

				{#if job.officialNoticeLink && isValidUrl(job.officialNoticeLink)}
					<a
						href={job.officialNoticeLink}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 shadow-2xs active:scale-[0.98]"
					>
						<Globe size={14} />
						<span>Official Notice Page</span>
					</a>
				{/if}

				<button
					type="button"
					onclick={handleShare}
					class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 shadow-2xs active:scale-[0.98]"
					aria-label="Share circular link"
				>
					{#if copied}
						<Check size={14} class="text-emerald-600" />
						<span class="text-emerald-700 font-bold">Copied!</span>
					{:else}
						<Share2 size={14} />
						<span>Share</span>
					{/if}
				</button>
			</div>
		</div>


		<!-- ── Top Pinned Quick Facts Panel ─────────────────────────────── -->
		<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-label="Circular summary quick facts">
			<div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
				<h2 class="font-heading text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
					<span class="h-2 w-2 rounded-full bg-[#0284C7]"></span>
					Circular Quick Facts & Specifications
				</h2>
				<span class="text-[11px] font-medium text-slate-400">Key Information at a Glance</span>
			</div>

			<dl class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
				{#if job.vacancies}
					<div class="flex items-start gap-3 rounded-xl bg-slate-50/70 p-3 border border-slate-100">
						<Users size={16} class="mt-0.5 shrink-0 text-[#0284C7]" />
						<div>
							<dt class="text-slate-400 font-medium">Total Vacancies</dt>
							<dd class="mt-0.5 font-bold text-slate-900 text-sm">{job.vacancies} {job.vacancies === 1 ? 'position' : 'positions'}</dd>
						</div>
					</div>
				{/if}

				{#if job.location}
					<div class="flex items-start gap-3 rounded-xl bg-slate-50/70 p-3 border border-slate-100">
						<MapPin size={16} class="mt-0.5 shrink-0 text-emerald-600" />
						<div>
							<dt class="text-slate-400 font-medium">Job Location</dt>
							<dd class="mt-0.5 font-semibold text-slate-800">{job.location}</dd>
						</div>
					</div>
				{/if}

				{#if job.salary}
					<div class="flex items-start gap-3 rounded-xl bg-slate-50/70 p-3 border border-slate-100">
						<Banknote size={16} class="mt-0.5 shrink-0 text-amber-600" />
						<div>
							<dt class="text-slate-400 font-medium">Salary / Grade</dt>
							<dd class="mt-0.5 font-semibold text-slate-800">{job.salary}</dd>
						</div>
					</div>
				{/if}

				{#if job.applicationDeadline}
					<div class="flex items-start gap-3 rounded-xl bg-slate-50/70 p-3 border border-slate-100">
						<Clock size={16} class="mt-0.5 shrink-0 text-rose-600" />
						<div>
							<dt class="text-slate-400 font-medium">Application Deadline</dt>
							<dd class="mt-0.5 font-bold {status === 'closed' ? 'text-rose-600' : 'text-slate-900'}">
								{formatDate(job.applicationDeadline)}
							</dd>
						</div>
					</div>
				{/if}

				{#if job.applicationStartDate}
					<div class="flex items-start gap-3 rounded-xl bg-slate-50/70 p-3 border border-slate-100">
						<Calendar size={16} class="mt-0.5 shrink-0 text-slate-500" />
						<div>
							<dt class="text-slate-400 font-medium">Application Start Date</dt>
							<dd class="mt-0.5 font-semibold text-slate-800">{formatDate(job.applicationStartDate)}</dd>
						</div>
					</div>
				{/if}

				{#if job.publishedAt}
					<div class="flex items-start gap-3 rounded-xl bg-slate-50/70 p-3 border border-slate-100">
						<Calendar size={16} class="mt-0.5 shrink-0 text-slate-500" />
						<div>
							<dt class="text-slate-400 font-medium">Gazetted / Published Date</dt>
							<dd class="mt-0.5 font-semibold text-slate-800">{formatDate(job.publishedAt)}</dd>
						</div>
					</div>
				{/if}

				{#if job.education}
					<div class="flex items-start gap-3 rounded-xl bg-slate-50/70 p-3 border border-slate-100">
						<GraduationCap size={16} class="mt-0.5 shrink-0 text-indigo-600" />
						<div>
							<dt class="text-slate-400 font-medium">Educational Qualification</dt>
							<dd class="mt-0.5 font-semibold text-slate-800">{job.education}</dd>
						</div>
					</div>
				{/if}

				{#if job.experience}
					<div class="flex items-start gap-3 rounded-xl bg-slate-50/70 p-3 border border-slate-100">
						<Briefcase size={16} class="mt-0.5 shrink-0 text-purple-600" />
						<div>
							<dt class="text-slate-400 font-medium">Experience Requirement</dt>
							<dd class="mt-0.5 font-semibold text-slate-800">{job.experience}</dd>
						</div>
					</div>
				{/if}

				{#if job.ageLimit}
					<div class="flex items-start gap-3 rounded-xl bg-slate-50/70 p-3 border border-slate-100">
						<Users size={16} class="mt-0.5 shrink-0 text-teal-600" />
						<div>
							<dt class="text-slate-400 font-medium">Age Limit</dt>
							<dd class="mt-0.5 font-semibold text-slate-800">{job.ageLimit}</dd>
						</div>
					</div>
				{/if}

				{#if job.sourceName}
					<div class="flex items-start gap-3 rounded-xl bg-slate-50/70 p-3 border border-slate-100">
						<FileText size={16} class="mt-0.5 shrink-0 text-slate-500" />
						<div>
							<dt class="text-slate-400 font-medium">Source Gazette / Publisher</dt>
							<dd class="mt-0.5 text-slate-700">{job.sourceName}</dd>
						</div>
					</div>
				{/if}

				{#if job.contactEmail}
					<div class="flex items-start gap-3 rounded-xl bg-slate-50/70 p-3 border border-slate-100 sm:col-span-2">
						<Mail size={16} class="mt-0.5 shrink-0 text-[#0284C7]" />
						<div>
							<dt class="text-slate-400 font-medium">Official Inquiry Contact</dt>
							<dd class="mt-0.5 font-medium text-[#0284C7] break-all">
								<a href="mailto:{job.contactEmail}" class="hover:underline">{job.contactEmail}</a>
							</dd>
						</div>
					</div>
				{/if}
			</dl>
		</div>

		<!-- Position Overview -->
		{#if job.description}
			<div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
				<h2 class="font-heading mb-3 text-sm font-bold uppercase tracking-wider text-slate-900">
					Notice Overview
				</h2>
				<p class="text-xs sm:text-sm leading-relaxed text-slate-700 whitespace-pre-line">
					{job.description}
				</p>
			</div>
		{/if}

		<!-- Responsibilities -->
		{#if job.responsibilities && job.responsibilities.length > 0}
			<div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
				<h2 class="font-heading mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">
					Key Responsibilities & Scope
				</h2>
				<ul class="space-y-2.5 text-xs sm:text-sm text-slate-700" role="list">
					{#each job.responsibilities as item}
						<li class="flex items-start gap-2.5">
							<CheckCircle2 size={16} class="mt-0.5 shrink-0 text-emerald-600" />
							<span>{item}</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Requirements & Eligibility -->
		{#if job.requirements && job.requirements.length > 0}
			<div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
				<h2 class="font-heading mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">
					Eligibility & Candidate Requirements
				</h2>
				<ul class="space-y-2.5 text-xs sm:text-sm text-slate-700" role="list">
					{#each job.requirements as item}
						<li class="flex items-start gap-2.5">
							<ChevronRight size={16} class="mt-0.5 shrink-0 text-slate-400" />
							<span>{item}</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- How to Apply Box -->
		{#if job.applicationInstructions}
			<div class="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8 shadow-sm">
				<h2 class="font-heading mb-3 text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
					<ShieldCheck size={16} class="text-emerald-700" />
					Application Procedures
				</h2>
				<p class="text-xs sm:text-sm leading-relaxed text-slate-800 whitespace-pre-line">
					{job.applicationInstructions}
				</p>
			</div>
		{/if}

		<!-- Official Webpage Notice / Circular Page (Full Width, scrollable inside website via iframe) -->
		{#if hasNoticeFrame && noticeUrl}
			<WebNoticeViewer
				noticeUrl={noticeUrl}
				organization={job.organization}
			/>
		{/if}
	</article>

	<!-- ── Related Circulars Section ────────────────────────────────────────── -->
	{#if relatedJobs.length > 0}
		<section class="mt-12 pt-8 border-t border-slate-200" aria-labelledby="related-heading">
			<div class="mb-5 flex items-center justify-between">
				<div>
					<h2 id="related-heading" class="font-heading text-lg font-bold text-slate-900">
						Related Career Circulars
					</h2>
					<p class="text-xs text-slate-500">Other opportunities in this category</p>
				</div>
				<a href="/jobs" class="text-xs font-semibold text-[#0284C7] hover:underline">
					View All →
				</a>
			</div>
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each relatedJobs as rj, i (rj.id)}
					<div class="animate-fade-up stagger-{(i % 6) + 1}">
						<JobCard job={rj} compact />
					</div>
				{/each}
			</div>
		</section>
	{/if}
</div>
