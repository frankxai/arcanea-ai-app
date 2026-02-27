'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const origin = window.location.origin;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/auth/reset-password`,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setMessage('Password reset link sent. Check your email.');
      router.refresh();
    } catch {
      setError('Unable to send reset email right now.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass rounded-2xl p-8">
        <h1 className="text-2xl font-semibold mb-2 text-text-primary">Reset Password</h1>
        <p className="text-text-secondary mb-6">
          Enter your account email and we will send a recovery link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-text-secondary mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-cosmic-surface/50 px-4 py-3 text-text-primary outline-none focus:border-brand-primary"
              placeholder="creator@arcanea.ai"
            />
          </div>

          {error && (
            <p className="text-sm text-fire" role="alert">
              {error}
            </p>
          )}
          {message && <p className="text-sm text-emerald-400">{message}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-gradient-to-r from-brand-primary to-crystal px-4 py-3 font-semibold text-white disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-6 text-sm text-text-secondary">
          Remembered your password?{' '}
          <Link href="/auth/login" className="text-brand-primary hover:text-crystal">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
