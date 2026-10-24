import { describe, it, expect } from 'vitest';
import { getJobStatus, isPdfUrl, filterJobs, searchJobs, sortJobs } from './jobs.js';
import type { Job } from '$lib/types/job.js';

describe('getJobStatus dynamic deadline logic', () => {
	it('dynamically marks a job as closed if deadline has passed even if status is set to open', () => {
		const job: Job = {
			id: 101,
			category: 'government',
			title: 'Expired Circular',
			applicationDeadline: '2020-01-01',
			status: 'open',
		};

		// Should be dynamically labelled as 'closed'
		expect(getJobStatus(job)).toBe('closed');
	});

	it('returns open for future deadlines', () => {
		const futureDate = new Date();
		futureDate.setFullYear(futureDate.getFullYear() + 1);

		const job: Job = {
			id: 102,
			category: 'corporate',
			title: 'Active Job',
			applicationDeadline: futureDate.toISOString().split('T')[0],
			status: 'open',
		};

		expect(getJobStatus(job)).toBe('open');
	});
});

describe('isPdfUrl helper', () => {
	it('identifies standard .pdf URLs', () => {
		expect(isPdfUrl('https://tax6.teletalk.com.bd/docs/TAX620261018.pdf')).toBe(true);
		expect(isPdfUrl('https://example.com/circular.PDF')).toBe(true);
		expect(isPdfUrl('https://example.com/notice.pdf?download=true')).toBe(true);
	});

	it('returns false for web pages or non-pdf links', () => {
		expect(isPdfUrl('https://example.com/jobs/view')).toBe(false);
		expect(isPdfUrl('https://bpsc.teletalk.com.bd/apply')).toBe(false);
		expect(isPdfUrl(undefined)).toBe(false);
	});
});

describe('filterJobs', () => {
	const sampleJobs: Job[] = [
		{ id: 1, category: 'government', location: 'Dhaka', title: 'Gov Job' },
		{ id: 2, category: 'corporate', location: 'Chittagong', title: 'Corp Job' },
	];

	it('filters by category', () => {
		const govt = filterJobs(sampleJobs, { category: 'government' });
		expect(govt).toHaveLength(1);
		expect(govt[0].id).toBe(1);
	});

	it('filters by location', () => {
		const dhaka = filterJobs(sampleJobs, { location: 'dhaka' });
		expect(dhaka).toHaveLength(1);
		expect(dhaka[0].id).toBe(1);
	});
});
