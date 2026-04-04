import { theme } from '../styles/theme';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export function ProgressBar({
  progress,
  label,
  showPercentage = true,
  animated = true,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, progress));

  const containerStyle = `
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
  `;

  const labelRowStyle = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: ${theme.textMuted};
  `;

  const trackStyle = `
    width: 100%;
    height: 6px;
    background: rgba(255,255,255,0.06);
    border-radius: 3px;
    overflow: hidden;
  `;

  const fillStyle = `
    height: 100%;
    width: ${clamped}%;
    background: linear-gradient(90deg, ${theme.primary}, ${theme.accent});
    border-radius: 3px;
    transition: width 0.4s ease;
    ${animated && clamped > 0 && clamped < 100 ? 'animation: progressGlow 2s ease-in-out infinite;' : ''}
  `;

  return (
    <div style={containerStyle}>
      {(label || showPercentage) && (
        <div style={labelRowStyle}>
          <span>{label || ''}</span>
          {showPercentage && (
            <span style={`color: ${theme.primary}; font-weight: 500;`}>
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}
      <div style={trackStyle}>
        <div style={fillStyle} />
      </div>
    </div>
  );
}
