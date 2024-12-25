import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { ApiSetuClient } from '@/lib/api-client';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    logger.info('Received OTP generation request');
    
    const { aadhaarNumber } = await request.json();
    logger.debug('Request payload', { aadhaarNumber });

    if (!aadhaarNumber) {
      logger.error('Missing Aadhaar number');
      return NextResponse.json(
        { error: 'Aadhaar number is required' },
        { status: 400 }
      );
    }

    if (!/^\d{12}$/.test(aadhaarNumber)) {
      logger.error('Invalid Aadhaar format', { aadhaarNumber });
      return NextResponse.json(
        { error: 'Invalid Aadhaar number format' },
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
    const { response, data } = await client.generateOtp(aadhaarNumber);

    if (!response.ok) {
      logger.error('APISetu error response', data);
      return NextResponse.json(
        { error: data.message || 'Failed to generate OTP' },
        { status: response.status }
      );
    }

    logger.info('OTP generated successfully', { txnId: data.txnId });
    return NextResponse.json(data);
  } catch (error) {
    logger.error('Error in OTP generation', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}