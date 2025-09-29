'use client';

import React, { useEffect, Suspense } from 'react';
import { FieldValues, SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';
import { useUserRegistration } from '@/lib/hooks/auth.hook';
import CaddForm from '@/components/commonUi/resubaleform/CaddForm';
import CaddInput from '@/components/commonUi/resubaleform/CaddInput';
import { Button } from '@/components/ui/button';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

function SignUpContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect');
  const router = useRouter();

  const methods = useForm<FieldValues>();
  const { handleSubmit } = methods;

  const {
    mutate: handleUserRegistration,
    isSuccess,
    isPending,
    isError,
    error,
  } = useUserRegistration();

  useEffect(() => {
    if (!isPending && isSuccess) {
      toast.success('Registration successful! Please check your email to verify your account.', {
        duration: 5000,
        position: 'top-center',
      });
      // Redirect back to previous page or home instead of forcing email verification
      if (redirect) {
        router.push(redirect);
      } else {
        router.push('/');
      }
    }



    if (
      !isPending &&
      isError &&
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      (error as ApiError).response?.data?.message
    ) {
      const message = (error as ApiError).response!.data!.message!;
      toast.error(
        message.toLowerCase().includes('duplicate')
          ? 'Email is already in use. Try logging in or use another email.'
          : message
      );
    }
  }, [isSuccess, isPending, isError, error, router, redirect]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const userData = {
      ...data,
      profilePhoto: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    };

    localStorage.setItem('emailForVerification', data.email);
    handleUserRegistration(userData);
  };

  return (
  <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen flex justify-center items-center px-4 py-12">
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="shadow-xl rounded-xl p-8 bg-white w-full max-w-md border border-gray-200"
  >
    <div className="text-center mb-8">
      <h3 className="text-3xl font-bold text-gray-900 mb-2 uppercase">
        create your  <span className="text-black"> ACCOUNT</span>
      </h3>
      <div className="w-16 h-1 bg-[#281af0] mx-auto mb-4 rounded-full"></div>
      <p className="text-gray-600">
        Create your account and get started!
      </p>
    </div>

    <CaddForm onSubmit={handleSubmit(onSubmit)}>
      <FormProvider {...methods}>
        <div className="space-y-4">
          <CaddInput 
            label="Name" 
            name="name" 
            placeholder="Enter your name" 
            size="sm" 
          />
          <CaddInput 
            label="Email" 
            name="email" 
            placeholder="Enter your email" 
            size="sm" 
          /> 
          <CaddInput 
            label="Mobile Number" 
            name="mobileNumber" 
            placeholder="Enter your mobile number" 
            size="sm" 
          />
          <CaddInput 
            label="Password" 
            name="password" 
            placeholder="Enter your password" 
            size="sm" 
            type="password" 
          />

          <Button
            className="mt-6 w-full rounded-lg bg-black hover:bg-blue-800 text-white font-semibold py-3 transition-colors duration-300 shadow-md hover:shadow-lg"
            size="lg"
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
            ) : "Register"} 
          </Button>
        </div>
      </FormProvider>
    </CaddForm>

    <div className="mt-6 text-center text-sm text-gray-500">
      Already have an account?{' '}
      <Link href="/login" className="font-medium text-[#230cee] hover:text-[#0d11fc]">
        Sign in
      </Link>
    </div>
  </motion.div>
</div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
}