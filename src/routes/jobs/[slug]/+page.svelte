<script lang="ts">
	import type { PageData } from './$types';
	import { getJobStatus, isValidUrl, isPdfUrl } from '$lib/utils/jobs.js';
	import { formatDate, daysUntilDeadline, isDeadlineApproaching } from '$lib/utils/dates.js';
	import { buildSeoMeta, SITE_NAME } from '$lib/utils/seo.js';
	import Badge from '$lib/components/ui/Badge.svelte';
	import JobCard from '$lib/components/jobs/JobCard.svelte';
	import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
	import PdfNoticeViewer from '$lib/components/jobs/PdfNoticeViewer.svelte';
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

<div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
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

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<!-- ── Main Circular Dossier Column ─────────────────────────────────── -->
		<article class="lg:col-span-2 space-y-6" aria-label="Job circular announcement details">
			<!-- Header Card -->
			<div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
				<!-- Badges -->
				<div class="mb-4 flex flex-wrap items-center gap-2">
					<Badge
						variant={job.category}
						label={job.category === 'government' ? 'Government Circular' : 'Corporate Vacancy'}
						size="base"
					/>
					<Badge variant={status} label={status === 'closed' ? 'Closed' : status === 'upcoming' ? 'Upcoming' : 'Open'} size="base" />
					{#if job.employmentType}
						<Badge
							variant="employmentType"
							label={employmentTypeLabel[job.employmentType] ?? job.employmentType}
						/>
					{/if}
				</div>

				<!-- Official Circular Title -->
				<h1 class="font-heading text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl leading-snug">
					{job.title ?? 'Official Circular Notice'}
				</h1>

				{#if job.organization}
					<div class="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
						{#if job.category === 'government'}
							<Landmark size={16} class="text-emerald-700" />
						{:else}
							<Briefcase size={16} class="text-indigo-700" />
						{/if}
						<span>{job.organization}</span>
					</div>
				{/if}

				<!-- Quick Metadata Bar -->
				<dl class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 pt-5 border-t border-slate-100">
					{#if job.location}
						<div class="flex items-start gap-2.5">
							<MapPin size={16} class="mt-0.5 shrink-0 text-slate-400" />
							<div>
								<dt class="text-xs text-slate-400 font-medium">Posting Location</dt>
								<dd class="text-xs font-semibold text-slate-800">{job.location}</dd>
							</div>
						</div>
					{/if}
					{#if job.vacancies}
						<div class="flex items-start gap-2.5">
							<Users size={16} class="mt-0.5 shrink-0 text-slate-400" />
							<div>
								<dt class="text-xs text-slate-400 font-medium">Total Vacancies</dt>
								<dd class="text-xs font-semibold text-slate-800">{job.vacancies} {job.vacancies === 1 ? 'position' : 'positions'}</dd>
							</div>
						</div>
					{/if}
					{#if job.salary}
						<div class="flex items-start gap-2.5">
							<Banknote size={16} class="mt-0.5 shrink-0 text-slate-400" />
							<div>
								<dt class="text-xs text-slate-400 font-medium">Remuneration / Pay Scale</dt>
								<dd class="text-xs font-semibold text-slate-800">{job.salary}</dd>
							</div>
						</div>
					{/if}
					{#if job.publishedAt}
						<div class="flex items-start gap-2.5">
							<Calendar size={16} class="mt-0.5 shrink-0 text-slate-400" />
							<div>
								<dt class="text-xs text-slate-400 font-medium">Official Gazetted Date</dt>
								<dd class="text-xs font-semibold text-slate-800">{formatDate(job.publishedAt)}</dd>
							</div>
						</div>
					{/if}
				</dl>

				<!-- Application Deadline Banner -->
				{#if job.applicationDeadline}
					<div
						class="mt-6 flex items-center gap-3 rounded-xl p-4 text-xs font-medium border
						{status === 'closed'
							? 'bg-rose-50 border-rose-200 text-rose-800'
							: approaching
								? 'bg-amber-50 border-amber-200 text-amber-900'
								: 'bg-slate-50 border-slate-200 text-slate-800'}"
					>
						<Clock size={18} class="shrink-0 {status === 'closed' ? 'text-rose-600' : approaching ? 'text-amber-600' : 'text-[#0284C7]'}" />
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
				{/if}

				<!-- Actions: Apply, Notice, Share -->
				<div class="mt-6 flex flex-wrap items-center gap-3 pt-5 border-t border-slate-100">
					{#if hasValidApplyLink}
						<a
							href={job.applicationLink}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 rounded-xl bg-[#0284C7] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0369A1] focus-visible:ring-2 focus-visible:ring-[#0284C7]"
						>
							<span>Apply Online via Official Portal</span>
							<ExternalLink size={14} />
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
							class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
						>
							<FileText size={14} />
							<span>{isPdfUrl(job.officialNoticeLink) ? 'Official Notice (PDF)' : 'Official Notice Page'}</span>
						</a>
					{/if}

					<button
						type="button"
						onclick={handleShare}
						class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
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

			<!-- Position Overview -->
			{#if job.description}
				<div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
					<h2 class="font-heading mb-3 text-sm font-bold uppercase tracking-wider text-slate-900">
						Notice Overview
					</h2>
					<p class="text-xs sm:text-sm leading-relaxed text-slate-700">
						{job.description}
					</p>
				</div>
			{/if}

			<!-- Responsibilities -->
			{#if job.responsibilities && job.responsibilities.length > 0}
				<div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
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
				<div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
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
				<div class="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-7 shadow-sm">
					<h2 class="font-heading mb-3 text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
						<ShieldCheck size={16} class="text-emerald-700" />
						Application Procedures
					</h2>
					<p class="text-xs sm:text-sm leading-relaxed text-slate-800">
						{job.applicationInstructions}
					</p>
				</div>
			{/if}

			<!-- Official PDF Notice / Circular Page (scrollable inside website via iframe) -->
			{#if hasNoticeFrame && noticeUrl}
				<PdfNoticeViewer
					pdfUrl={noticeUrl}
					organization={job.organization}
				/>
			{/if}
		</article>

		<!-- ── Sidebar Quick Facts Column ──────────────────────────────────── -->
		<aside class="space-y-6" aria-label="Circular summary sidebar">
			<!-- Quick Facts Card -->
			<div class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
				<h2 class="font-heading mb-4 text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
					Circular Quick Facts
				</h2>
				<dl class="space-y-3.5 text-xs">
					{#if job.education}
						<div class="flex items-start gap-2.5">
							<GraduationCap size={15} class="mt-0.5 shrink-0 text-slate-400" />
							<div>
								<dt class="text-slate-400 font-medium">Educational Qualification</dt>
								<dd class="mt-0.5 font-semibold text-slate-800">{job.education}</dd>
							</div>
						</div>
					{/if}
					{#if job.experience}
						<div class="flex items-start gap-2.5">
							<Briefcase size={15} class="mt-0.5 shrink-0 text-slate-400" />
							<div>
								<dt class="text-slate-400 font-medium">Experience Requirement</dt>
								<dd class="mt-0.5 font-semibold text-slate-800">{job.experience}</dd>
							</div>
						</div>
					{/if}
					{#if job.ageLimit}
						<div class="flex items-start gap-2.5">
							<Users size={15} class="mt-0.5 shrink-0 text-slate-400" />
							<div>
								<dt class="text-slate-400 font-medium">Age Limit</dt>
								<dd class="mt-0.5 font-semibold text-slate-800">{job.ageLimit}</dd>
							</div>
						</div>
					{/if}
					{#if job.applicationStartDate}
						<div class="flex items-start gap-2.5">
							<Calendar size={15} class="mt-0.5 shrink-0 text-slate-400" />
							<div>
								<dt class="text-slate-400 font-medium">Applications Opening</dt>
								<dd class="mt-0.5 font-semibold text-slate-800">{formatDate(job.applicationStartDate)}</dd>
							</div>
						</div>
					{/if}
					{#if job.applicationDeadline}
						<div class="flex items-start gap-2.5">
							<Clock size={15} class="mt-0.5 shrink-0 text-slate-400" />
							<div>
								<dt class="text-slate-400 font-medium">Application Deadline</dt>
								<dd class="mt-0.5 font-bold {status === 'closed' ? 'text-rose-600' : 'text-slate-900'}">
									{formatDate(job.applicationDeadline)}
								</dd>
							</div>
						</div>
					{/if}
					{#if job.sourceName}
						<div class="flex items-start gap-2.5">
							<FileText size={15} class="mt-0.5 shrink-0 text-slate-400" />
							<div>
								<dt class="text-slate-400 font-medium">Source Gazette / Publisher</dt>
								<dd class="mt-0.5 text-slate-700">{job.sourceName}</dd>
							</div>
						</div>
					{/if}
					{#if job.contactEmail}
						<div class="flex items-start gap-2.5">
							<Mail size={15} class="mt-0.5 shrink-0 text-slate-400" />
							<div>
								<dt class="text-slate-400 font-medium">Official Inquiry Contact</dt>
								<dd class="mt-0.5 font-medium text-[#0284C7] break-all">
									<a href="mailto:{job.contactEmail}">{job.contactEmail}</a>
								</dd>
							</div>
						</div>
					{/if}
				</dl>
			</div>

			<!-- Direct Portal Action Banner -->
			{#if hasValidApplyLink}
				<div class="rounded-2xl border border-sky-200 bg-sky-50/60 p-5 shadow-sm text-center">
					<h3 class="font-heading text-xs font-bold uppercase tracking-wider text-sky-900 mb-1">
						Ready to submit?
					</h3>
					<p class="text-xs text-slate-600 mb-3.5">
						Applications must be lodged directly at the employer's official web portal.
					</p>
					<a
						href={job.applicationLink}
						target="_blank"
						rel="noopener noreferrer"
						class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0284C7] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0369A1]"
					>
						<span>Open Application Portal</span>
						<ExternalLink size={13} />
					</a>
				</div>
			{/if}
		</aside>
	</div>

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
				{#each relatedJobs as rj (rj.id)}
					<JobCard job={rj} compact />
				{/each}
			</div>
		</section>
	{/if}
</div>
