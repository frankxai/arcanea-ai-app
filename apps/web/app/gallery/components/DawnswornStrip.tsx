'use client';

import { Shield, Mail } from 'lucide-react';
import { brand, cosmic, text } from '@arcanea/design-system/tokens';

export function DawnswornStrip() {
  return (
    <div
      className="border-t"
      style={{
        backgroundColor: cosmic.deep,
        borderColor: cosmic.border,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-8 flex-wrap">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6" style={{ color: brand.arcaneanGold }} />
            <div>
              <h3
                className="text-base font-medium mb-1"
                style={{ color: text.primary, fontFamily: 'Geist, sans-serif' }}
              >
                Become Dawnsworn
              </h3>
              <p
                className="text-sm"
                style={{ color: text.secondary, fontFamily: 'Geist, sans-serif' }}
              >
                Fund the journey and own editions. Display license only — you do not buy story rights.
              </p>
            </div>
          </div>

          <a
            href="mailto:frank@arcanea.ai?subject=Dawnsworn Interest"
            className="px-6 py-2.5 rounded-md flex items-center gap-2 transition-all hover:opacity-90"
            style={{
              backgroundColor: brand.arcaneanGold,
              color: cosmic.void,
              fontFamily: 'Geist, sans-serif',
              fontWeight: 500,
            }}
          >
            <Mail className="w-4 h-4" />
            <span>Join waitlist</span>
          </a>
        </div>
      </div>
    </div>
  );
}
