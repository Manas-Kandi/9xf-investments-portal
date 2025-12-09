'use server';

import { prisma } from '@/lib/db';
import { requireCompany } from '@/lib/company';
import { revalidatePath } from 'next/cache';

export async function uploadDocument(formData: FormData) {
  try {
    const company = await requireCompany();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    const raiseId = formData.get('raiseId') as string | null;

    if (!file) return { error: 'No file provided' };

    // In a real app, upload to S3/R2 here.
    // We will mock the URL.
    const mockUrl = `https://storage.example.com/${company.id}/${Date.now()}-${file.name}`;

    await prisma.document.create({
      data: {
        companyId: company.id,
        raiseId: raiseId || undefined,
        name: file.name,
        url: mockUrl,
        category: category as any, // 'FINANCIAL', etc.
        mimeType: file.type,
        size: file.size,
        uploadedBy: 'User', // Would get from session
      }
    });

    revalidatePath('/documents');
    return { success: true };
  } catch (error) {
    console.error('Upload failed', error);
    return { error: 'Upload failed' };
  }
}

export async function getDocuments(query?: string, category?: string) {
  try {
    const company = await requireCompany();
    
    return await prisma.document.findMany({
      where: {
        companyId: company.id,
        name: { contains: query, mode: 'insensitive' },
        category: category && category !== 'ALL' ? (category as any) : undefined,
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    return [];
  }
}

export async function deleteDocument(id: string) {
  try {
    const company = await requireCompany();
    const doc = await prisma.document.findUnique({ where: { id } });
    if (doc?.companyId !== company.id) return { error: 'Unauthorized' };

    await prisma.document.delete({ where: { id } });
    revalidatePath('/documents');
    return { success: true };
  } catch (error) {
    return { error: 'Delete failed' };
  }
}
