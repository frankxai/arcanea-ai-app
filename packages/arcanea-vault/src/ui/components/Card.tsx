import { theme } from '../styles/theme';
import type { JSX, ComponentChildren } from 'preact';

interface CardProps {
  children: ComponentChildren;
  glow?: boolean;
  hover?: boolean;
  padding?: string;
  onClick?: JSX.MouseEventHandler<HTMLDivElement>;
  style?: string;
}

export function Card({
  children,
  glow = false,
  hover = true,
  padding = '16px',
  onClick,
  style = '',
}: CardProps) {
  const baseStyle = `
    background: ${theme.bgCard};
    border: 1px solid ${theme.border};
    border-radius: ${theme.radius};
    padding: ${padding};
    transition: all ${theme.transition};
    ${glow ? `box-shadow: ${theme.shadowGlow};` : ''}
    ${hover ? `cursor: pointer;` : ''}
    ${onClick ? 'cursor: pointer;' : ''}
    animation: slideUp 0.3s ease;
  `;

  return (
    <div
      style={baseStyle + style}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hover) {
          const el = e.currentTarget as HTMLDivElement;
          el.style.background = theme.bgCardHover;
          el.style.borderColor = 'rgba(127,255,212,0.35)';
          if (glow) el.style.boxShadow = '0 0 28px rgba(127,255,212,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          const el = e.currentTarget as HTMLDivElement;
          el.style.background = theme.bgCard;
          el.style.borderColor = 'rgba(127,255,212,0.2)';
          if (glow) el.style.boxShadow = theme.shadowGlow;
        }
      }}
    >
      {children}
    </div>
  );
}
