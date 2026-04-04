import { theme } from '../styles/theme';
import type { JSX } from 'preact';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'padding: 6px 12px; font-size: 12px; border-radius: 6px;',
  md: 'padding: 10px 20px; font-size: 13px; border-radius: 8px;',
  lg: 'padding: 12px 24px; font-size: 14px; border-radius: 10px;',
};

function getVariantStyle(variant: ButtonVariant, disabled?: boolean): string {
  const opacity = disabled ? 'opacity: 0.5; cursor: not-allowed;' : '';

  switch (variant) {
    case 'primary':
      return `
        background: ${theme.primary};
        color: ${theme.bg};
        font-weight: 600;
        ${opacity}
      `;
    case 'secondary':
      return `
        background: transparent;
        color: ${theme.primary};
        border: 1px solid ${theme.border};
        ${opacity}
      `;
    case 'danger':
      return `
        background: ${theme.dangerMuted};
        color: ${theme.danger};
        border: 1px solid rgba(255,71,87,0.3);
        ${opacity}
      `;
    case 'ghost':
      return `
        background: transparent;
        color: ${theme.textMuted};
        ${opacity}
      `;
    default:
      return opacity;
  }
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  style,
  ...props
}: ButtonProps) {
  const baseStyle = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all ${theme.transition};
    letter-spacing: 0.02em;
    white-space: nowrap;
    ${sizeStyles[size]}
    ${getVariantStyle(variant, disabled || loading)}
    ${fullWidth ? 'width: 100%;' : ''}
  `;

  return (
    <button
      disabled={disabled || loading}
      style={baseStyle + (typeof style === 'string' ? style : '')}
      {...props}
    >
      {loading && <span style="animation: pulse 1s ease-in-out infinite;">...</span>}
      {children}
    </button>
  );
}
