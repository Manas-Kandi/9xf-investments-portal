'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';
import { companySchema, type CompanyData } from '@/lib/validations/company';

export type ActionState = {
  error?: string;
  success?: boolean;
  companyId?: string;
};

export async function createCompany(data: CompanyData): Promise<ActionState> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || !user.email) {
      return { error: 'Unauthorized' };
    }

    // Validate input data
    const validatedFields = companySchema.safeParse(data);

    if (!validatedFields.success) {
      return { error: 'Invalid fields: ' + validatedFields.error.issues[0].message };
    }

    const {
      legalName,
      dba,
      ein,
      entityType,
      stateOfIncorporation,
      formationDate,
      fiscalYearEnd,
      streetAddress,
      city,
      state,
      zipCode,
      website,
      description,
    } = validatedFields.data;

    // Ensure user exists in Prisma db
    // We use the email to link Supabase user to Prisma user
    // In a real app, you might want to use a webhook or sync mechanism
    // But for now, we'll upsert based on email
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: user.email,
          name: user.user_metadata?.name || user.email.split('@')[0],
          // We don't force the ID to match Supabase ID here, as schema uses CUID
          // But in a production app with RLS you might want them to match
        },
      });
    }

    // Create Company and Link User
    const company = await prisma.company.create({
      data: {
        legalName,
        dba,
        ein: ein || null,
        entityType,
        stateOfIncorporation,
        formationDate: formationDate ? new Date(formationDate) : null,
        fiscalYearEnd,
        streetAddress,
        city,
        state,
        zipCode,
        country: 'US', // Default
        website: website || null,
        description,
        members: {
          create: {
            userId: dbUser.id,
            role: 'OWNER',
          },
        },
      },
    });

    revalidatePath('/company');
    return { success: true, companyId: company.id };
  } catch (error) {
    console.error('Failed to create company:', error);
    return { error: 'Failed to create company. Please try again.' };
  }
}
