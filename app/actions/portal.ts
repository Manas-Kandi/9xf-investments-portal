'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireCompany } from '@/lib/company';
import { SEED_PORTALS } from '@/lib/portals';

export async function selectPortal(raiseId: string, portalId: string) {
  try {
    const company = await requireCompany();
    
    const raise = await prisma.raise.findUnique({
      where: { id: raiseId },
    });

    if (!raise || raise.companyId !== company.id) {
      return { error: 'Raise not found' };
    }

    const portal = SEED_PORTALS.find(p => p.id === portalId);
    if (!portal) return { error: 'Invalid portal selected' };

    // Upsert Portal definition
    try {
      await prisma.portal.upsert({
        where: { id: portal.id },
        update: {},
        create: {
          id: portal.id,
          name: portal.name,
          logoUrl: portal.logoUrl,
          website: portal.website,
          cashFeePercent: portal.cashFeePercent,
          equityFeePercent: portal.equityFeePercent,
          features: portal.features,
        }
      });
    } catch (e) {
      console.warn('Could not sync portal definition (schema might be outdated)', e);
    }

    // Update Raise
    await prisma.raise.update({
      where: { id: raiseId },
      data: {
        portalId: portal.id,
        portalName: portal.name,
        portalStatus: 'applied', // Assumes schema update applied
      }
    });

    revalidatePath(`/raise/${raiseId}/portal`);
    return { success: true };
  } catch (error) {
    console.error('Failed to select portal:', error);
    return { error: 'Failed to select portal' };
  }
}
