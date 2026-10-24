/**
 * Corporate Job Circulars Database
 *
 * DATA ENTRY & MAINTENANCE GUIDE
 * ──────────────────────────────
 * • FILE 2 OF 2 FOR REGULAR DATA ENTRY.
 * • Add new circulars at the TOP of the array so newest appear first.
 * • `id`: Unique number for each job (101, 102, 103...).
 * • `slug`: URL slug (e.g. 'software-engineer-grameenphone-dhaka').
 *    This slug dynamically generates the details page: /jobs/[slug]
 * • `category`: Must be 'corporate'.
 * • `applicationLink`: Link to the company portal or application page.
 * • `officialNoticeLink`: (Optional) PDF or circular link for iframe display.
 * • `applicationDeadline`: ISO date 'YYYY-MM-DD' (e.g. '2026-12-31'). The site dynamically marks expired circulars as closed.
 *
 * TEMPLATE FOR NEW CIRCULAR:
 * {
 *   id: 101,
 *   slug: 'post-title-company-location',
 *   title: 'Official Job Post Title',
 *   organization: 'Company / Bank / NGO Name',
 *   category: 'corporate',
 *   employmentType: 'full-time', // 'full-time' | 'part-time' | 'contractual' | 'internship'
 *   location: 'Dhaka, Bangladesh',
 *   vacancies: 5,
 *   salary: 'BDT 50,000–80,000/month',
 *   education: "Bachelor's degree in relevant field",
 *   experience: '2–3 years of experience',
 *   applicationStartDate: '2026-11-01',
 *   applicationDeadline: '2026-11-30',
 *   publishedAt: '2026-10-24',
 *   description: 'Full job description...',
 *   responsibilities: ['Responsibility 1', 'Responsibility 2'],
 *   requirements: ['Skill 1', 'Skill 2'],
 *   applicationInstructions: 'Apply via career portal link...',
 *   applicationLink: 'https://careers.example.com',
 *   officialNoticeLink: 'https://careers.example.com/notice.pdf',
 *   featured: true,
 *   status: 'open'
 * }
 */

import type { Job } from '$lib/types/job.js';

export const corporateJobs: Job[] = [];
