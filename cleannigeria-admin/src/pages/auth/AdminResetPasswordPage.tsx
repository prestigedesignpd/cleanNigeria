import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Leaf, Eye, EyeOff, CheckCircle2, AlertTriangle, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const resetSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function AdminResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const password = watch('password', '');

  useEffect(() => {
    // Simulate token validation
    setTimeout(() => {
      if (token && token.length > 10) {
        setIsTokenValid(true);
      } else {
        setIsTokenValid(false);
      }
      setIsValidating(false);
    }, 1000);
  }, [token]);

  const onSubmit = async (data: ResetFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length > 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const strength = calculateStrength(password);

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
      </div>
    );
  }

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
          {!isTokenValid ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Invalid or expired link</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8">
                Your password reset link is invalid or has expired. Please request a new one.
              </p>
              <Button asChild className="w-full h-12 rounded-xl">
                <Link to="/forgot-password">Request new reset link</Link>
              </Button>
            </div>
          ) : isSuccess ? (
            <div className="text-center py-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="h-8 w-8" />
              </motion.div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Password reset successful</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8">
                You can now log in to your admin account with your new password.
              </p>
              <Button onClick={() => navigate('/login')} className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl">
                Go to log in
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2 text-center">Create new password</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-center mb-8 text-sm">
                Please enter your new password below.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="h-12 bg-neutral-50 dark:bg-neutral-950/50 pr-10"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {/* Password Strength Meter */}
                  {password.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4].map((level) => (
                        <div 
                          key={level} 
                          className={`h-1.5 w-full rounded-full ${
                            strength >= level 
                              ? (strength <= 2 ? 'bg-amber-500' : 'bg-green-500') 
                              : 'bg-neutral-200 dark:bg-neutral-800'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    className="h-12 bg-neutral-50 dark:bg-neutral-950/50"
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Resetting...
                    </>
                  ) : 'Reset password'}
                </Button>
              </form>
            </>
          )}

          {!isSuccess && isTokenValid && (
            <div className="mt-8 text-center">
              <Link to="/login" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white inline-flex items-center font-medium transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to log in
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
