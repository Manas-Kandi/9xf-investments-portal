import { z } from 'zod';

export const RAISE_PATHWAYS = [
  {
    id: 'REG_CF',
    name: 'Regulation CF',
    description: 'Equity Crowdfunding',
    limit: '$5M per 12 months',
    investors: 'Accredited & Non-accredited',
    cost: 'Low ($5k - $15k)',
    time: 'Fast (4-8 weeks)',
    audit: 'Not required for first raise under $1.235M',
    pros: ['Lower cost', 'Faster launch', 'No SEC qualification (filing only)'],
    cons: ['Lower cap ($5M)', 'Must use a Funding Portal'],
  },
  {
    id: 'REG_A_TIER_2',
    name: 'Regulation A+ (Tier 2)',
    description: 'Mini-IPO',
    limit: '$75M per 12 months',
    investors: 'Accredited & Non-accredited',
    cost: 'High ($50k - $100k+)',
    time: 'Slow (4-6 months)',
    audit: 'Required (2 years of audited financials)',
    pros: ['High cap ($75M)', 'Market globally', 'Test the waters allowed'],
    cons: ['Expensive', 'Long SEC review', 'Ongoing reporting (semi-annual)'],
  }
] as const;

export const createRaiseSchema = z.object({
  regulation: z.enum(['REG_CF', 'REG_A_TIER_1', 'REG_A_TIER_2']),
  targetAmount: z.number().min(10000, "Minimum target is $10,000"),
});

export type CreateRaiseData = z.infer<typeof createRaiseSchema>;
