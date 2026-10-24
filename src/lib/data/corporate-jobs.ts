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
 * • `applicationDeadline`: Date in 'DD-MM-YYYY' format (e.g. '31-12-2026'). The site dynamically marks expired circulars as closed.
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
 *   applicationStartDate: '01-11-2026',
 *   applicationDeadline: '30-11-2026',
 *   publishedAt: '24-10-2026',
 *   description: 'Full job description...',
 *   responsibilities: ['Responsibility 1', 'Responsibility 2'],
 *   requirements: ['Skill 1', 'Skill 2'],
 *   applicationInstructions: 'Apply via career portal link...',
 *   applicationLink: 'https://careers.example.com',
 *   officialNoticeLink: 'https://careers.example.com/circular',
 *   featured: true,
 *   status: 'open'
 * }
 */

import type { Job } from '$lib/types/job.js';

export const corporateJobs: Job[] = [
    {
        id: 101,
        slug: 'it-officer-bsrea-gulshan-dhaka',
        title: 'IT Officer',
        organization: 'Bangladesh Sustainable and Renewable Energy Association (BSREA)',
        category: 'corporate',
        employmentType: 'full-time',
        location: 'BSREA Secretariat, Gulshan, Dhaka, Bangladesh',
        salary: 'BDT 30,000–35,000/month',
        experience: 'Relevant practical experience preferred',
        description: `BSREA is looking for a skilled, proactive and motivated IT Officer to strengthen its digital platforms and support the Association's digital transformation initiatives.

The selected candidate will contribute to website development, online membership management, digital certification systems, database administration, digital communications, and general IT support.

Joining: As soon as possible.`,
        responsibilities: [
            'Develop, upgrade, and maintain the organization’s website.',
            'Manage the online membership system and digital member directory.',
            'Develop and maintain the digital NOC and certification portal with QR code verification.',
            'Manage databases and online administrative systems.',
            'Manage social media and digital communications.',
            'Provide general IT infrastructure and technical support.'
        ],
        requirements: [
            'Knowledge of WordPress.',
            'Knowledge of HTML and CSS.',
            'Knowledge of JavaScript.',
            'Knowledge of PHP.',
            'Knowledge of MySQL.',
            'Familiarity with related web development technologies.',
            'Relevant practical experience is preferred.'
        ],
        applicationInstructions: 'Send your CV along with relevant documents to info@bsreabd.org. Contact 01788 308088 to confirm your walk-in interview date and time.',
        officialNoticeLink: 'https://lnkd.in/p/g3mCCK2U',
        featured: false,
        status: 'open'
    }, {
        id: 102,
        slug: 'junior-backend-software-engineer-analyzen-dhaka',
        title: 'Junior Backend Software Engineer',
        organization: 'Analyzen Bangladesh Ltd.',
        category: 'corporate',
        employmentType: 'full-time',
        location: 'Level 1, House 1A, Road No. 16/A, Gulshan 1, Dhaka 1212, Bangladesh',
        salary: 'BDT 25,000–40,000/month',
        education: "Bachelor's degree in Computer Science and Engineering, Software Engineering, or a related field preferred",
        experience: '1–2 years of professional software development experience; hands-on PHP and Laravel experience required',
        applicationDeadline: '26-10-2026',
        description: `Analyzen Bangladesh Ltd. is a blended advertising and technology company specializing in digital-first 360° marketing, data analytics, website development, and enterprise software development.

The company is looking for a Junior Backend Software Engineer to build and maintain production web platforms, including content-managed websites, admin panels, REST APIs, and web portals. The role primarily involves PHP, Laravel, and MySQL, with some Node.js services. The selected candidate will work under the guidance of senior developers to develop features, fix bugs, and maintain live applications.

Working days: 5 days per week, with occasional flexibility based on project needs.
Weekly holidays: Friday and Saturday.
Government holidays are observed.
Salary review: Annual.
Lunch: Fully subsidized.
Festival bonuses: 2 per year.
Leave: Sick and casual leave as per company policy.`,
        responsibilities: [
            'Develop and maintain backend features in Laravel applications, including CMS-driven websites and admin panels.',
            'Build and update REST API endpoints for frontend applications and internal services.',
            'Write and optimize MySQL queries, migrations, and Eloquent models.',
            'Investigate and fix bugs in live applications with support from senior developers.',
            'Provide occasional support for urgent live-client issues outside regular office hours when necessary.',
            'Update Blade templates and server-side PHP views when backend changes affect page output.',
            'Collaborate with frontend developers to define API request and response formats and resolve integration issues.',
            'Integrate backend APIs with React and Next.js frontends and debug cross-stack issues.',
            'Follow coding standards, Git branching workflows, and code review processes.',
            'Test changes locally and on staging before release and document modifications.',
            'Use AI coding assistants for coding, debugging, testing, and documentation while reviewing AI-generated changes before committing.',
            'Learn internal tools, including the Laravel-based CMS and project-specific deployment conventions.'
        ],
        requirements: [
            '1–2 years of professional backend or web application development experience.',
            'Hands-on PHP and Laravel experience in real, deployed projects.',
            'Experience integrating backend APIs with React-based frontends.',
            'Experience collaborating on existing codebases using Git and code reviews.',
            'A relevant bachelor’s degree is preferred; equivalent proven professional experience is also accepted.',
            'Fresh graduates are not the primary target, but exceptional candidates with demonstrable Laravel project work may be considered.',
            'Clear written and verbal communication skills in English and Bangla.',
            'Ability to ask questions early, accept code review feedback, and collaborate effectively.',
            'Reliable task management, honest progress reporting, and careful handling of production systems.',
            'Willingness to learn new frameworks and tools as project requirements change.',
            'Solid PHP knowledge, including object-oriented programming and error handling.',
            'Practical Laravel knowledge covering routing, controllers, Eloquent ORM, migrations, middleware, and request validation.',
            'MySQL skills, including joins, aggregations, filtered queries, indexes, and relational schema fundamentals.',
            'REST API knowledge covering JSON, HTTP methods, status codes, and API testing tools such as Postman.',
            'Working knowledge of Blade templating and basic HTML.',
            'Practical React integration knowledge, including components, state, hooks, and data fetching.',
            'Understanding of authentication, sessions or tokens, roles, and permissions.',
            'Strong Git skills, including branching, commits, pull requests, merging, rebasing, and conflict resolution.',
            'Debugging skills using application logs, Laravel debugging tools, and browser developer tools.',
            'Proficiency with AI coding tools such as Claude Code, GitHub Copilot, Cursor, or ChatGPT, including prompt engineering and agentic coding workflows, with the ability to verify output quality, security, and correctness.'
        ],
        applicationInstructions: 'Apply through the official career page or email your application to career@analyzen.com.',
        applicationLink: 'https://www.analyzen.com/career/6ad49280677020866ecdde83',
        officialNoticeLink: 'https://www.analyzen.com/career/6ad49280677020866ecdde83',
        featured: false,
        status: 'open'
    }
];
