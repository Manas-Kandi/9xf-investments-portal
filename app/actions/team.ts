'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { teamMemberSchema, type TeamMemberData } from '@/lib/validations/team';
import { requireCompany } from '@/lib/company';

export type ActionState = {
  error?: string;
  success?: boolean;
};

export async function createTeamMember(data: TeamMemberData): Promise<ActionState> {
  try {
    const company = await requireCompany();
    
    const validated = teamMemberSchema.safeParse(data);
    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    const { name, title, email, role, ownershipPercentage } = validated.data;

    await prisma.teamMember.create({
      data: {
        companyId: company.id,
        name,
        title,
        email: email || null,
        role: role as any, // Enum cast
        ownershipPercentage: ownershipPercentage ? ownershipPercentage : null,
      },
    });

    revalidatePath('/company/team');
    return { success: true };
  } catch (error) {
    console.error('Failed to create team member:', error);
    return { error: 'Failed to create team member' };
  }
}

export async function updateTeamMember(id: string, data: TeamMemberData): Promise<ActionState> {
  try {
    const company = await requireCompany();
    
    // Verify ownership
    const existing = await prisma.teamMember.findUnique({
      where: { id },
    });
    
    if (!existing || existing.companyId !== company.id) {
      return { error: 'Team member not found' };
    }

    const validated = teamMemberSchema.safeParse(data);
    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    const { name, title, email, role, ownershipPercentage } = validated.data;

    await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        title,
        email: email || null,
        role: role as any,
        ownershipPercentage: ownershipPercentage ? ownershipPercentage : null,
      },
    });

    revalidatePath('/company/team');
    return { success: true };
  } catch (error) {
    console.error('Failed to update team member:', error);
    return { error: 'Failed to update team member' };
  }
}

export async function deleteTeamMember(id: string): Promise<ActionState> {
  try {
    const company = await requireCompany();

    const existing = await prisma.teamMember.findUnique({
      where: { id },
    });
    
    if (!existing || existing.companyId !== company.id) {
      return { error: 'Team member not found' };
    }

    await prisma.teamMember.delete({
      where: { id },
    });

    revalidatePath('/company/team');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete team member:', error);
    return { error: 'Failed to delete team member' };
  }
}
