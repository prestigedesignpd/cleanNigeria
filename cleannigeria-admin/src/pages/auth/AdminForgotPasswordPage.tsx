import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Leaf, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function AdminForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      startCountdown();
    }, 1500);
  };

  const startCountdown = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
              <Leaf className="text-white h-7 w-7" />
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden p-8"
        >
          {!isSubmitted ? (
            <>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2 text-center">Reset password</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-center mb-8 text-sm">
                Enter your admin email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@cleannigeria.com"
                      className="pl-10 h-12 bg-neutral-50 dark:bg-neutral-950/50"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending link...' : 'Send reset link'}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="h-8 w-8" />
              </motion.div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Check your email</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8">
                We've sent a password reset link to your email address.
              </p>

              <Button 
                variant="outline"
                className="w-full h-12 rounded-xl mb-4"
                disabled={countdown > 0}
                onClick={handleSubmit(onSubmit)}
              >
                {countdown > 0 ? `Resend link in ${countdown}s` : 'Resend reset link'}
              </Button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/login" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white inline-flex items-center font-medium transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to log in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
