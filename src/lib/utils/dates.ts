/**
 * Date formatting and deadline utilities.
 */

/**
 * Parse an ISO date string safely. Returns null for absent/invalid values.
 */
export function parseDate(dateStr: string | undefined): Date | null {
	if (!dateStr) return null;
	const d = new Date(dateStr);
	return isNaN(d.getTime()) ? null : d;
}

/**
 * Format a date to a readable Bangladesh-style string, e.g. "20 November 2026".
 */
export function formatDate(dateStr: string | undefined): string {
	const d = parseDate(dateStr);
	if (!d) return 'Not specified';
	return d.toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
}

/**
 * Returns the number of days until the deadline.
 * Negative means it has passed. Returns null if no deadline.
 */
export function daysUntilDeadline(deadlineStr: string | undefined): number | null {
	const d = parseDate(deadlineStr);
	if (!d) return null;
	const now = new Date();
	// Compare calendar dates, not exact times
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const deadline = new Date(d.getFullYear(), d.getMonth(), d.getDate());
	return Math.floor((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Returns true if the application deadline has already passed.
 */
export function isDeadlinePassed(deadlineStr: string | undefined): boolean {
	const days = daysUntilDeadline(deadlineStr);
	return days !== null && days < 0;
}

/**
 * Returns a human-readable deadline label, e.g. "3 days left", "Deadline passed".
 */
export function deadlineLabel(deadlineStr: string | undefined): string {
	const days = daysUntilDeadline(deadlineStr);
	if (days === null) return '';
	if (days < 0) return 'Deadline passed';
	if (days === 0) return 'Closes today';
	if (days === 1) return '1 day left';
	return `${days} days left`;
}

/**
 * Returns true when the deadline is within N days (approaching but not passed).
 */
export function isDeadlineApproaching(
	deadlineStr: string | undefined,
	withinDays = 7,
): boolean {
	const days = daysUntilDeadline(deadlineStr);
	return days !== null && days >= 0 && days <= withinDays;
}

/**
 * Format a date-time string for display (with time if provided).
 */
export function formatDateTime(dateStr: string | undefined): string {
	const d = parseDate(dateStr);
	if (!d) return 'Not specified';
	return d.toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
}
