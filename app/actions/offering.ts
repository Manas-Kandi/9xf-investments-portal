'use server';

import { prisma } from '@/lib/db';
import { requireCompany } from '@/lib/company';
import { revalidatePath } from 'next/cache';

export async function getOfferingConfig(raiseId: string) {
  try {
    const company = await requireCompany();
    const raise = await prisma.raise.findUnique({ where: { id: raiseId } });
    if (!raise || raise.companyId !== company.id) return null;
    return (raise.offeringConfig as any) || {};
  } catch (error) {
    return {};
  }
}

export async function updateOfferingConfig(raiseId: string, data: any) {
  try {
    const company = await requireCompany();
    const raise = await prisma.raise.findUnique({ where: { id: raiseId } });
    if (!raise || raise.companyId !== company.id) return { error: 'Unauthorized' };

    // Generate slug if not exists
    let slug = raise.slug;
    if (!slug) {
      slug = company.legalName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
    }

    await prisma.raise.update({
      where: { id: raiseId },
      data: {
        offeringConfig: data,
        slug
      }
    });
    
    revalidatePath(`/raise/${raiseId}/offering`);
    return { success: true, slug };
  } catch (error) {
    return { error: 'Failed' };
  }
}

export async function getPublicOffering(slug: string) {
  try {
    return await prisma.raise.findUnique({
      where: { slug },
      include: {
        company: true,
        filings: { 
          where: { formType: { in: ['FORM_C', 'FORM_1_A'] } },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
  } catch (error) {
    return null;
  }
}
