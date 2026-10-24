import type { PageServerLoad } from './$types';
import { governmentJobs } from '$lib/data/government-jobs.js';
import { getAllLocations, sortJobs, searchJobs, filterJobs, paginate, getJobStatus } from '$lib/utils/jobs.js';
import type { JobFilters, SortOrder } from '$lib/utils/jobs.js';

export const prerender = false;

export const load: PageServerLoad = ({ url }) => {
	const q = url.searchParams.get('q') ?? '';
	const location = url.searchParams.get('location') ?? '';
	const employmentType = url.searchParams.get('type') ?? 'all';
	const status = (url.searchParams.get('status') ?? 'all') as any;
	const sort = (url.searchParams.get('sort') ?? 'newest') as SortOrder;
	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
	const perPage = parseInt(url.searchParams.get('per') ?? '10', 10);
	const safePerPage = [10, 20, 50].includes(perPage) ? perPage : 10;

	const filters: JobFilters = { category: 'government', location, employmentType, status };
	const searched = searchJobs(governmentJobs, q);
	const filtered = filterJobs(searched, filters);
	const sorted = sortJobs(filtered, sort);
	const paginationResult = paginate(sorted, page, safePerPage);

	// Count strictly active notices (where deadline has not passed)
	const activeCount = governmentJobs.filter((j) => getJobStatus(j) === 'open').length;

	return {
		pagination: paginationResult,
		locations: getAllLocations(),
		q,
		filters,
		sort,
		activeCount,
		totalCount: governmentJobs.length,
	};
};
