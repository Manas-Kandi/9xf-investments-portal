'use server';

import { prisma } from '@/lib/db';
import { requireCompany } from '@/lib/company';
import { revalidatePath } from 'next/cache';

export async function getSecReviewStatus(raiseId: string) {
  try {
    const company = await requireCompany();
    const raise = await prisma.raise.findUnique({
      where: { id: raiseId },
      include: { filings: { include: { secComments: true } } }
    });
    if (!raise || raise.companyId !== company.id) return null;

    const mainFiling = raise.filings.find((f: any) => f.formType === 'FORM_1_A');
    if (!mainFiling) return { status: 'NOT_FILED' };

    const amendments = raise.filings.filter((f: any) => f.formType === 'FORM_1_A_A');
    
    let status = 'FILED';
    if (mainFiling.secComments.length > 0) status = 'COMMENTS_RECEIVED';
    // If amendments exist and most recent filing is Amendment, maybe status is 'AMENDMENT_FILED'
    if (amendments.length > 0) status = 'AMENDMENT_FILED';
    if (mainFiling.qualificationDate) status = 'QUALIFIED';

    return {
      status,
      mainFiling,
      amendments,
      comments: mainFiling.secComments.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    };
  } catch (error) {
    return null;
  }
}

export async function addSecComment(filingId: string, commentText: string, letterDate: string) {
  await prisma.secComment.create({
    data: {
      filingId,
      commentText,
      letterDate: new Date(letterDate),
      status: 'OPEN'
    }
  });
  revalidatePath(`/raise`); 
}

export async function updateSecResponse(commentId: string, responseDraft: string) {
  await prisma.secComment.update({
    where: { id: commentId },
    data: { responseDraft, status: 'DRAFTED' }
  });
  revalidatePath(`/raise`);
}

export async function resolveComment(commentId: string) {
  await prisma.secComment.update({
    where: { id: commentId },
    data: { status: 'RESOLVED' }
  });
  revalidatePath(`/raise`);
}

export async function createAmendment(raiseId: string) {
  await prisma.filing.create({
    data: {
      raiseId,
      formType: 'FORM_1_A_A',
      status: 'DRAFT'
    }
  });
  revalidatePath(`/raise`);
}

export async function markQualified(filingId: string, date: string) {
  await prisma.filing.update({
    where: { id: filingId },
    data: { qualificationDate: new Date(date), status: 'QUALIFIED' }
  });
  revalidatePath(`/raise`);
}
