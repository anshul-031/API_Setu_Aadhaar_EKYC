import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { ApiSetuClient } from '@/lib/api-client';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    logger.info('Received OTP verification request');
    
    const { aadhaarNumber, otp, txnId } = await request.json();
    logger.debug('Request payload', { aadhaarNumber, txnId });

    if (!aadhaarNumber || !otp || !txnId) {
      logger.error('Missing required fields');
      return NextResponse.json(
        { error: 'Aadhaar number, OTP, and transaction ID are required' },
        { status: 400 }
      );
    }

    const API_KEY = process.env.APISETU_API_KEY;
    if (!API_KEY) {
      logger.error('API_KEY not configured');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    const client = new ApiSetuClient(API_KEY);
    const { response, data } = await client.verifyOtp(aadhaarNumber, otp, txnId);

    if (!response.ok) {
      logger.error('APISetu error response', data);
      return NextResponse.json(
        { error: data.message || 'Failed to verify OTP' },
        { status: response.status }
      );
    }

    logger.info('OTP verified successfully');
    return NextResponse.json(data);
  } catch (error) {
    logger.error('Error in OTP verification', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}