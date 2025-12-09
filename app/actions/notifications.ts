'use server';

import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { sendEmail } from '@/lib/email';

export async function getNotifications() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  return await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 20
  });
}

export async function markAsRead(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await prisma.notification.updateMany({
    where: { id, userId: user.id },
    data: { readAt: new Date() }
  });
  revalidatePath('/dashboard');
}

export async function markAllAsRead() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await prisma.notification.updateMany({
    where: { userId: user.id, readAt: null },
    data: { readAt: new Date() }
  });
  revalidatePath('/dashboard');
}

export async function sendNotification(userId: string, type: 'DEADLINE' | 'ACTION_REQUIRED' | 'UPDATE' | 'INFO', title: string, body: string, actionUrl?: string) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        actionUrl
      }
    });
    
    if (['DEADLINE', 'ACTION_REQUIRED'].includes(type)) {
       const user = await prisma.user.findUnique({ where: { id: userId } });
       if (user?.email) {
         await sendEmail(user.email, title, body);
       }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Notification failed', error);
    return { error: 'Failed' };
  }
}
