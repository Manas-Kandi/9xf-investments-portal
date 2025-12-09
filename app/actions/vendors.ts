'use server';

import { prisma } from '@/lib/db';
import { requireCompany } from '@/lib/company';
import { SEED_VENDORS } from '@/lib/vendors';
import { revalidatePath } from 'next/cache';

export async function getVendors(filterType?: string) {
  let vendors = SEED_VENDORS;
  if (filterType && filterType !== 'ALL') {
    vendors = vendors.filter(v => v.type === filterType);
  }
  return vendors;
}

export async function engageVendor(raiseId: string, vendorId: string, message: string) {
  try {
    const company = await requireCompany();
    const raise = await prisma.raise.findUnique({ where: { id: raiseId } });
    if (!raise || raise.companyId !== company.id) return { error: 'Unauthorized' };

    const seedVendor = SEED_VENDORS.find(v => v.id === vendorId);
    let dbVendorId = vendorId;
    
    if (seedVendor) {
      const v = await prisma.vendor.upsert({
        where: { id: seedVendor.id },
        update: {},
        create: {
          id: seedVendor.id,
          name: seedVendor.name,
          type: seedVendor.type as any,
          description: seedVendor.description,
          location: seedVendor.location,
          fees: seedVendor.fees,
          specialty: seedVendor.specialty
        }
      });
      dbVendorId = v.id;
    }

    await prisma.vendorEngagement.create({
      data: {
        raiseId,
        vendorId: dbVendorId,
        status: 'PENDING',
        notes: message
      }
    });

    revalidatePath(`/vendors`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to engage vendor' };
  }
}
