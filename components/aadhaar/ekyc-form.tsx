"use client";

import { Loader2 } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EkycFormFields } from './ekyc-form-fields';
import { UserDetails } from './user-details';
import { useEkycForm } from '@/hooks/use-ekyc-form';

export function EkycForm() {
  const { form, isLoading, showOTP, userData, handleSubmit } = useEkycForm();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Aadhaar eKYC Verification</CardTitle>
        <CardDescription>
          Verify your identity using Aadhaar eKYC
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <EkycFormFields control={form.control} showOTP={showOTP} />
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {showOTP ? 'Verify OTP' : 'Generate OTP'}
            </Button>
          </form>
        </Form>

        {userData && <UserDetails userData={userData} />}
      </CardContent>
    </Card>
  );
}