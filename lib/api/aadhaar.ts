import { logger } from '@/lib/logger';

export async function generateOtp(aadhaarNumber: string) {
  logger.info('Generating OTP', { aadhaarNumber });
  
  const response = await fetch('/api/aadhaar/generate-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ aadhaarNumber }),
  });

  const data = await response.json();
  logger.debug('OTP generation response', { status: response.status, data });

  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate OTP');
  }

  return data;
}

export async function verifyOtp(aadhaarNumber: string, otp: string, txnId: string) {
  logger.info('Verifying OTP');
  
  const response = await fetch('/api/aadhaar/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ aadhaarNumber, otp, txnId }),
  });

  const data = await response.json();
  logger.debug('OTP verification response', { status: response.status, data });

  if (!response.ok) {
    throw new Error(data.error || 'Failed to verify OTP');
  }

  return data;
}