'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireCompany } from '@/lib/company';
import { calculateFinancialRequirement } from '@/lib/financials';

export async function updateFinancialInfo(raiseId: string, data: {
  priorRaisesAmount: number;
  isFirstTimeIssuer: boolean;
}) {
  try {
    const company = await requireCompany();
    const raise = await prisma.raise.findUnique({ where: { id: raiseId } });
    
    if (!raise || raise.companyId !== company.id) return { error: 'Raise not found' };

    const targetAmount = Number(raise.targetAmount);
    const { requirement } = calculateFinancialRequirement(
      targetAmount,
      data.priorRaisesAmount,
      data.isFirstTimeIssuer
    );

    await prisma.raise.update({
      where: { id: raiseId },
      data: {
        priorRaisesAmount: data.priorRaisesAmount,
        isFirstTimeIssuer: data.isFirstTimeIssuer,
        financialTier: requirement,
      }
    });

    revalidatePath(`/raise/${raiseId}/financials`);
    return { success: true, tier: requirement };
  } catch (error) {
    console.error('Failed to update financial info:', error);
    return { error: 'Failed to update financial info' };
  }
}

export async function createFinancialStatement(raiseId: string, data: {
  type: 'BALANCE_SHEET' | 'INCOME_STATEMENT' | 'CASH_FLOW' | 'EQUITY_CHANGES' | 'NOTES' | 'AUDIT_REPORT';
  fileUrl: string;
  periodStart?: Date;
  periodEnd?: Date;
}) {
  try {
    const company = await requireCompany();
    const raise = await prisma.raise.findUnique({ where: { id: raiseId } });
    
    if (!raise || raise.companyId !== company.id) return { error: 'Raise not found' };

    await prisma.financialStatement.create({
      data: {
        raiseId,
        type: data.type,
        fileUrl: data.fileUrl,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        status: 'DRAFT',
      }
    });

    revalidatePath(`/raise/${raiseId}/financials`);
    return { success: true };
  } catch (error) {
    console.error('Failed to create financial statement:', error);
    return { error: 'Failed to create financial statement' };
  }
}
