'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    async function checkRecoverySession() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (mounted) {
          setHasRecoverySession(Boolean(session));
        }
      } catch {
        if (mounted) {
          setHasRecoverySession(false);
        }
      }
    }

    void checkRecoverySession();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(error.message);
        return;
      }

      setMessage('Password updated successfully. Redirecting to login...');
      setTimeout(() => {
        router.push('/auth/login');
      }, 1000);
    } catch {
      setError('Unable to reset password right now.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass rounded-2xl p-8">
        <h1 className="text-2xl font-semibold mb-2 text-text-primary">Create New Password</h1>
        <p className="text-text-secondary mb-6">
          Choose a strong new password for your Arcanea account.
        </p>

        {hasRecoverySession === false && !message && (
          <div className="mb-4 rounded-xl border border-fire/20 bg-fire/10 px-4 py-3 text-sm text-fire">
            This recovery link is invalid or expired. Request a new password reset email.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm text-text-secondary mb-2">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-xl border border-white/10 bg-cosmic-surface/50 px-4 py-3 text-text-primary outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm text-text-secondary mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-xl border border-white/10 bg-cosmic-surface/50 px-4 py-3 text-text-primary outline-none focus:border-brand-primary"
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
            disabled={isLoading || hasRecoverySession === false}
            className="w-full rounded-xl bg-gradient-to-r from-brand-primary to-crystal px-4 py-3 font-semibold text-white disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <p className="mt-6 text-sm text-text-secondary">
          Need a new email?{' '}
          <Link href="/auth/forgot-password" className="text-brand-primary hover:text-crystal">
            Request another reset link
          </Link>
        </p>
      </div>
    </div>
  );
}
