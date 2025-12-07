import { z } from 'zod';

// EIN validation: XX-XXXXXXX format
const einRegex = /^\d{2}-\d{7}$/;

// US States
export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' },
] as const;

export const ENTITY_TYPES = [
  { value: 'C_CORP', label: 'C Corporation', description: 'Standard corporation with double taxation' },
  { value: 'S_CORP', label: 'S Corporation', description: 'Pass-through taxation, limited shareholders' },
  { value: 'LLC', label: 'LLC', description: 'Limited liability company with flexible taxation' },
  { value: 'PBC', label: 'Public Benefit Corporation', description: 'For-profit with social mission' },
  { value: 'LP', label: 'Limited Partnership', description: 'General and limited partners' },
  { value: 'OTHER', label: 'Other', description: 'Other entity type' },
] as const;

export const FISCAL_YEAR_ENDS = [
  { value: '01-31', label: 'January 31' },
  { value: '02-28', label: 'February 28' },
  { value: '03-31', label: 'March 31' },
  { value: '04-30', label: 'April 30' },
  { value: '05-31', label: 'May 31' },
  { value: '06-30', label: 'June 30' },
  { value: '07-31', label: 'July 31' },
  { value: '08-31', label: 'August 31' },
  { value: '09-30', label: 'September 30' },
  { value: '10-31', label: 'October 31' },
  { value: '11-30', label: 'November 30' },
  { value: '12-31', label: 'December 31' },
] as const;

// Step 1: Basic Info
export const companyBasicSchema = z.object({
  legalName: z.string().min(2, 'Legal name must be at least 2 characters'),
  dba: z.string().optional(),
  ein: z.string().regex(einRegex, 'EIN must be in XX-XXXXXXX format').optional().or(z.literal('')),
  entityType: z.enum(['C_CORP', 'S_CORP', 'LLC', 'PBC', 'LP', 'OTHER']),
});

// Step 2: Incorporation
export const companyIncorporationSchema = z.object({
  stateOfIncorporation: z.string().min(2, 'Please select a state'),
  formationDate: z.string().optional(),
  fiscalYearEnd: z.string().optional(),
});

// Step 3: Address
export const companyAddressSchema = z.object({
  streetAddress: z.string().min(5, 'Please enter a valid street address'),
  city: z.string().min(2, 'Please enter a city'),
  state: z.string().min(2, 'Please select a state'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),
});

// Step 4: Additional Info
export const companyAdditionalSchema = z.object({
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  description: z.string().max(500, 'Description must be under 500 characters').optional(),
});

// Combined schema
export const companySchema = companyBasicSchema
  .merge(companyIncorporationSchema)
  .merge(companyAddressSchema)
  .merge(companyAdditionalSchema);

export type CompanyBasicData = z.infer<typeof companyBasicSchema>;
export type CompanyIncorporationData = z.infer<typeof companyIncorporationSchema>;
export type CompanyAddressData = z.infer<typeof companyAddressSchema>;
export type CompanyAdditionalData = z.infer<typeof companyAdditionalSchema>;
export type CompanyData = z.infer<typeof companySchema>;

// Helper to format EIN as user types
export function formatEIN(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 9);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}-${digits.slice(2)}`;
}
