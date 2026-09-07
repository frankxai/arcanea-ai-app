'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ArcaneanBoard = dynamic(
  () => import('./components/ArcaneanBoard').then((mod) => ({ default: mod.ArcaneanBoard })),
  { ssr: false }
);

export default function GalleryPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#09090b]">
        <div className="text-[#00bcd4]">Loading gallery...</div>
      </div>
    );
  }

  return <ArcaneanBoard />;
}
