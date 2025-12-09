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

export const formCUseOfProceedsSchema = z.object({
  items: z.array(z.object({
    category: z.string().min(1, "Category is required"),
    amount: z.number().min(0, "Amount must be positive"),
    description: z.string().optional(),
  })).min(1, "At least one item required"),
  totalTarget: z.number(),
  // Note: Validation against targetAmount happens in logic/UI usually
});

export const formCRelatedPartySchema = z.object({
  hasTransactions: z.boolean(),
  transactions: z.array(z.object({
    specifiedPerson: z.string().min(1, "Person name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    amount: z.number().min(0),
    description: z.string().min(10, "Description required"),
  })).optional(),
});

export const formCFinancialConditionSchema = z.object({
  history: z.string().min(50, "Please provide detailed operating history"),
  liquidity: z.string().min(50, "Please discuss liquidity and capital resources"),
  capitalResources: z.string().min(50, "Please discuss historical capital resources"),
});

export type FormCUseOfProceedsData = z.infer<typeof formCUseOfProceedsSchema>;
export type FormCRelatedPartyData = z.infer<typeof formCRelatedPartySchema>;
export type FormCFinancialConditionData = z.infer<typeof formCFinancialConditionSchema>;

