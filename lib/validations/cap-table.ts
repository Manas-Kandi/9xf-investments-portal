import { z } from 'zod';

export const SHARE_CLASS_TYPES = [
  { value: 'COMMON', label: 'Common Stock', description: 'Standard voting shares' },
  { value: 'PREFERRED', label: 'Preferred Stock', description: 'Priority in liquidation' },
  { value: 'OPTION_POOL', label: 'Option Pool', description: 'Reserved for employee grants' },
  { value: 'WARRANT', label: 'Warrants', description: 'Right to purchase shares' },
  { value: 'CONVERTIBLE', label: 'Convertible Note', description: 'Debt converting to equity' },
  { value: 'SAFE', label: 'SAFE', description: 'Simple Agreement for Future Equity' },
] as const;

export const SHAREHOLDER_TYPES = [
  { value: 'FOUNDER', label: 'Founder' },
  { value: 'EMPLOYEE', label: 'Employee' },
  { value: 'INVESTOR', label: 'Investor' },
  { value: 'ADVISOR', label: 'Advisor' },
  { value: 'INSTITUTION', label: 'Institution' },
  { value: 'OTHER', label: 'Other' },
] as const;

// Share class colors for the pie chart
export const SHARE_CLASS_COLORS: Record<string, string> = {
  COMMON: '#3b82f6',      // Blue
  PREFERRED: '#8b5cf6',   // Purple
  OPTION_POOL: '#10b981', // Green
  WARRANT: '#f59e0b',     // Amber
  CONVERTIBLE: '#ef4444', // Red
  SAFE: '#ec4899',        // Pink
};

export const shareClassSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['COMMON', 'PREFERRED', 'OPTION_POOL', 'WARRANT', 'CONVERTIBLE', 'SAFE']),
  authorizedShares: z.number().min(0, 'Must be 0 or greater'),
  parValue: z.number().min(0, 'Must be 0 or greater').optional(),
  votingRights: z.boolean().default(true),
  liquidationPreference: z.number().min(0).optional(),
});

export const shareholderSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  type: z.enum(['FOUNDER', 'EMPLOYEE', 'INVESTOR', 'ADVISOR', 'INSTITUTION', 'OTHER']),
  shareClassId: z.string().min(1, 'Share class is required'),
  shares: z.number().min(0, 'Must be 0 or greater'),
  vestingSchedule: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchasePrice: z.number().min(0).optional(),
});

export type ShareClassData = z.infer<typeof shareClassSchema>;
export type ShareholderData = z.infer<typeof shareholderSchema>;

// Helper to format large numbers
export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

// Helper to calculate ownership percentage
export function calculateOwnership(shares: number, totalShares: number): number {
  if (totalShares === 0) return 0;
  return (shares / totalShares) * 100;
}

// CSV parsing helper
export function parseCSV(text: string): string[][] {
  const lines = text.trim().split('\n');
  return lines.map(line => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  });
}
