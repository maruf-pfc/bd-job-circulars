/**
 * Date formatting and deadline utilities.
 * Supports DD-MM-YYYY (primary) and YYYY-MM-DD (ISO) formats.
 */

/**
 * Parse a date string safely.
 * Handles 'DD-MM-YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', and ISO timestamps.
 * Returns null for absent or invalid values.
 */
export function parseDate(dateStr: string | undefined): Date | null {
	if (!dateStr) return null;
	const trimmed = dateStr.trim();
	if (!trimmed) return null;

	// 1. Primary: Match DD-MM-YYYY or DD/MM/YYYY
	const ddmmyyyyMatch = trimmed.match(
		/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})(?:[T\s](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/,
	);
	if (ddmmyyyyMatch) {
		const day = parseInt(ddmmyyyyMatch[1], 10);
		const month = parseInt(ddmmyyyyMatch[2], 10) - 1;
		const year = parseInt(ddmmyyyyMatch[3], 10);
		const hours = ddmmyyyyMatch[4] ? parseInt(ddmmyyyyMatch[4], 10) : 0;
		const minutes = ddmmyyyyMatch[5] ? parseInt(ddmmyyyyMatch[5], 10) : 0;
		const seconds = ddmmyyyyMatch[6] ? parseInt(ddmmyyyyMatch[6], 10) : 0;

		const d = new Date(year, month, day, hours, minutes, seconds);
		if (d.getFullYear() === year && d.getMonth() === month && d.getDate() === day) {
			return d;
		}
		return null;
	}

	// 2. Secondary: Match YYYY-MM-DD or YYYY/MM/DD
	const yyyymmddMatch = trimmed.match(
		/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[T\s](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/,
	);
	if (yyyymmddMatch) {
		const year = parseInt(yyyymmddMatch[1], 10);
		const month = parseInt(yyyymmddMatch[2], 10) - 1;
		const day = parseInt(yyyymmddMatch[3], 10);
		const hours = yyyymmddMatch[4] ? parseInt(yyyymmddMatch[4], 10) : 0;
		const minutes = yyyymmddMatch[5] ? parseInt(yyyymmddMatch[5], 10) : 0;
		const seconds = yyyymmddMatch[6] ? parseInt(yyyymmddMatch[6], 10) : 0;

		const d = new Date(year, month, day, hours, minutes, seconds);
		if (d.getFullYear() === year && d.getMonth() === month && d.getDate() === day) {
			return d;
		}
		return null;
	}

	// 3. Fallback to standard engine parsing
	const d = new Date(trimmed);
	return isNaN(d.getTime()) ? null : d;
}

/**
 * Format a date to standard 'DD-MM-YYYY' format.
 */
export function formatDate(dateStr: string | undefined): string {
	const d = parseDate(dateStr);
	if (!d) return 'Not specified';
	const day = String(d.getDate()).padStart(2, '0');
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const year = d.getFullYear();
	return `${day}-${month}-${year}`;
}

/**
 * Returns the number of days until the deadline.
 * Negative means it has passed. Returns null if no deadline.
 */
export function daysUntilDeadline(deadlineStr: string | undefined): number | null {
	const d = parseDate(deadlineStr);
	if (!d) return null;
	const now = new Date();
	// Compare calendar dates (midnight to midnight)
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
 * Format a date-time string for display in 'DD-MM-YYYY' format.
 */
export function formatDateTime(dateStr: string | undefined): string {
	return formatDate(dateStr);
}
