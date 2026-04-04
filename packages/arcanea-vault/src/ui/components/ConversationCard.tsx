import { Card } from './Card';
import { Badge } from './Badge';
import { theme } from '../styles/theme';
import type { Platform } from '../../shared/types';

interface ConversationCardProps {
  id: string;
  title: string;
  platform: Platform;
  date: number;
  wordCount: number;
  messageCount: number;
  hasCode?: boolean;
  hasImages?: boolean;
  selected?: boolean;
  onClick?: () => void;
  onSelect?: (id: string, checked: boolean) => void;
}

function formatRelativeDate(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatWordCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

export function ConversationCard({
  id,
  title,
  platform,
  date,
  wordCount,
  messageCount,
  hasCode,
  hasImages,
  selected,
  onClick,
  onSelect,
}: ConversationCardProps) {
  const headerStyle = `
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
  `;

  const titleStyle = `
    font-size: 13px;
    font-weight: 500;
    color: ${theme.text};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    min-width: 0;
  `;

  const metaStyle = `
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 11px;
    color: ${theme.textDim};
  `;

  const tagStyle = `
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 1px 6px;
    background: rgba(255,255,255,0.04);
    border-radius: 4px;
    font-size: 10px;
    color: ${theme.textMuted};
  `;

  const checkboxStyle = `
    width: 14px;
    height: 14px;
    accent-color: ${theme.primary};
    cursor: pointer;
    flex-shrink: 0;
    margin-top: 2px;
  `;

  const cardExtra = selected ? `border-color: ${theme.primary}; background: ${theme.primaryMuted};` : '';

  return (
    <Card
      padding="12px 14px"
      glow={false}
      hover={true}
      onClick={onClick}
      style={cardExtra}
    >
      <div style={headerStyle}>
        {onSelect && (
          <input
            type="checkbox"
            checked={selected}
            style={checkboxStyle}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onSelect(id, (e.target as HTMLInputElement).checked)}
          />
        )}
        <span style={titleStyle}>{title || 'Untitled'}</span>
        <Badge platform={platform} size="sm" />
      </div>
      <div style={metaStyle}>
        <span>{formatRelativeDate(date)}</span>
        <span>{messageCount} msgs</span>
        <span>{formatWordCount(wordCount)} words</span>
        {hasCode && <span style={tagStyle}>{'</>'}</span>}
        {hasImages && <span style={tagStyle}>img</span>}
      </div>
    </Card>
  );
}
