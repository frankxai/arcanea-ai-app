'use client';

import { Shield, Mail } from 'lucide-react';
import { brand, cosmic, text } from '@arcanea/design-system/tokens';

export function DawnswornStrip() {
  return (
    <div
      className="border-b"
      style={{
        backgroundColor: cosmic.deep,
        borderColor: cosmic.border,
      }}
    >
      <div className="px-4 py-2.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" style={{ color: brand.arcaneanGold }} aria-hidden="true" />
            <span
              className="text-sm font-medium"
              style={{ color: text.primary, fontFamily: 'Geist, sans-serif' }}
            >
              Become Dawnsworn
            </span>
            <span
              className="text-xs hidden sm:inline"
              style={{ color: text.secondary, fontFamily: 'Geist, sans-serif' }}
            >
              — Fund the journey, own editions. Display license only.
            </span>
          </div>

          <a
            href="mailto:frank@arcanea.ai?subject=Dawnsworn Interest"
            className="px-4 py-1.5 rounded-md flex items-center gap-1.5 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 text-sm"
            style={{
              backgroundColor: brand.arcaneanGold,
              color: cosmic.void,
              fontFamily: 'Geist, sans-serif',
              fontWeight: 500,
            }}
          >
            <Mail className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Join waitlist</span>
          </a>
        </div>
      </div>
    </div>
  );
}
