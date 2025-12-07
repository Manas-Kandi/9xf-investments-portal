import { z } from 'zod';

export const TEAM_ROLES = [
  { value: 'OFFICER', label: 'Officer', description: 'CEO, CFO, COO, etc.' },
  { value: 'DIRECTOR', label: 'Director', description: 'Board member' },
  { value: 'SHAREHOLDER', label: '20%+ Shareholder', description: 'Major shareholder' },
  { value: 'OFFICER_DIRECTOR', label: 'Officer & Director', description: 'Both roles' },
  { value: 'ALL', label: 'All Roles', description: 'Officer, Director & Shareholder' },
] as const;

export const OFFICER_TITLES = [
  'Chief Executive Officer (CEO)',
  'Chief Financial Officer (CFO)',
  'Chief Operating Officer (COO)',
  'Chief Technology Officer (CTO)',
  'Chief Marketing Officer (CMO)',
  'President',
  'Vice President',
  'Secretary',
  'Treasurer',
  'General Counsel',
  'Other',
] as const;

export const teamMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  title: z.string().optional(),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  role: z.enum(['OFFICER', 'DIRECTOR', 'SHAREHOLDER', 'OFFICER_DIRECTOR', 'ALL']),
  ownershipPercentage: z.number().min(0).max(100).optional(),
});

export type TeamMemberData = z.infer<typeof teamMemberSchema>;

// Bad Actor Questions based on SEC Rule 506(d)
export const BAD_ACTOR_QUESTIONS = [
  {
    id: 'q1',
    question: 'Has this person been convicted of any felony or misdemeanor in connection with the purchase or sale of any security?',
    shortLabel: 'Securities conviction',
  },
  {
    id: 'q2',
    question: 'Has this person been convicted of any felony or misdemeanor involving fraud, deceit, or making false statements?',
    shortLabel: 'Fraud conviction',
  },
  {
    id: 'q3',
    question: 'Is this person subject to any court order, judgment, or decree restraining them from engaging in securities activities?',
    shortLabel: 'Court order',
  },
  {
    id: 'q4',
    question: 'Has this person been subject to any SEC disciplinary order?',
    shortLabel: 'SEC order',
  },
  {
    id: 'q5',
    question: 'Has this person been suspended or expelled from membership in a securities self-regulatory organization (SRO)?',
    shortLabel: 'SRO suspension',
  },
  {
    id: 'q6',
    question: 'Has this person been subject to a cease-and-desist order by the SEC?',
    shortLabel: 'Cease-and-desist',
  },
  {
    id: 'q7',
    question: 'Has this person been suspended or barred from association with a broker-dealer?',
    shortLabel: 'Broker-dealer bar',
  },
  {
    id: 'q8',
    question: 'Is this person subject to any U.S. Postal Service false representation order?',
    shortLabel: 'Postal order',
  },
] as const;
