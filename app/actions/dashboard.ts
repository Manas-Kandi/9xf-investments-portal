'use server';

import { prisma } from '@/lib/db';
import { requireCompany } from '@/lib/company';
import { revalidatePath } from 'next/cache';

export async function getCampaignStats(raiseId: string) {
  try {
    const company = await requireCompany();
    const raise = await prisma.raise.findUnique({
      where: { id: raiseId },
      include: {
        investments: true
      }
    });

    if (!raise || raise.companyId !== company.id) return null;

    // Use investments table for calculation if Raise.amountRaised isn't updated
    const investments = raise.investments || [];
    const investorCount = investments.length;
    const computedRaised = investments.reduce((sum: number, inv: any) => sum + Number(inv.amount), 0);
    
    // Prefer stored amountRaised if > 0 (synced), else computed
    const amountRaised = Number(raise.amountRaised) > 0 ? Number(raise.amountRaised) : computedRaised;
    const targetAmount = Number(raise.targetAmount) || 1; // Avoid div by 0
    const minimumAmount = Number(raise.minimumAmount) || 0;
    
    const averageInvestment = investorCount > 0 ? amountRaised / investorCount : 0;
    const progress = (amountRaised / targetAmount) * 100;
    const minProgress = minimumAmount > 0 ? (amountRaised / minimumAmount) * 100 : 0;

    // Days Left calculation
    // Reg CF requires 21 days min. Usually there is an endDate.
    // If endDate is set, use it. If not, use filedAt + 1 year or similar default?
    // Let's assume endDate is set if LIVE.
    let daysLeft = 0;
    if (raise.endDate) {
      const now = new Date();
      const end = new Date(raise.endDate);
      const diffTime = end.getTime() - now.getTime();
      daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    } else if (raise.filedAt) {
       // If filed but no end date, maybe 21 day countdown?
       // Let's just return 0 or null if not set.
    }

    return {
      amountRaised,
      targetAmount,
      minimumAmount,
      investorCount,
      averageInvestment,
      progress,
      minProgress,
      daysLeft: daysLeft > 0 ? daysLeft : 0,
      status: raise.status,
      investments: investments.slice(0, 50), // Recent 50
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createMockInvestment(raiseId: string) {
  try {
    const company = await requireCompany();
    const raise = await prisma.raise.findUnique({ where: { id: raiseId } });
    if (!raise || raise.companyId !== company.id) return { error: 'Unauthorized' };

    const amount = Math.floor(Math.random() * 5000) + 100; // 100 - 5100
    const names = ['Alice Smith', 'Bob Jones', 'Charlie Brown', 'Diana Prince', 'Evan Wright'];
    const name = names[Math.floor(Math.random() * names.length)];

    await prisma.investment.create({
      data: {
        raiseId,
        investorName: name,
        amount: amount,
        status: 'CONFIRMED'
      }
    });

    // Update Raise aggregate
    await prisma.raise.update({
      where: { id: raiseId },
      data: {
        amountRaised: { increment: amount }
      }
    });

    revalidatePath(`/raise/${raiseId}`);
    return { success: true };
  } catch (error) {
    return { error: 'Failed' };
  }
}
