import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Leaf, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAdminAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMsg('');
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-neutral-950">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-green-900 via-green-950 to-neutral-950 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
            <Leaf className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">CleanNigeria <span className="font-light text-green-400">Admin</span></span>
        </div>

        <div className="relative z-10 max-w-md">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-semibold text-white mb-6 leading-tight"
          >
            Manage the future of waste collection.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-neutral-400 text-lg mb-8"
          >
            The centralized command center for monitoring operations, managing users, and analyzing environmental impact.
          </motion.p>
          
          <div className="flex gap-4 items-center">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-green-900 overflow-hidden bg-neutral-800">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Admin" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-sm text-neutral-400 font-medium">Join 40+ administrators</p>
          </div>
        </div>
        
        <div className="relative z-10 text-neutral-500 text-sm">
          &copy; {new Date().getFullYear()} CleanNigeria Inc. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white dark:bg-neutral-950 relative">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="h-10 w-10 bg-green-500 rounded-xl flex items-center justify-center">
              <Leaf className="text-white h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">CleanNigeria</span>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl font-semibold text-neutral-900 dark:text-white mb-2">Welcome back</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mb-8">Please enter your admin credentials to continue.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@cleannigeria.com"
                  className="h-12 bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus:ring-green-500"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-green-600 dark:text-green-500 hover:text-green-700 font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-12 bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus:ring-green-500 pr-10"
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
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg text-sm text-red-600 dark:text-red-400">
                  {errorMsg}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium text-base rounded-xl transition-all shadow-lg shadow-green-600/20"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Sign in to dashboard"
                )}
              </Button>


            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
