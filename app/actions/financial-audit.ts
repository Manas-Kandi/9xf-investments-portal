'use server';

import { prisma } from '@/lib/db';
import { requireCompany } from '@/lib/company';
import { revalidatePath } from 'next/cache';

const DEFAULT_TASKS = [
  'Bank Statements (24 Months)',
  'General Ledger (24 Months)',
  'Tax Returns (2 Years)',
  'Articles of Incorporation',
  'Operating Agreement / Bylaws',
  'Cap Table (Current)',
  'Board Minutes (2 Years)',
  'Material Contracts',
  'Debt Agreements',
  'Revenue Recognition Policy'
];

export async function getFinancialAudit(raiseId: string) {
  try {
    const company = await requireCompany();
    const raise = await prisma.raise.findUnique({ 
      where: { id: raiseId },
      include: { 
        audit: { 
          include: { 
            tasks: { 
              include: { document: true },
              orderBy: { createdAt: 'asc' }
            } 
          } 
        } 
      }
    });
    
    if (!raise || raise.companyId !== company.id) return null;

    return raise.audit;
  } catch (error) {
    return null;
  }
}

export async function initializeFinancialAudit(raiseId: string) {
  try {
    const company = await requireCompany();
    const raise = await prisma.raise.findUnique({ where: { id: raiseId } });
    if (!raise || raise.companyId !== company.id) return { error: 'Unauthorized' };

    const fiscalYear = new Date().getFullYear() - 1; // Last full year

    await prisma.audit.create({
      data: {
        raiseId,
        fiscalYear,
        status: 'IN_PROGRESS',
        tasks: {
          create: DEFAULT_TASKS.map(title => ({ title }))
        }
      }
    });

    revalidatePath(`/audit`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to start audit' };
  }
}

export async function updateAuditStatus(auditId: string, status: string) {
  await prisma.audit.update({ where: { id: auditId }, data: { status } });
  revalidatePath(`/audit`);
}

export async function linkDocumentToAuditTask(taskId: string, documentId: string) {
  await prisma.auditTask.update({
    where: { id: taskId },
    data: {
      documentId,
      status: 'UPLOADED'
    }
  });
  revalidatePath(`/audit`);
}
