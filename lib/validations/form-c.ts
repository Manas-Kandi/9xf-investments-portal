import { z } from 'zod';

export const formCIssuerSchema = z.object({
  legalName: z.string().min(1, "Legal name is required"),
  jurisdiction: z.string().min(1, "State of incorporation is required"),
  entityType: z.string().min(1, "Entity type is required"),
  formationDate: z.string().min(1, "Formation date is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "Zip code is required"),
  website: z.string().url().optional().or(z.literal('')),
  employees: z.number().min(0).optional(),
});

export const formCOfferingSchema = z.object({
  securityType: z.enum(['Common Stock', 'Preferred Stock', 'SAFE', 'Convertible Note', 'Debt']),
  targetAmount: z.number().min(10000),
  maximumAmount: z.number().min(10000),
  pricePerSecurity: z.number().min(0),
  minimumInvestment: z.number().min(0),
  votingRights: z.boolean(),
  useOfProceedsDescription: z.string().min(50, "Please provide a detailed description"),
});

export const formCRiskFactorSchema = z.object({
  title: z.string().min(5, "Risk title is too short"),
  description: z.string().min(20, "Risk description is too short"),
});

export const formCRisksSchema = z.object({
  riskFactors: z.array(formCRiskFactorSchema).min(3, "Please add at least 3 risk factors"),
});

export type FormCIssuerData = z.infer<typeof formCIssuerSchema>;
export type FormCOfferingData = z.infer<typeof formCOfferingSchema>;
export type FormCRiskData = z.infer<typeof formCRisksSchema>;
