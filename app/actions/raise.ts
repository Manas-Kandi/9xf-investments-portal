'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireCompany } from '@/lib/company';
import { createRaiseSchema, type CreateRaiseData } from '@/lib/validations/raise';

export async function createRaise(data: CreateRaiseData) {
  try {
    const company = await requireCompany();
    
    const existing = await prisma.raise.findFirst({
      where: { 
        companyId: company.id,
        status: { in: ['DRAFT', 'FILED', 'LIVE'] }
      }
    });

    if (existing) {
      return { error: 'You already have an active raise.' };
    }

    const validated = createRaiseSchema.safeParse(data);
    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    const raise = await prisma.raise.create({
      data: {
        companyId: company.id,
        regulation: validated.data.regulation,
        targetAmount: validated.data.targetAmount,
        status: 'DRAFT',
      }
    });

    revalidatePath('/raise');
    return { success: true, raiseId: raise.id };
  } catch (error) {
    console.error('Failed to create raise:', error);
    return { error: 'Failed to create raise' };
  }
}
