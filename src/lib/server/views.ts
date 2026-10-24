import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const VIEWS_FILE = path.join(DATA_DIR, 'views.json');

let viewsCache: Record<string, number> = {};
let initialized = false;

function ensureLoaded() {
	if (initialized) return;
	try {
		if (!fs.existsSync(DATA_DIR)) {
			fs.mkdirSync(DATA_DIR, { recursive: true });
		}
		if (fs.existsSync(VIEWS_FILE)) {
			const content = fs.readFileSync(VIEWS_FILE, 'utf-8');
			viewsCache = JSON.parse(content);
		}
	} catch {
		viewsCache = {};
	}
	initialized = true;
}

function persistViews() {
	try {
		if (!fs.existsSync(DATA_DIR)) {
			fs.mkdirSync(DATA_DIR, { recursive: true });
		}
		fs.writeFileSync(VIEWS_FILE, JSON.stringify(viewsCache, null, 2), 'utf-8');
	} catch (e) {
		console.error('Failed to write views to disk:', e);
	}
}

export function getJobViews(key: string): number {
	ensureLoaded();
	return viewsCache[key] ?? 0;
}

export function incrementJobViews(key: string): number {
	ensureLoaded();
	viewsCache[key] = (viewsCache[key] ?? 0) + 1;
	persistViews();
	return viewsCache[key];
}
