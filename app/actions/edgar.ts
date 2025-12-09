'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireCompany } from '@/lib/company';
import { encrypt } from '@/lib/crypto';
import { z } from 'zod';

const edgarSchema = z.object({
  cik: z.string().length(10, 'CIK must be exactly 10 digits').regex(/^\d+$/, 'CIK must be numeric'),
  ccc: z.string().min(8, 'CCC must be at least 8 characters'),
});

export type EdgarData = z.infer<typeof edgarSchema>;

export async function saveEdgarCredentials(data: EdgarData) {
  try {
    const company = await requireCompany();
    
    const validated = edgarSchema.safeParse(data);
    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    const { cik, ccc } = validated.data;
    const encryptedCcc = encrypt(ccc);

    await prisma.company.update({
      where: { id: company.id },
      data: {
        edgarCik: cik,
        edgarCcc: encryptedCcc,
        edgarStatus: 'active',
      },
    });

    revalidatePath('/company/edgar');
    return { success: true };
  } catch (error) {
    console.error('Failed to save EDGAR credentials:', error);
    return { error: 'Failed to save credentials' };
  }
}
