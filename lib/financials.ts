export type FinancialRequirement = 'CEO_CERTIFIED' | 'REVIEWED' | 'AUDITED';

export interface FinancialTierResult {
  requirement: FinancialRequirement;
  description: string;
  threshold: string;
}

export function calculateFinancialRequirement(
  targetAmount: number,
  priorRaisesAmount: number = 0,
  isFirstTimeIssuer: boolean = true
): FinancialTierResult {
  // Reg CF aggregation rule: Target + Amount raised in reliance on Reg CF in prior 12 months
  const totalAmount = targetAmount + priorRaisesAmount;

  // Thresholds (adjusted for inflation, Reg CF limits)
  const T1_LIMIT = 124000;
  const T2_LIMIT = 618000;
  const T3_LIMIT = 1235000;
  
  if (totalAmount <= T1_LIMIT) {
    return {
      requirement: 'CEO_CERTIFIED',
      description: 'Financial statements certified by the principal executive officer to be true and complete. Tax returns required.',
      threshold: 'Under $124k'
    };
  }
  
  if (totalAmount <= T2_LIMIT) {
    return {
      requirement: 'REVIEWED',
      description: 'Financial statements reviewed by an independent public accountant.',
      threshold: '$124k - $618k'
    };
  }

  if (totalAmount <= T3_LIMIT) {
    return {
      requirement: 'REVIEWED',
      description: 'Financial statements reviewed by an independent public accountant.',
      threshold: '$618k - $1.235M'
    };
  }

  // Above T3 ($1.235M) up to $5M
  if (isFirstTimeIssuer) {
    return {
      requirement: 'REVIEWED',
      description: 'Financial statements reviewed by an independent public accountant (First-time issuer exception).',
      threshold: '$1.235M - $5M (First Time)'
    };
  }

  return {
    requirement: 'AUDITED',
    description: 'Financial statements audited by an independent public accountant.',
    threshold: '$1.235M - $5M (Repeat Issuer)'
  };
}
