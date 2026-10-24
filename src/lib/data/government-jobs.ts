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
 * • `officialNoticeLink`: URL of the official notice webpage or portal (displayed in interactive iframe).
 * • `applicationDeadline`: Date in 'DD-MM-YYYY' format (e.g. '31-12-2026'). The site dynamically marks expired circulars as closed.
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
 *   applicationStartDate: '01-11-2026',
 *   applicationDeadline: '30-11-2026',
 *   publishedAt: '24-10-2026',
 *   description: 'Full official description and overview...',
 *   responsibilities: ['Task 1', 'Task 2'],
 *   requirements: ['Qualification 1', 'Qualification 2'],
 *   applicationInstructions: 'How to apply step by step...',
 *   applicationLink: 'https://bpsc.teletalk.com.bd',
 *   officialNoticeLink: 'https://bpsc.teletalk.com.bd/circular',
 *   featured: true,
 *   status: 'open'
 * }
 */

import type { Job } from '$lib/types/job.js';

export const governmentJobs: Job[] = [
    {
        id: 1,
        slug: 'taxes-zone-6-dhaka-job-circular-2026',
        title: 'Taxes Zone-6, Dhaka Job Circular 2026',
        organization: 'Office of the Commissioner of Taxes, Taxes Zone-6, Dhaka',
        category: 'government',
        employmentType: 'full-time',
        location: 'Dhaka, Bangladesh',
        vacancies: 41,
        applicationStartDate: '25-10-2026',
        applicationDeadline: '14-11-2026',
        publishedAt: '18-10-2026',
        description: `The Office of the Commissioner of Taxes, Taxes Zone-6, Dhaka, has published a government recruitment circular for 41 vacancies across seven categories.

Available positions:
1. Computer Operator – 1 vacancy
2. Head Assistant – 8 vacancies
3. Stenographer Cum-Computer Operator – 2 vacancies
4. Stenotypist-Cum-Computer Operator – 9 vacancies
5. Office Assistant-Cum-Computer Typist – 10 vacancies
6. Driver – 2 vacancies
7. Office Sohayok (Office Support Staff) – 9 vacancies

Interested and eligible candidates must submit their applications online through the official TAX6 Teletalk application portal within the specified application period. Candidates should review the official circular for post-specific educational qualifications, experience, age limits, salary grades, and other eligibility requirements.`,
        responsibilities: [
            'Perform duties associated with the selected position as specified in the official recruitment circular.',
            'Follow the applicable government service rules and departmental instructions.'
        ],
        requirements: [
            'Meet the educational qualifications specified for the selected post in the official circular.',
            'Meet the age and other eligibility criteria specified in the official notice.',
            'Provide accurate information and required documents when completing the online application.',
            'Review any post-specific experience, technical skills, or practical examination requirements before applying.'
        ],
        applicationInstructions: 'Visit the official TAX6 Teletalk application portal at https://tax6.teletalk.com.bd. Select the appropriate post, complete the online application form, upload the required photograph and signature, review the application, and submit it. Pay the application fee following the instructions in the official circular. Keep the Applicant’s Copy and payment confirmation for future reference.',
        applicationLink: 'https://tax6.teletalk.com.bd',
        officialNoticeLink: 'https://tax6.teletalk.com.bd/docs/TAX620261018.pdf',
        featured: false,
        status: 'open'
    }
];
