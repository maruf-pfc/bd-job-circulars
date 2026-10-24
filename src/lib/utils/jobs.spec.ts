import { describe, it, expect } from 'vitest';
import { getJobStatus, isPdfUrl, filterJobs, searchJobs, sortJobs } from './jobs.js';
import type { Job } from '$lib/types/job.js';

import { parseDate, formatDate } from './dates.js';

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

	it('dynamically marks a job as closed for DD-MM-YYYY expired deadlines', () => {
		const job: Job = {
			id: 103,
			category: 'corporate',
			title: 'Expired DD-MM-YYYY Job',
			applicationDeadline: '01-01-2020',
			status: 'open',
		};

		expect(getJobStatus(job)).toBe('closed');
	});

	it('returns open for future deadlines in DD-MM-YYYY format', () => {
		const job: Job = {
			id: 104,
			category: 'corporate',
			title: 'Active Job DD-MM-YYYY',
			applicationDeadline: '31-12-2099',
			status: 'open',
		};

		expect(getJobStatus(job)).toBe('open');
	});

	it('returns open for future deadlines in ISO format', () => {
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

describe('dates utility DD-MM-YYYY format', () => {
	it('parses DD-MM-YYYY correctly', () => {
		const d = parseDate('24-10-2026');
		expect(d).not.toBeNull();
		expect(d?.getFullYear()).toBe(2026);
		expect(d?.getMonth()).toBe(9); // 0-indexed October
		expect(d?.getDate()).toBe(24);
	});

	it('formats date string to DD-MM-YYYY', () => {
		expect(formatDate('24-10-2026')).toBe('24-10-2026');
		expect(formatDate('2026-10-24')).toBe('24-10-2026');
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
