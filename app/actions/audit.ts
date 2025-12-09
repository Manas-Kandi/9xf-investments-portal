'use server';

import { prisma } from '@/lib/db';
import { requireCompany } from '@/lib/company';

export async function getAuditLogs() {
  try {
    const company = await requireCompany();
    
    // Get all users associated with this company
    const members = await prisma.companyMember.findMany({
      where: { companyId: company.id },
      select: { userId: true }
    });
    
    const userIds = members.map((m: { userId: string }) => m.userId);

    const logs = await prisma.auditLog.findMany({
      where: {
        userId: { in: userIds }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      take: 100
    });

    return logs;
  } catch (error) {
    return [];
  }
}
