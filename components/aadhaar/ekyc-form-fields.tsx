"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { EkycFormValues } from '@/lib/types';

interface EkycFormFieldsProps {
  control: Control<EkycFormValues>;
  showOTP: boolean;
}

export function EkycFormFields({ control, showOTP }: EkycFormFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="aadhaarNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Aadhaar Number</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter 12 digit Aadhaar number"
                {...field}
                disabled={showOTP}
                maxLength={12}
                pattern="\d*"
                inputMode="numeric"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {showOTP && (
        <FormField
          control={control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OTP</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter 6 digit OTP"
                  {...field}
                  maxLength={6}
                  pattern="\d*"
                  inputMode="numeric"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}