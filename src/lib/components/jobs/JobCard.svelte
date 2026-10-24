<script lang="ts">
	import type { Job } from '$lib/types/job.js';
	import { getJobStatus, isValidUrl } from '$lib/utils/jobs.js';
	import { formatDate, daysUntilDeadline, isDeadlineApproaching } from '$lib/utils/dates.js';
	import Badge from '$lib/components/ui/Badge.svelte';
	import {
		MapPin,
		Banknote,
		Users,
		Calendar,
		Clock,
		ArrowRight,
		ExternalLink,
		Landmark,
		Briefcase,
		Star,
	} from 'lucide-svelte';

	interface Props {
		job: Job;
		compact?: boolean;
	}

	let { job, compact = false }: Props = $props();

	const status = $derived(getJobStatus(job));
	const days = $derived(daysUntilDeadline(job.applicationDeadline));
	const approaching = $derived(isDeadlineApproaching(job.applicationDeadline, 7));
	const hasValidApplyLink = $derived(
		!!job.applicationLink && isValidUrl(job.applicationLink) && status !== 'closed',
	);

	const detailHref = $derived(`/jobs/${job.slug ?? job.id}`);

	const employmentTypeLabel: Record<string, string> = {
		'full-time': 'Full-time',
		'part-time': 'Part-time',
		contractual: 'Contractual',
		internship: 'Internship',
		other: 'Other',
	};
</script>

<article
	class="group card-interactive relative flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs
	{status === 'closed' ? 'bg-slate-50/60 opacity-90' : 'hover:border-slate-300 hover:shadow-lg'}
	{job.category === 'government' ? 'hover:border-emerald-300' : 'hover:border-indigo-300'}"
>
	<!-- Top Badges & Tags -->
	<div class="mb-3.5 flex flex-wrap items-center justify-between gap-2">
		<div class="flex flex-wrap items-center gap-1.5">
			<Badge
				variant={job.category}
				label={job.category === 'government' ? 'Government' : 'Corporate'}
			/>
			<Badge variant={status} label={status === 'closed' ? 'Closed' : status === 'upcoming' ? 'Upcoming' : 'Open'} />
			{#if job.employmentType}
				<Badge
					variant="employmentType"
					label={employmentTypeLabel[job.employmentType] ?? job.employmentType}
				/>
			{/if}
		</div>

		{#if job.featured}
			<span
				class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 ring-1 ring-inset ring-amber-200/80"
			>
				<Star size={11} class="fill-amber-500 text-amber-500" />
				Featured
			</span>
		{/if}
	</div>

	<!-- Job Title & Organization -->
	<div class="mb-3">
		<h2 class="font-heading text-base sm:text-lg font-bold leading-snug text-slate-900 group-hover:text-[#0284C7] transition-colors duration-200">
			<a href={detailHref} class="focus:outline-none focus:underline">
				{job.title ?? 'Untitled Circular'}
			</a>
		</h2>

		{#if job.organization}
			<div class="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
				{#if job.category === 'government'}
					<Landmark size={14} class="shrink-0 text-emerald-600" />
				{:else}
					<Briefcase size={14} class="shrink-0 text-indigo-600" />
				{/if}
				<span class="truncate">{job.organization}</span>
			</div>
		{/if}
	</div>

	<!-- Description excerpt (optional when not compact) -->
	{#if job.description && !compact}
		<p class="mb-4 line-clamp-2 text-xs leading-relaxed text-slate-600">
			{job.description}
		</p>
	{/if}

	<!-- Compact Scan Metadata Grid -->
	<dl class="mb-4 grid grid-cols-1 gap-x-3 gap-y-2 text-xs text-slate-600 sm:grid-cols-2 pt-3 border-t border-slate-100">
		{#if job.location}
			<div class="flex items-center gap-1.5">
				<MapPin size={13} class="shrink-0 text-slate-400" />
				<span class="truncate">{job.location}</span>
			</div>
		{/if}
		{#if job.salary}
			<div class="flex items-center gap-1.5">
				<Banknote size={13} class="shrink-0 text-slate-400" />
				<span class="truncate font-medium text-slate-700">{job.salary}</span>
			</div>
		{/if}
		{#if job.vacancies}
			<div class="flex items-center gap-1.5">
				<Users size={13} class="shrink-0 text-slate-400" />
				<span>{job.vacancies} {job.vacancies === 1 ? 'position' : 'positions'}</span>
			</div>
		{/if}
		{#if job.publishedAt}
			<div class="flex items-center gap-1.5">
				<Calendar size={13} class="shrink-0 text-slate-400" />
				<span>Posted {formatDate(job.publishedAt)}</span>
			</div>
		{/if}
	</dl>

	<!-- Footer with Deadline & Actions -->
	<div class="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-slate-100">
		<!-- Deadline status -->
		<div class="flex items-center gap-1.5 text-xs">
			<Clock size={13} class="shrink-0 {status === 'closed' ? 'text-rose-500' : approaching ? 'text-amber-500' : 'text-slate-400'}" />
			{#if job.applicationDeadline}
				<span class="font-medium {status === 'closed' ? 'text-rose-600' : approaching ? 'text-amber-700' : 'text-slate-600'}">
					{#if status === 'closed'}
						Deadline passed ({formatDate(job.applicationDeadline)})
					{:else if days === 0}
						<span class="font-bold text-amber-700 animate-pulse">Closes today</span>
					{:else if days === 1}
						<span class="font-bold text-amber-700">1 day left</span>
					{:else if days !== null && days > 0}
						<span>{days} days left ({formatDate(job.applicationDeadline)})</span>
					{:else}
						<span>Until {formatDate(job.applicationDeadline)}</span>
					{/if}
				</span>
			{:else}
				<span class="text-slate-400">See official notice</span>
			{/if}
		</div>

		<!-- Action buttons -->
		<div class="flex items-center gap-2">
			<a
				href={detailHref}
				class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#0284C7]"
			>
				<span>View Details</span>
				<ArrowRight size={12} class="transition-transform duration-150 group-hover:translate-x-0.5" />
			</a>

			{#if hasValidApplyLink}
				<a
					href={job.applicationLink}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-1 rounded-xl bg-[#0284C7] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#0369A1] hover:shadow-sm active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#0284C7]"
				>
					<span>Apply</span>
					<ExternalLink size={11} />
				</a>
			{/if}
		</div>
	</div>
</article>
