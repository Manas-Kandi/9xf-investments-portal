'use server';

import { prisma } from '@/lib/db';
import { requireCompany } from '@/lib/company';
import { getNextAnnualReportDue } from '@/lib/compliance';
import { revalidatePath } from 'next/cache';

export async function getComplianceStatus() {
  try {
    const company = await requireCompany();
    
    // Check Reg CF raises
    const raises = await prisma.raise.findMany({
      where: { 
        companyId: company.id,
        regulation: 'REG_CF',
        status: { in: ['FILED', 'LIVE', 'CLOSED'] } 
      },
      include: { filings: true }
    });

    if (raises.length === 0) {
      return { hasObligation: false };
    }

    const allFilings = raises.flatMap((r: any) => r.filings);
    const hasTermination = allFilings.some((f: any) => f.formType === 'FORM_C_TR');
    
    if (hasTermination) {
      return { hasObligation: false, terminated: true };
    }

    const nextDue = getNextAnnualReportDue(company.fiscalYearEnd || '12-31');
    
    const lastAr = allFilings
      .filter((f: any) => f.formType === 'FORM_C_AR')
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    return {
      hasObligation: true,
      nextDue,
      lastFiled: lastAr?.createdAt,
      lastFilingId: lastAr?.id,
      raisesCount: raises.length,
      raiseId: raises[0]?.id // Default raise to attach filings to
    };
  } catch (error) {
    return null;
  }
}

export async function createAnnualReport(raiseId: string) {
  try {
    const company = await requireCompany();
    const raise = await prisma.raise.findUnique({ where: { id: raiseId } });
    if (!raise || raise.companyId !== company.id) return { error: 'Unauthorized' };

    await prisma.filing.create({
      data: {
        raiseId,
        formType: 'FORM_C_AR',
        status: 'DRAFT',
        contentJson: {
          fiscalYear: new Date().getFullYear() - 1,
          financialsAttached: false
        }
      }
    });
    
    revalidatePath('/compliance');
    return { success: true };
  } catch (error) {
    return { error: 'Failed' };
  }
}

export async function terminateReporting(raiseId: string, reason: string) {
  try {
    const company = await requireCompany();
    // Validate logic (e.g. <300 shareholders, etc - mocked for now)
    
    await prisma.filing.create({
      data: {
        raiseId,
        formType: 'FORM_C_TR',
        status: 'DRAFT',
        contentJson: { reason }
      }
    });
    
    revalidatePath('/compliance');
    return { success: true };
  } catch (error) {
    return { error: 'Failed' };
  }
}
