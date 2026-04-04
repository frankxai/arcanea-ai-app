import { useRef, useCallback } from 'preact/hooks';
import { theme } from '../styles/theme';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search conversations...',
  debounceMs = 250,
}: SearchBarProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInput = useCallback(
    (e: Event) => {
      const val = (e.target as HTMLInputElement).value;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onChange(val), debounceMs);
    },
    [onChange, debounceMs]
  );

  const containerStyle = `
    position: relative;
    width: 100%;
  `;

  const iconStyle = `
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${theme.textDim};
    font-size: 14px;
    pointer-events: none;
  `;

  const inputStyle = `
    width: 100%;
    padding: 10px 12px 10px 36px;
    background: ${theme.bgInput};
    border: 1px solid ${theme.borderSubtle};
    border-radius: ${theme.radiusSm};
    color: ${theme.text};
    font-size: 13px;
    transition: all ${theme.transition};
  `;

  return (
    <div style={containerStyle}>
      <span style={iconStyle}>&#128269;</span>
      <input
        type="text"
        value={value}
        onInput={handleInput}
        placeholder={placeholder}
        style={inputStyle}
        onFocus={(e) => {
          const el = e.currentTarget;
          el.style.borderColor = 'rgba(127,255,212,0.4)';
          el.style.background = 'rgba(255,255,255,0.05)';
        }}
        onBlur={(e) => {
          const el = e.currentTarget;
          el.style.borderColor = theme.borderSubtle;
          el.style.background = theme.bgInput;
        }}
      />
    </div>
  );
}
