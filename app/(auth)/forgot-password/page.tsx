'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="space-y-8 text-center">
        <div className="flex items-baseline justify-center text-white mb-2" style={{ letterSpacing: '-0.02em' }}>
          <span className="font-[family-name:var(--font-manrope)] text-3xl font-bold leading-none">9</span>
          <span className="font-[family-name:var(--font-manrope)] text-xl font-light leading-none">x</span>
          <span className="font-[family-name:var(--font-marck)] text-3xl font-medium leading-none">f</span>
          <span className="font-[family-name:var(--font-manrope)] text-3xl font-semibold tracking-tight ml-2">Capital</span>
        </div>
        
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-2">Check your email</h2>
          <p className="text-white/60">
            We&apos;ve sent a password reset link to <span className="text-white">{email}</span>.
          </p>
        </div>

        <Link 
          href="/login" 
          className="inline-block text-white/50 hover:text-white transition-colors text-sm"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Logo */}
      <div className="text-center">
        <div className="flex items-baseline justify-center text-white mb-2" style={{ letterSpacing: '-0.02em' }}>
          <span className="font-[family-name:var(--font-manrope)] text-3xl font-bold leading-none">9</span>
          <span className="font-[family-name:var(--font-manrope)] text-xl font-light leading-none">x</span>
          <span className="font-[family-name:var(--font-marck)] text-3xl font-medium leading-none">f</span>
          <span className="font-[family-name:var(--font-manrope)] text-3xl font-semibold tracking-tight ml-2">Capital</span>
        </div>
        <p className="text-white/50 text-sm">Reset your password</p>
      </div>

      {/* Form */}
      <form onSubmit={handleReset} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
            placeholder="you@company.com"
          />
          <p className="mt-2 text-xs text-white/40">
            Enter the email associated with your account and we&apos;ll send you a reset link.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-white text-neutral-900 font-semibold text-sm rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send reset link'}
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-white/50">
        Remember your password?{' '}
        <Link href="/login" className="text-white hover:text-white/80 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
