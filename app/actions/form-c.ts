'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireCompany } from '@/lib/company';

export async function getOrCreateFormC(raiseId: string) {
  try {
    const company = await requireCompany();
    const raise = await prisma.raise.findUnique({ where: { id: raiseId } });
    
    if (!raise || raise.companyId !== company.id) return { error: 'Raise not found' };

    let filing = await prisma.filing.findFirst({
      where: { raiseId, formType: 'FORM_C' },
    });

    if (!filing) {
      filing = await prisma.filing.create({
        data: {
          raiseId,
          formType: 'FORM_C',
          status: 'DRAFT',
          contentJson: {},
        }
      });
    }

    return { success: true, filing };
  } catch (error) {
    console.error('Get Form C failed:', error);
    return { error: 'Failed to access Form C' };
  }
}

export async function updateFormC(filingId: string, section: string, data: any) {
  try {
    const company = await requireCompany();
    
    const filing = await prisma.filing.findUnique({ 
      where: { id: filingId },
      include: { raise: true }
    });

    if (!filing || filing.raise.companyId !== company.id) return { error: 'Filing not found' };

    const currentContent = (filing.contentJson as any) || {};
    const updatedContent = {
      ...currentContent,
      [section]: data,
    };

    await prisma.filing.update({
      where: { id: filingId },
      data: {
        contentJson: updatedContent,
        updatedAt: new Date(),
      }
    });

    revalidatePath(`/raise/${filing.raiseId}/form-c`);
    return { success: true };
  } catch (error) {
    console.error('Update Form C failed:', error);
    return { error: 'Failed to save changes' };
  }
}
