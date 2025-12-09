'use server';

import { prisma } from '@/lib/db';
import { requireCompany } from '@/lib/company';
import { revalidatePath } from 'next/cache';

export async function getOrCreateForm1A(raiseId: string) {
  try {
    const company = await requireCompany();
    const raise = await prisma.raise.findUnique({ where: { id: raiseId } });
    if (!raise || raise.companyId !== company.id) return { error: 'Unauthorized' };

    let filing = await prisma.filing.findFirst({
      where: { raiseId, formType: 'FORM_1_A' }
    });

    if (!filing) {
      filing = await prisma.filing.create({
        data: {
          raiseId,
          formType: 'FORM_1_A',
          status: 'DRAFT',
          contentJson: {}
        }
      });
    }

    return { success: true, filing };
  } catch (error) {
    return { error: 'Failed' };
  }
}

export async function updateForm1A(filingId: string, section: string, data: any) {
  try {
    const company = await requireCompany();
    const filing = await prisma.filing.findUnique({ where: { id: filingId }, include: { raise: true } });
    if (!filing || filing.raise.companyId !== company.id) return { error: 'Unauthorized' };

    const content = (filing.contentJson as any) || {};
    content[section] = data;

    await prisma.filing.update({
      where: { id: filingId },
      data: { contentJson: content }
    });

    revalidatePath(`/raise/${filing.raiseId}/form-1a`);
    return { success: true };
  } catch (error) {
    return { error: 'Failed' };
  }
}
