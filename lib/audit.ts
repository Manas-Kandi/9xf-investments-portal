import { prisma } from '@/lib/db';
import { headers } from 'next/headers';

export async function logAction(
  userId: string | undefined, 
  action: string, 
  entity: string, 
  entityId?: string, 
  metadata?: any
) {
  try {
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
        ipAddress,
        userAgent
      }
    });
  } catch (error) {
    console.error('Failed to log audit action', error);
  }
}
