<script lang="ts">
	import type { JobCategory, JobStatus } from '$lib/types/job.js';

	interface Props {
		variant: JobCategory | JobStatus | 'featured' | 'employmentType';
		label: string;
		size?: 'sm' | 'base';
	}

	let { variant, label, size = 'sm' }: Props = $props();

	const variantStyles: Record<string, string> = {
		government:
			'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]',
		corporate:
			'bg-[#EEF2FF] text-[#3730A3] border border-[#C7D2FE]',
		open: 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]',
		closed: 'bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]',
		upcoming: 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]',
		featured:
			'bg-[#FEFCE8] text-[#854D0E] border border-[#FEF08A]',
		employmentType: 'bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]',
	};

	const sizeStyles = {
		sm: 'px-2.5 py-0.5 text-xs font-medium tracking-wide',
		base: 'px-3 py-1 text-xs font-semibold tracking-wide',
	};
</script>

<span
	class="inline-flex items-center gap-1.5 rounded-md font-sans transition-colors duration-150 {variantStyles[variant] ?? variantStyles.employmentType} {sizeStyles[size]}"
>
	{#if variant === 'open'}
		<span class="h-1.5 w-1.5 rounded-full bg-[#16A34A]"></span>
	{:else if variant === 'closed'}
		<span class="h-1.5 w-1.5 rounded-full bg-[#E11D48]"></span>
	{:else if variant === 'upcoming'}
		<span class="h-1.5 w-1.5 rounded-full bg-[#D97706]"></span>
	{/if}
	<span>{label}</span>
</span>
