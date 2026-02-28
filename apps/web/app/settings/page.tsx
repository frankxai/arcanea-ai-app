'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { GearSix, User, Bell, SignOut, Trash } from '@/lib/phosphor-icons';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Preferences state (local only for now)
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [activityNotifications, setActivityNotifications] = useState(true);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.push('/');
    } catch {
      setSigningOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-black/40 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 text-center max-w-md">
          <GearSix className="w-12 h-12 text-white/[0.25] mx-auto mb-4" weight="duotone" />
          <h1 className="text-2xl font-display font-bold text-white mb-2">Sign in Required</h1>
          <p className="text-white/[0.40] font-body mb-6">You need to be signed in to access settings.</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-6 py-3 font-body transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <GearSix className="w-8 h-8 text-violet-400" weight="duotone" />
            <h1 className="text-3xl font-display font-bold text-white">Settings</h1>
          </div>
          <p className="text-white/[0.40] font-body">Manage your account and preferences.</p>
        </motion.div>

        <div className="space-y-6">
          {/* Account Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/40 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-cyan-400" weight="duotone" />
              <h2 className="text-lg font-display font-semibold text-white">Account</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/[0.25] font-body mb-1">Display Name</label>
                <div className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white font-body">
                  {user.user_metadata?.display_name || user.user_metadata?.name || user.user_metadata?.full_name || 'Not set'}
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/[0.25] font-body mb-1">Email</label>
                <div className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white font-body">
                  {user.email || 'No email'}
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/[0.25] font-body mb-1">User ID</label>
                <div className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/[0.40] font-mono text-sm truncate">
                  {user.id}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Preferences Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/40 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-amber-400" weight="duotone" />
              <h2 className="text-lg font-display font-semibold text-white">Preferences</h2>
            </div>

            <div className="space-y-5">
              {/* Theme */}
              <div>
                <label className="block text-sm text-white/[0.40] font-body mb-2">Theme</label>
                <div className="flex gap-2">
                  {(['dark', 'light', 'system'] as const).map((option) => (
                    <button
                      key={option}
                      onClick={() => setTheme(option)}
                      className={`px-4 py-2 rounded-xl text-sm font-body capitalize transition-colors ${
                        theme === option
                          ? 'bg-violet-600 text-white'
                          : 'bg-white/[0.04] border border-white/[0.06] text-white/[0.40] hover:text-white hover:border-white/[0.12]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-body">Email Notifications</p>
                  <p className="text-sm text-white/[0.25] font-body">Receive updates about your creations</p>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    emailNotifications ? 'bg-violet-600' : 'bg-white/[0.06]'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                      emailNotifications ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Activity notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-body">Activity Notifications</p>
                  <p className="text-sm text-white/[0.25] font-body">Get notified about likes, follows, and comments</p>
                </div>
                <button
                  onClick={() => setActivityNotifications(!activityNotifications)}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    activityNotifications ? 'bg-violet-600' : 'bg-white/[0.06]'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                      activityNotifications ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.section>

          {/* Danger Zone */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/40 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6"
          >
            <h2 className="text-lg font-display font-semibold text-red-400 mb-6">Danger Zone</h2>

            <div className="space-y-4">
              {/* Sign Out */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-body">Sign Out</p>
                  <p className="text-sm text-white/[0.25] font-body">Sign out of your account on this device</p>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.06] text-white/[0.40] hover:text-white hover:border-white/[0.12] transition-colors font-body disabled:opacity-50"
                >
                  <SignOut className="w-5 h-5" weight="duotone" />
                  {signingOut ? 'Signing out...' : 'Sign Out'}
                </button>
              </div>

              <div className="border-t border-white/[0.04]" />

              {/* Delete Account */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-body">Delete Account</p>
                  <p className="text-sm text-white/[0.25] font-body">Permanently delete your account and all data</p>
                </div>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors font-body"
                >
                  <Trash className="w-5 h-5" weight="duotone" />
                  Delete
                </button>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowDeleteDialog(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-black/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 max-w-md w-full"
            >
              <Trash className="w-10 h-10 text-red-400 mb-4" weight="duotone" />
              <h3 className="text-xl font-display font-bold text-white mb-2">Delete Account?</h3>
              <p className="text-white/[0.40] font-body mb-6">
                This action cannot be undone. All your creations, progress, and data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/[0.06] text-white font-body hover:bg-white/[0.04] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-body hover:bg-red-500 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
