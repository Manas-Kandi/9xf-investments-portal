'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createInvestor(data: { email: string, name: string, phone?: string }) {
  // Check if exists
  let investor = await prisma.investor.findUnique({ where: { email: data.email } });
  
  if (!investor) {
    investor = await prisma.investor.create({
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone,
        kycStatus: 'PENDING'
      }
    });
  }
  return investor;
}

export async function createInvestment(data: { raiseId: string, investorId: string, amount: number }) {
  try {
    const investment = await prisma.investment.create({
      data: {
        raiseId: data.raiseId,
        investorId: data.investorId,
        investorName: 'PENDING', 
        amount: data.amount,
        status: 'PENDING'
      }
    });
    
    const investor = await prisma.investor.findUnique({ where: { id: data.investorId } });
    if (investor) {
      await prisma.investment.update({
        where: { id: investment.id },
        data: { investorName: investor.name }
      });
    }

    return { success: true, investmentId: investment.id };
  } catch (error) {
    return { error: 'Failed to create investment' };
  }
}

export async function signAgreement(investmentId: string) {
  // Mock DocuSign
  await prisma.investment.update({
    where: { id: investmentId },
    data: { status: 'SIGNED' }
  });
  return { success: true };
}
