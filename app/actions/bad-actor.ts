'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireCompany } from '@/lib/company';
import { z } from 'zod';

const responseSchema = z.object({
  questionId: z.string(),
  response: z.boolean(),
  explanation: z.string().optional(),
});

const submissionSchema = z.object({
  teamMemberId: z.string(),
  responses: z.array(responseSchema),
  attested: z.boolean().refine(val => val === true, "You must attest to the truthfulness of these answers"),
});

export type BadActorSubmission = z.infer<typeof submissionSchema>;

export async function submitBadActorResponses(data: BadActorSubmission) {
  try {
    const company = await requireCompany();
    
    // Verify team member belongs to company
    const teamMember = await prisma.teamMember.findUnique({
      where: { id: data.teamMemberId },
    });

    if (!teamMember || teamMember.companyId !== company.id) {
      return { error: 'Team member not found' };
    }

    // Validate data
    const validated = submissionSchema.safeParse(data);
    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    const { responses } = validated.data;
    const hasFlag = responses.some(r => r.response);

    // Save responses in transaction
    await prisma.$transaction(async (tx) => {
      // Create/Update responses
      for (const resp of responses) {
        await tx.badActorResponse.upsert({
          where: {
            teamMemberId_questionId: {
              teamMemberId: data.teamMemberId,
              questionId: resp.questionId,
            }
          },
          update: {
            response: resp.response,
            explanation: resp.explanation || null,
          },
          create: {
            teamMemberId: data.teamMemberId,
            questionId: resp.questionId,
            response: resp.response,
            explanation: resp.explanation || null,
          }
        });
      }

      // Update team member status
      await tx.teamMember.update({
        where: { id: data.teamMemberId },
        data: {
          badActorStatus: hasFlag ? 'flagged' : 'cleared',
          badActorCompletedAt: new Date(),
        }
      });
    });

    revalidatePath('/company/team');
    return { success: true };
  } catch (error) {
    console.error('Failed to submit bad actor responses:', error);
    return { error: 'Failed to submit responses' };
  }
}
