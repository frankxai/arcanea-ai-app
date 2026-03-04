'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0e27',
        color: '#e8e8f0',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 480, padding: 32 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(13,71,161,0.2), rgba(0,188,212,0.2))',
            border: '1px solid rgba(13,71,161,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: 28,
          }}>
            &#x2727;
          </div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 12,
            background: 'linear-gradient(90deg, #ffd700, #00bcd4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Something Went Wrong
          </h1>
          <p style={{ color: '#7c7c9a', marginBottom: 24, lineHeight: 1.6 }}>
            The realm has encountered an unexpected disturbance. Our Guardians are investigating.
          </p>
          {error.digest && (
            <p style={{ color: '#4a4a6a', fontSize: 12, marginBottom: 16 }}>
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              padding: '12px 32px',
              borderRadius: 12,
              border: 'none',
              background: 'linear-gradient(90deg, #0d47a1, #00bcd4)',
              color: '#0a0e27',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
