/**
 * Government Job Circulars Database
 *
 * DATA ENTRY & MAINTENANCE GUIDE
 * ──────────────────────────────
 * • FILE 1 OF 2 FOR REGULAR DATA ENTRY.
 * • Add new circulars at the TOP of the array so newest appear first.
 * • `id`: Unique number for each job (1, 2, 3...).
 * • `slug`: URL slug (e.g. 'assistant-commissioner-bpsc-dhaka').
 *    This slug dynamically generates the details page: /jobs/[slug]
 * • `category`: Must be 'government'.
 * • `officialNoticeLink`: URL of the official notice PDF or website page (displayed in interactive iframe).
 * • `applicationDeadline`: ISO date 'YYYY-MM-DD' (e.g. '2026-12-31'). The site dynamically marks expired circulars as closed.
 *
 * TEMPLATE FOR NEW CIRCULAR:
 * {
 *   id: 1,
 *   slug: 'post-title-organization-location',
 *   title: 'Official Job Post Title',
 *   organization: 'Ministry or Agency Name',
 *   category: 'government',
 *   employmentType: 'full-time', // 'full-time' | 'part-time' | 'contractual' | 'internship'
 *   location: 'Dhaka, Bangladesh',
 *   vacancies: 50,
 *   salary: 'Grade 9 (BDT 22,000–53,060/month)',
 *   education: "Bachelor's degree or equivalent",
 *   experience: 'Fresh graduates eligible',
 *   ageLimit: '21–30 years',
 *   applicationStartDate: '2026-11-01',
 *   applicationDeadline: '2026-11-30',
 *   publishedAt: '2026-10-24',
 *   description: 'Full official description and overview...',
 *   responsibilities: ['Task 1', 'Task 2'],
 *   requirements: ['Qualification 1', 'Qualification 2'],
 *   applicationInstructions: 'How to apply step by step...',
 *   applicationLink: 'https://bpsc.teletalk.com.bd',
 *   officialNoticeLink: 'https://tax6.teletalk.com.bd/docs/TAX620261018.pdf',
 *   featured: true,
 *   status: 'open'
 * }
 */

import type { Job } from '$lib/types/job.js';

export const governmentJobs: Job[] = [];
