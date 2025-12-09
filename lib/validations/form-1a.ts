import { z } from 'zod';

export const form1APart1Schema = z.object({
  legalName: z.string().min(1, "Required"),
  jurisdiction: z.string().min(1, "Required"),
  entityType: z.string().min(1, "Required"),
  streetAddress: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  zipCode: z.string().min(1, "Required"),
  phone: z.string().min(1, "Required"),
  website: z.string().url().optional().or(z.literal('')),
});

export const form1ACoverSchema = z.object({
  offeringType: z.enum(['Tier 1', 'Tier 2']),
  securitiesOffered: z.string().min(1, "Required"),
  pricePerSecurity: z.number().min(0),
  totalMaxOffering: z.number().min(0),
  commissions: z.number().min(0),
  netProceeds: z.number().min(0),
});

export type Form1APart1Data = z.infer<typeof form1APart1Schema>;
export type Form1ACoverData = z.infer<typeof form1ACoverSchema>;
