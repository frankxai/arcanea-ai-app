'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { createClient } from '@/lib/supabase/client';
import {
  getProfile,
  updateProfile,
} from '@/lib/database/services/profile-service';
import type { Profile, GuardianName, AcademyHouse, GateName } from '@/lib/database/types/api-responses';
import {
  GearSix,
  User,
  Bell,
  SignOut,
  Trash,
  Camera,
  CheckCircle,
  WarningCircle,
  Spinner,
} from '@/lib/phosphor-icons';

// ─── Constants ────────────────────────────────────────────────────────────────

const GUARDIANS: GuardianName[] = [
  'Lyssandria', 'Leyla', 'Draconia', 'Maylinn',
  'Alera', 'Lyria', 'Aiyami', 'Elara', 'Ino', 'Shinkami',
];

const GATES: GateName[] = [
  'Foundation', 'Flow', 'Fire', 'Heart',
  'Voice', 'Sight', 'Crown', 'Starweave', 'Unity', 'Source',
];

const ACADEMY_HOUSES: AcademyHouse[] = [
  'Lumina', 'Nero', 'Pyros', 'Aqualis', 'Terra', 'Ventus', 'Synthesis',
];

// ─── Types ────────────────────────────────────────────────────────────────────

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

interface FormState {
  displayName: string;
  bio: string;
  guardian: GuardianName | '';
  academyHouse: AcademyHouse | '';
  activeGate: GateName | '';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, signOut } = useAuth();
  const supabase = useRef(createClient()).current;

  // Profile state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Form state
  const [form, setForm] = useState<FormState>({
    displayName: '',
    bio: '',
    guardian: '',
    academyHouse: '',
    activeGate: '',
  });

  // Avatar state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save / feedback state
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Preferences (persisted in profile.metadata)
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [activityNotifications, setActivityNotifications] = useState(true);

  // ─── Load profile on mount ─────────────────────────────────────────────────

  const loadProfile = useCallback(async () => {
    if (!user) return;
    setProfileLoading(true);
    try {
      const data = await getProfile(supabase, user.id);
      if (data) {
        setProfile(data);
        setForm({
          displayName: data.displayName ?? '',
          bio: data.bio ?? '',
          guardian: (data.guardian as GuardianName) ?? '',
          academyHouse: (data.academyHouse as AcademyHouse) ?? '',
          activeGate: (data.activeGate as GateName) ?? '',
        });
        if (data.avatarUrl) setAvatarPreview(data.avatarUrl);
        // Load persisted preferences from metadata
        const prefs = data.metadata as Record<string, unknown> | null;
        if (prefs) {
          if (prefs.theme === 'dark' || prefs.theme === 'light' || prefs.theme === 'system') setTheme(prefs.theme);
          if (typeof prefs.emailNotifications === 'boolean') setEmailNotifications(prefs.emailNotifications);
          if (typeof prefs.activityNotifications === 'boolean') setActivityNotifications(prefs.activityNotifications);
        }
      }
    } catch {
      // profile may not exist yet — that is acceptable
    } finally {
      setProfileLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (!authLoading && user) {
      loadProfile();
    } else if (!authLoading && !user) {
      setProfileLoading(false);
    }
  }, [authLoading, user, loadProfile]);

  // ─── Avatar handling ───────────────────────────────────────────────────────

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return profile?.avatarUrl ?? null;

    const ext = avatarFile.name.split('.').pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, avatarFile, { upsert: true });

    if (error) {
      console.error('Avatar upload failed:', error.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(path);

    return urlData.publicUrl ?? null;
  };

  // ─── Save profile ──────────────────────────────────────────────────────────

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaveStatus('saving');
    setErrorMessage('');

    try {
      // 1. Upload avatar if changed
      const avatarUrl = avatarFile ? await uploadAvatar() : (profile?.avatarUrl ?? null);

      // 2. Build updates object — only include non-empty optional fields
      const existingMeta = (profile?.metadata ?? {}) as Record<string, unknown>;
      const updates: Partial<Profile> = {
        displayName: form.displayName.trim() || (profile?.displayName ?? ''),
        bio: form.bio.trim() || null,
        avatarUrl,
        guardian: (form.guardian as GuardianName) || null,
        academyHouse: (form.academyHouse as AcademyHouse) || null,
        activeGate: (form.activeGate as GateName) || null,
        metadata: { ...existingMeta, theme, emailNotifications, activityNotifications },
      };

      const updated = await updateProfile(supabase, user.id, updates);

      if (!updated) {
        throw new Error('Profile update returned no data.');
      }

      setProfile(updated);
      setAvatarFile(null);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error('Save profile error:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save. Please try again.');
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  };

  // ─── Sign out ──────────────────────────────────────────────────────────────

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.push('/');
    } catch {
      setSigningOut(false);
    }
  };

  // ─── Render helpers ────────────────────────────────────────────────────────

  const isLoading = authLoading || profileLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00bcd4]/30 border-t-[#00bcd4] rounded-full animate-spin" />
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
            className="bg-[#00bcd4] hover:bg-[#00acc1] text-white rounded-xl px-6 py-3 font-body transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="min-h-screen py-24 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Page header */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <GearSix className="w-8 h-8 text-[#00bcd4]" weight="duotone" />
              <h1 className="text-3xl font-display font-bold text-white">Settings</h1>
            </div>
            <p className="text-white/[0.40] font-body">Manage your account and preferences.</p>
          </m.div>

          <form onSubmit={handleSave} className="space-y-6">

            {/* Profile Section */}
            <m.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-black/40 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-cyan-400" weight="duotone" />
                <h2 className="text-lg font-display font-semibold text-white">Profile</h2>
              </div>

              <div className="space-y-5">

                {/* Avatar */}
                <div className="flex items-center gap-5">
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-[#0d47a1]/20 border border-white/[0.08] flex items-center justify-center">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-white/[0.25]" weight="duotone" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#00bcd4] hover:bg-[#00acc1] transition-colors flex items-center justify-center border-2 border-black"
                      aria-label="Upload avatar"
                    >
                      <Camera className="w-3.5 h-3.5 text-white" weight="bold" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-white font-body">Profile picture</p>
                    <p className="text-xs text-white/[0.30] font-body mt-0.5">JPG, PNG or GIF. Max 5 MB.</p>
                    {avatarFile && (
                      <p className="text-xs text-[#00bcd4] font-body mt-1">{avatarFile.name} selected</p>
                    )}
                  </div>
                </div>

                {/* Display Name */}
                <div>
                  <label htmlFor="displayName" className="block text-sm text-white/[0.40] font-body mb-1.5">
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={form.displayName}
                    onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                    maxLength={100}
                    placeholder="Your display name"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white font-body focus:outline-none focus:border-[#00bcd4]/50 focus:ring-2 focus:ring-[#00bcd4]/20 focus:bg-white/[0.06] transition-colors placeholder:text-white/[0.20]"
                  />
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="block text-sm text-white/[0.40] font-body mb-1.5">Email</label>
                  <div className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-white/[0.50] font-body select-all">
                    {user.email ?? 'No email'}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm text-white/[0.40] font-body mb-1.5">
                    Bio
                    <span className="ml-2 text-white/[0.20]">({form.bio.length}/500)</span>
                  </label>
                  <textarea
                    id="bio"
                    value={form.bio}
                    onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                    maxLength={500}
                    rows={3}
                    placeholder="Tell your story..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white font-body focus:outline-none focus:border-[#00bcd4]/50 focus:ring-2 focus:ring-[#00bcd4]/20 focus:bg-white/[0.06] transition-colors placeholder:text-white/[0.20] resize-none"
                  />
                </div>
              </div>
            </m.section>

            {/* Arcanea Identity Section */}
            <m.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-black/40 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="text-lg">✦</span>
                <h2 className="text-lg font-display font-semibold text-white">Arcanea Identity</h2>
              </div>

              <div className="space-y-5">

                {/* Preferred Guardian */}
                <div>
                  <label htmlFor="guardian" className="block text-sm text-white/[0.40] font-body mb-1.5">
                    Preferred Guardian
                  </label>
                  <select
                    id="guardian"
                    value={form.guardian}
                    onChange={(e) => setForm((f) => ({ ...f, guardian: e.target.value as GuardianName | '' }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white font-body focus:outline-none focus:border-[#00bcd4]/50 focus:ring-2 focus:ring-[#00bcd4]/20 focus:bg-white/[0.06] transition-colors appearance-none"
                  >
                    <option value="" className="bg-black text-white/[0.40]">None selected</option>
                    {GUARDIANS.map((g) => (
                      <option key={g} value={g} className="bg-black text-white">{g}</option>
                    ))}
                  </select>
                </div>

                {/* Academy House */}
                <div>
                  <label htmlFor="academyHouse" className="block text-sm text-white/[0.40] font-body mb-1.5">
                    Academy House
                  </label>
                  <select
                    id="academyHouse"
                    value={form.academyHouse}
                    onChange={(e) => setForm((f) => ({ ...f, academyHouse: e.target.value as AcademyHouse | '' }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white font-body focus:outline-none focus:border-[#00bcd4]/50 focus:ring-2 focus:ring-[#00bcd4]/20 focus:bg-white/[0.06] transition-colors appearance-none"
                  >
                    <option value="" className="bg-black text-white/[0.40]">None selected</option>
                    {ACADEMY_HOUSES.map((h) => (
                      <option key={h} value={h} className="bg-black text-white">{h}</option>
                    ))}
                  </select>
                </div>

                {/* Active Gate */}
                <div>
                  <label htmlFor="activeGate" className="block text-sm text-white/[0.40] font-body mb-1.5">
                    Active Gate
                  </label>
                  <select
                    id="activeGate"
                    value={form.activeGate}
                    onChange={(e) => setForm((f) => ({ ...f, activeGate: e.target.value as GateName | '' }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white font-body focus:outline-none focus:border-[#00bcd4]/50 focus:ring-2 focus:ring-[#00bcd4]/20 focus:bg-white/[0.06] transition-colors appearance-none"
                  >
                    <option value="" className="bg-black text-white/[0.40]">None selected</option>
                    {GATES.map((g) => (
                      <option key={g} value={g} className="bg-black text-white">{g}</option>
                    ))}
                  </select>
                </div>

                {/* Read-only stats */}
                {profile && (
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {[
                      { label: 'Magic Rank', value: profile.magicRank },
                      { label: 'Gates Open', value: String(profile.gatesOpen) },
                      { label: 'Level', value: String(profile.level) },
                    ].map(({ label, value }) => (
                      <div key={label} className="rounded-xl bg-white/[0.03] border border-white/[0.04] px-3 py-2.5 text-center">
                        <p className="text-[11px] text-white/[0.30] font-body uppercase tracking-wide">{label}</p>
                        <p className="text-white font-body font-semibold mt-0.5 text-sm">{value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </m.section>

            {/* Preferences Section */}
            <m.section
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
                        type="button"
                        onClick={() => setTheme(option)}
                        className={`px-4 py-2 rounded-xl text-sm font-body capitalize transition-colors ${
                          theme === option
                            ? 'bg-[#00bcd4] text-white'
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
                    type="button"
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`relative w-12 h-7 rounded-full transition-colors ${
                      emailNotifications ? 'bg-[#00bcd4]' : 'bg-white/[0.06]'
                    }`}
                    aria-label="Toggle email notifications"
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
                    type="button"
                    onClick={() => setActivityNotifications(!activityNotifications)}
                    className={`relative w-12 h-7 rounded-full transition-colors ${
                      activityNotifications ? 'bg-[#00bcd4]' : 'bg-white/[0.06]'
                    }`}
                    aria-label="Toggle activity notifications"
                  >
                    <span
                      className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                        activityNotifications ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </m.section>

            {/* Save Button + Feedback */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex items-center gap-4"
            >
              <button
                type="submit"
                disabled={saveStatus === 'saving'}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00bcd4] hover:bg-[#00acc1] disabled:opacity-60 disabled:cursor-not-allowed text-white font-body font-medium transition-colors"
              >
                {saveStatus === 'saving' && (
                  <Spinner className="w-4 h-4 animate-spin" weight="bold" />
                )}
                {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
              </button>

              {saveStatus === 'success' && (
                <m.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 text-emerald-400 font-body text-sm"
                >
                  <CheckCircle className="w-4 h-4" weight="fill" />
                  Saved successfully
                </m.div>
              )}

              {saveStatus === 'error' && (
                <m.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 text-red-400 font-body text-sm"
                >
                  <WarningCircle className="w-4 h-4" weight="fill" />
                  {errorMessage || 'Save failed. Try again.'}
                </m.div>
              )}
            </m.div>

            {/* Danger Zone */}
            <m.section
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
                    type="button"
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
                    type="button"
                    onClick={() => setShowDeleteDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors font-body"
                  >
                    <Trash className="w-5 h-5" weight="duotone" />
                    Delete
                  </button>
                </div>
              </div>
            </m.section>

          </form>

          {/* Delete Confirmation Dialog */}
          {showDeleteDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowDeleteDialog(false)}
              />
              <m.div
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
              </m.div>
            </div>
          )}
        </div>
      </div>
    </LazyMotion>
  );
}
