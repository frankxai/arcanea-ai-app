import { ImageResponse } from 'next/og';
import { brand, cosmic, text } from '@arcanea/design-system/tokens';

export const runtime = 'nodejs';
export const alt = 'Arcanea Kura — Export your most precious writing';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function KuraOG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: `linear-gradient(140deg, ${cosmic.void} 0%, ${cosmic.deep} 45%, ${cosmic.void} 100%)`,
          position: 'relative',
          padding: '0 80px',
        }}
      >
        {/* Ambient glows */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '8%',
            width: 520,
            height: 520,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(0,188,212,0.20) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '12%',
            right: '8%',
            width: 460,
            height: 460,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(13,71,161,0.22) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '38%',
            right: '32%',
            width: 280,
            height: 280,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,215,0,0.10) 0%, transparent 70%)',
          }}
        />

        {/* Top tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 48,
            padding: '8px 16px',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.04)',
            color: text.secondary,
            fontSize: 18,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: brand.atlanteanTeal,
            }}
          />
          Arcanea Kura · v0.2.0
        </div>

        {/* Display K monolith */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 36,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              fontSize: 280,
              fontWeight: 400,
              lineHeight: 0.85,
              letterSpacing: '-0.04em',
              background: `linear-gradient(140deg, ${brand.atlanteanTeal}, ${brand.aquamarine}, ${brand.arcaneanGold})`,
              backgroundClip: 'text',
              color: 'transparent',
              fontStyle: 'italic',
              fontFamily: 'serif',
            }}
          >
            K
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              paddingBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 400,
                color: text.primary,
                letterSpacing: '-0.02em',
                fontFamily: 'serif',
                fontStyle: 'italic',
              }}
            >
              ura.
            </div>
            <div
              style={{
                fontSize: 28,
                color: text.muted,
                letterSpacing: '0.04em',
              }}
            >
              the storehouse for precious writing
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 44,
            color: text.primary,
            letterSpacing: '-0.015em',
            fontWeight: 500,
            maxWidth: 1000,
            lineHeight: 1.15,
          }}
        >
          Export your most precious writing —{' '}
          <span
            style={{
              color: brand.atlanteanTeal,
              fontWeight: 600,
            }}
          >
            local-first, no cloud.
          </span>
        </div>

        {/* Bottom platform line */}
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            left: 80,
            right: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 22,
            color: text.muted,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span>ChatGPT</span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
            <span>Claude</span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
            <span>Gemini</span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
            <span>Grok</span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
            <span>DeepSeek</span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
            <span>Perplexity</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ color: brand.atlanteanTeal }}>●</span>
            <span>arcanea.ai/kura</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
