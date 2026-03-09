import type { ReactNode } from 'react';

export default function LibraryLayout({ children }: { children: ReactNode }) {
  return <div data-guardian="lyria">{children}</div>;
}
