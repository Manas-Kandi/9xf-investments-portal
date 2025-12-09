'use server';

import { prisma } from '@/lib/db';
import { requireCompany } from '@/lib/company';
import { revalidatePath } from 'next/cache';

export async function getClosingStatus(raiseId: string) {
  try {
    const company = await requireCompany();
    const raise = await prisma.raise.findUnique({
      where: { id: raiseId },
      include: { filings: true }
    });
    if (!raise || raise.companyId !== company.id) return null;

    const amountRaised = Number(raise.amountRaised);
    const targetAmount = Number(raise.targetAmount);
    const minAmount = Number(raise.minimumAmount || 0);
    
    const progress = (amountRaised / targetAmount) * 100;
    const canClose = amountRaised >= minAmount;

    // Check for existing C-U filings
    const progressUpdates = raise.filings
      .filter((f: any) => f.formType === 'FORM_C_U')
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
    const has50PercentFiling = progressUpdates.some((f: any) => (f.contentJson as any)?.milestone === '50%');
    const has100PercentFiling = progressUpdates.some((f: any) => (f.contentJson as any)?.milestone === '100%');

    return {
      canClose,
      amountRaised,
      targetAmount,
      minAmount,
      progress,
      progressUpdates,
      milestones: {
        fifty: has50PercentFiling,
        hundred: has100PercentFiling
      }
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function generateProgressUpdate(raiseId: string, milestone: '50%' | '100%' | 'Other') {
  try {
    const company = await requireCompany();
    const raise = await prisma.raise.findUnique({ where: { id: raiseId } });
    if (!raise || raise.companyId !== company.id) return { error: 'Unauthorized' };

    await prisma.filing.create({
      data: {
        raiseId,
        formType: 'FORM_C_U',
        status: 'DRAFT',
        contentJson: {
          milestone,
          amountRaised: Number(raise.amountRaised),
          date: new Date().toISOString(),
          description: milestone === 'Other' 
            ? `Interim closing of the offering.`
            : `Progress update: Reached ${milestone} of target offering amount.`
        }
      }
    });

    revalidatePath(`/raise/${raiseId}/close`);
    return { success: true };
  } catch (error) {
    return { error: 'Failed to generate filing' };
  }
}
