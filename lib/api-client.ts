import { logger } from './logger';

const BASE_URL = 'https://staging.apisetu.gov.in/api/v2/ekyc';

export class ApiSetuClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateOtp(aadhaarNumber: string) {
    logger.info('Generating OTP for Aadhaar', { aadhaarNumber });
    
    const response = await fetch(`${BASE_URL}/generate-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-APISETU-APIKEY': this.apiKey,
      },
      body: JSON.stringify({ aadhaar_number: aadhaarNumber }),
    });

    logger.debug('OTP generation response', { 
      status: response.status,
      ok: response.ok 
    });

    const data = await response.json();
    return { response, data };
  }

  async verifyOtp(aadhaarNumber: string, otp: string, txnId: string) {
    logger.info('Verifying OTP', { aadhaarNumber, txnId });
    
    const response = await fetch(`${BASE_URL}/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-APISETU-APIKEY': this.apiKey,
      },
      body: JSON.stringify({
        aadhaar_number: aadhaarNumber,
        otp,
        txn_id: txnId,
      }),
    });

    logger.debug('OTP verification response', { 
      status: response.status,
      ok: response.ok 
    });

    const data = await response.json();
    return { response, data };
  }
}