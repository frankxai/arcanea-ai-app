'use client';

import React, { useState, Fragment } from 'react';
import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import { PhUser, PhSignOut, PhGear, PhSparkle, PhBookOpen, PhPalette, PhCaretDown, PhHouse } from '@/lib/phosphor-icons';
import { useAuth } from '@/lib/auth/context';
import { AuthModal } from './auth-modal';

export function UserNav() {
  const { user, isLoading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

  const openLogin = () => {
    setAuthModalTab('login');
    setShowAuthModal(true);
  };

  const openSignup = () => {
    setAuthModalTab('signup');
    setShowAuthModal(true);
  };

  if (isLoading) {
    return (
      <div className="w-20 h-9 rounded-xl bg-white/[0.04] animate-pulse" />
    );
  }

  if (!user) {
    return (
      <>
        <div className="flex items-center gap-2">
          <button
            onClick={openLogin}
            className="text-sm text-text-secondary hover:text-white transition-colors px-3 py-2"
          >
            Sign In
          </button>
          <button
            onClick={openSignup}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-atlantean-teal-aqua to-atlantean-teal-light text-cosmic-deep text-sm font-semibold hover:shadow-[0_0_20px_rgba(127,255,212,0.3)] transition-all duration-300"
          >
            Get Started
          </button>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultTab={authModalTab}
        />
      </>
    );
  }

  const userInitial = user.email?.[0].toUpperCase() || 'U';
  const username = user.user_metadata?.username || user.email?.split('@')[0] || 'Creator';
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center gap-2 p-1 pr-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={username}
            className="w-7 h-7 rounded-lg object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-atlantean-teal-aqua to-creation-prism-purple flex items-center justify-center text-cosmic-deep font-semibold text-xs">
            {userInitial}
          </div>
        )}
        <span className="text-sm font-medium hidden sm:block">{username}</span>
        <PhCaretDown className="w-3.5 h-3.5 text-text-muted" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="transform opacity-0 scale-95 translate-y-1"
        enterTo="transform opacity-100 scale-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl liquid-glass-elevated border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.4)] focus:outline-none overflow-hidden">
          {/* User info */}
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <p className="text-sm font-medium">{username}</p>
            <p className="text-xs text-text-muted truncate">{user.email}</p>
          </div>

          <div className="py-1.5">
            {[
              { href: '/dashboard', icon: PhHouse, label: 'Dashboard' },
              { href: '/profile', icon: PhUser, label: 'Your Profile' },
              { href: '/luminors', icon: PhSparkle, label: 'Your Luminors' },
              { href: '/studio', icon: PhPalette, label: 'Studio' },
              { href: '/library', icon: PhBookOpen, label: 'Library' },
              { href: '/settings', icon: PhGear, label: 'Settings' },
            ].map((item) => (
              <Menu.Item key={item.href}>
                {({ active }) => (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                      active ? 'bg-white/[0.06] text-white' : 'text-text-secondary'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )}
              </Menu.Item>
            ))}
          </div>

          <div className="py-1.5 border-t border-white/[0.06]">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => signOut()}
                  className={`flex items-center gap-3 px-4 py-2 text-sm w-full transition-colors ${
                    active ? 'bg-white/[0.06] text-red-400' : 'text-text-secondary'
                  }`}
                >
                  <PhSignOut className="w-4 h-4" />
                  Sign Out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
