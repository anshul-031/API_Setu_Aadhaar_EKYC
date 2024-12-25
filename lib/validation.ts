import * as z from 'zod';

export const ekycFormSchema = z.object({
  aadhaarNumber: z.string()
    .min(12, 'Aadhaar number must be 12 digits')
    .max(12, 'Aadhaar number must be 12 digits')
    .regex(/^\d+$/, 'Aadhaar number must contain only digits'),
  otp: z.string()
    .regex(/^\d+$/, 'OTP must contain only digits')
    .length(6, 'OTP must be 6 digits')
    .optional(),
});