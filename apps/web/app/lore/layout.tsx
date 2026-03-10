import type { ReactNode } from 'react';

export default function LoreLayout({ children }: { children: ReactNode }) {
  return <div data-guardian="shinkami">{children}</div>;
}
