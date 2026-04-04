import { platformColors } from '../styles/theme';
import type { Platform } from '../../shared/types';

interface BadgeProps {
  platform: Platform;
  size?: 'sm' | 'md';
}

const platformLabels: Record<Platform, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  perplexity: 'Perplexity',
  grok: 'Grok',
  gemini: 'Gemini',
};

const platformIcons: Record<Platform, string> = {
  chatgpt: 'GPT',
  claude: 'CL',
  perplexity: 'PP',
  grok: 'GK',
  gemini: 'GM',
};

export function Badge({ platform, size = 'md' }: BadgeProps) {
  const color = platformColors[platform] || '#8892a4';
  const isSm = size === 'sm';

  const style = `
    display: inline-flex;
    align-items: center;
    gap: ${isSm ? '4px' : '6px'};
    padding: ${isSm ? '2px 8px' : '4px 10px'};
    background: ${color}18;
    border: 1px solid ${color}40;
    border-radius: 20px;
    font-size: ${isSm ? '10px' : '11px'};
    font-weight: 600;
    color: ${color};
    letter-spacing: 0.03em;
    white-space: nowrap;
  `;

  const dotStyle = `
    width: ${isSm ? '5px' : '6px'};
    height: ${isSm ? '5px' : '6px'};
    border-radius: 50%;
    background: ${color};
  `;

  return (
    <span style={style}>
      <span style={dotStyle} />
      {isSm ? platformIcons[platform] : platformLabels[platform]}
    </span>
  );
}
