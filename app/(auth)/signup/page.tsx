'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignUpPage() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    const supabase = createClient();
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
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
            We&apos;ve sent a verification link to <span className="text-white">{email}</span>. 
            Click the link to verify your account.
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
        <p className="text-white/50 text-sm">Create your account</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSignUp} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2">
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
              placeholder="John Doe"
            />
          </div>

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
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-white/40">Minimum 8 characters</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/70 mb-2">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-white text-neutral-900 font-semibold text-sm rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p className="text-xs text-white/40 text-center">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="text-white/60 hover:text-white transition-colors">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">Privacy Policy</Link>
        </p>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-white/50">
        Already have an account?{' '}
        <Link href="/login" className="text-white hover:text-white/80 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
