'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { shareClassSchema, shareholderSchema, type ShareClassData, type ShareholderData } from '@/lib/validations/cap-table';
import { requireCompany } from '@/lib/company';

export type ActionState = {
  error?: string;
  success?: boolean;
};

// Share Classes
export async function createShareClass(data: ShareClassData): Promise<ActionState> {
  try {
    const company = await requireCompany();
    const validated = shareClassSchema.safeParse(data);
    
    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    const { name, type, authorizedShares, parValue, votingRights, liquidationPreference } = validated.data;

    await prisma.shareClass.create({
      data: {
        companyId: company.id,
        name,
        type,
        authorizedShares: BigInt(authorizedShares),
        parValue: parValue ? parValue : null,
        votingRights,
        liquidationPreference: liquidationPreference ? liquidationPreference : null,
      },
    });

    revalidatePath('/company/cap-table');
    return { success: true };
  } catch (error) {
    console.error('Failed to create share class:', error);
    return { error: 'Failed to create share class' };
  }
}

export async function updateShareClass(id: string, data: ShareClassData): Promise<ActionState> {
  try {
    const company = await requireCompany();
    const existing = await prisma.shareClass.findUnique({ where: { id } });

    if (!existing || existing.companyId !== company.id) {
      return { error: 'Share class not found' };
    }

    const validated = shareClassSchema.safeParse(data);
    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    const { name, type, authorizedShares, parValue, votingRights, liquidationPreference } = validated.data;

    await prisma.shareClass.update({
      where: { id },
      data: {
        name,
        type,
        authorizedShares: BigInt(authorizedShares),
        parValue: parValue ? parValue : null,
        votingRights,
        liquidationPreference: liquidationPreference ? liquidationPreference : null,
      },
    });

    revalidatePath('/company/cap-table');
    return { success: true };
  } catch (error) {
    console.error('Failed to update share class:', error);
    return { error: 'Failed to update share class' };
  }
}

export async function deleteShareClass(id: string): Promise<ActionState> {
  try {
    const company = await requireCompany();
    const existing = await prisma.shareClass.findUnique({ where: { id } });

    if (!existing || existing.companyId !== company.id) {
      return { error: 'Share class not found' };
    }

    await prisma.shareClass.delete({ where: { id } });
    revalidatePath('/company/cap-table');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete share class:', error);
    return { error: 'Failed to delete share class' };
  }
}

// Shareholders
export async function createShareholder(data: ShareholderData): Promise<ActionState> {
  try {
    const company = await requireCompany();
    const validated = shareholderSchema.safeParse(data);

    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    const { name, email, type, shareClassId, shares, vestingSchedule, purchaseDate, purchasePrice } = validated.data;

    await prisma.capTableEntry.create({
      data: {
        companyId: company.id,
        shareClassId,
        shareholderName: name,
        shareholderType: type,
        email: email || null,
        shares: BigInt(shares),
        pricePerShare: purchasePrice || 0, // Fallback
        issueDate: purchaseDate ? new Date(purchaseDate) : new Date(),
        vestingSchedule: vestingSchedule || null,
      },
    });

    revalidatePath('/company/cap-table');
    return { success: true };
  } catch (error) {
    console.error('Failed to create shareholder:', error);
    return { error: 'Failed to create shareholder' };
  }
}

export async function deleteShareholder(id: string): Promise<ActionState> {
  try {
    const company = await requireCompany();
    const existing = await prisma.capTableEntry.findUnique({ where: { id } });

    if (!existing || existing.companyId !== company.id) {
      return { error: 'Shareholder not found' };
    }

    await prisma.capTableEntry.delete({ where: { id } });
    revalidatePath('/company/cap-table');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete shareholder:', error);
    return { error: 'Failed to delete shareholder' };
  }
}

export async function importShareholders(entries: ShareholderData[]): Promise<ActionState> {
  try {
    const company = await requireCompany();
    
    // Process in transaction or batch
    await prisma.$transaction(
      entries.map(entry => {
        // We trust the structure from CSV mapper, but should ideally validate each
        return prisma.capTableEntry.create({
          data: {
            companyId: company.id,
            shareClassId: entry.shareClassId,
            shareholderName: entry.name,
            shareholderType: entry.type,
            email: entry.email || null,
            shares: BigInt(entry.shares),
            pricePerShare: entry.purchasePrice || 0,
            issueDate: entry.purchaseDate ? new Date(entry.purchaseDate) : new Date(),
            vestingSchedule: entry.vestingSchedule || null,
          }
        });
      })
    );

    revalidatePath('/company/cap-table');
    return { success: true };
  } catch (error) {
    console.error('Failed to import shareholders:', error);
    return { error: 'Failed to import shareholders' };
  }
}
