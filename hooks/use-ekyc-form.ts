import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { generateOtp, verifyOtp } from '@/lib/api/aadhaar';
import { ekycFormSchema } from '@/lib/validation';
import type { EkycFormValues, UserData } from '@/lib/types';

export function useEkycForm() {
  const [state, setState] = useState({
    isLoading: false,
    showOTP: false,
    txnId: '',
    userData: null as UserData | null,
  });

  const { toast } = useToast();

  const form = useForm<EkycFormValues>({
    resolver: zodResolver(ekycFormSchema),
    defaultValues: {
      aadhaarNumber: '',
      otp: '',
    },
  });

  const handleGenerateOTP = useCallback(async (aadhaarNumber: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const data = await generateOtp(aadhaarNumber);
      
      setState(prev => ({
        ...prev,
        txnId: data.txnId,
        showOTP: true,
        isLoading: false,
      }));

      form.setValue('otp', '');
      toast({
        title: 'OTP Sent',
        description: 'Please check your registered mobile number for OTP',
      });
    } catch (error: any) {
      logger.error('OTP generation error', error);
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate OTP',
        variant: 'destructive',
      });
    }
  }, [toast, form]);

  const handleVerifyOTP = useCallback(async (values: EkycFormValues) => {
    if (!values.otp) return;

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const data = await verifyOtp(values.aadhaarNumber, values.otp, state.txnId);
      
      setState(prev => ({
        ...prev,
        userData: data.eKycData,
        isLoading: false,
      }));

      toast({
        title: 'Success',
        description: 'eKYC verification successful',
      });
    } catch (error: any) {
      logger.error('OTP verification error', error);
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: 'Error',
        description: error.message || 'Failed to verify OTP',
        variant: 'destructive',
      });
    }
  }, [state.txnId, toast]);

  const handleSubmit = useCallback(async (values: EkycFormValues) => {
    if (!state.showOTP) {
      await handleGenerateOTP(values.aadhaarNumber);
    } else {
      await handleVerifyOTP(values);
    }
  }, [state.showOTP, handleGenerateOTP, handleVerifyOTP]);

  return {
    form,
    isLoading: state.isLoading,
    showOTP: state.showOTP,
    userData: state.userData,
    handleSubmit,
  };
}