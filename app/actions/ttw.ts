'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireCompany } from '@/lib/company';
import crypto from 'crypto';

export async function getOrCreateTtwCampaign(raiseId: string) {
  try {
    const company = await requireCompany();
    const raise = await prisma.raise.findUnique({ where: { id: raiseId } });
    
    if (!raise || raise.companyId !== company.id) return { error: 'Raise not found' };

    let campaign = await prisma.ttwCampaign.findUnique({ where: { raiseId } });

    if (!campaign) {
      campaign = await prisma.ttwCampaign.create({
        data: {
          raiseId,
          title: `Invest in ${company.legalName}`,
          description: `We are testing the waters to see if there is interest in our offering.`,
          shareToken: crypto.randomBytes(6).toString('hex'),
        }
      });
    }

    return { success: true, campaign };
  } catch (error) {
    console.error('Get TTW failed', error);
    return { error: 'Failed to access campaign' };
  }
}

export async function updateTtwCampaign(raiseId: string, data: { title?: string, description?: string, coverImageUrl?: string, minInterest?: number }) {
  try {
    const company = await requireCompany();
    const raise = await prisma.raise.findUnique({ where: { id: raiseId } });
    
    // Check ownership through raise relation if necessary or assume company check above suffices if we pass raiseId. 
    // Actually we should verify raise belongs to company.
    if (!raise || raise.companyId !== company.id) return { error: 'Unauthorized' };

    await prisma.ttwCampaign.update({
      where: { raiseId },
      data
    });
    
    revalidatePath(`/raise/${raiseId}/ttw`);
    return { success: true };
  } catch (error) {
    return { error: 'Update failed' };
  }
}

export async function toggleTtwStatus(raiseId: string, status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED') {
  try {
    const company = await requireCompany();
    const raise = await prisma.raise.findUnique({ where: { id: raiseId } });
    if (!raise || raise.companyId !== company.id) return { error: 'Unauthorized' };

    await prisma.ttwCampaign.update({
      where: { raiseId },
      data: { status }
    });
    revalidatePath(`/raise/${raiseId}/ttw`);
    return { success: true };
  } catch (error) {
    return { error: 'Status update failed' };
  }
}

// Public actions
export async function getPublicCampaign(shareToken: string) {
  try {
    const campaign = await prisma.ttwCampaign.findUnique({
      where: { shareToken },
      include: {
        raise: {
          include: {
            company: true
          }
        }
      }
    });
    return campaign;
  } catch (error) {
    return null;
  }
}

export async function captureTtwLead(shareToken: string, data: { email: string, name?: string, interestAmount?: number, message?: string }) {
  try {
    const campaign = await prisma.ttwCampaign.findUnique({ where: { shareToken } });
    if (!campaign) return { error: 'Campaign not found' };

    await prisma.ttwLead.create({
      data: {
        campaignId: campaign.id,
        email: data.email,
        name: data.name,
        interestAmount: data.interestAmount,
        message: data.message
      }
    });
    return { success: true };
  } catch (error) {
    console.error('Lead capture error', error);
    return { error: 'Failed to submit interest' };
  }
}

export async function convertLeadsToInvestors(raiseId: string) {
  try {
    const campaign = await prisma.ttwCampaign.findUnique({ where: { raiseId }, include: { leads: true } });
    if (!campaign) return { error: 'No campaign' };

    let count = 0;
    for (const lead of campaign.leads) {
      if (!lead.interestAmount) continue;
      
      // Check if already exists (naive check by name/email match on investorName)
      const identifier = lead.name || lead.email;
      const existing = await prisma.investment.findFirst({
        where: { raiseId, investorName: identifier }
      });
      
      if (!existing) {
        await prisma.investment.create({
          data: {
            raiseId,
            investorName: identifier,
            amount: lead.interestAmount,
            status: 'PENDING'
          }
        });
        count++;
      }
    }
    
    revalidatePath(`/raise/${raiseId}`);
    return { success: true, count };
  } catch (error) {
    console.error('Conversion failed', error);
    return { error: 'Failed to convert leads' };
  }
}
