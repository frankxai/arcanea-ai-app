'use client';

import { Toaster as SonnerToaster, type ToasterProps } from 'sonner';

/**
 * Arcanea-themed sonner Toaster.
 * Dark glass surface with Atlantean Teal accents.
 */
export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      theme="dark"
      position="bottom-right"
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast:
            'bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl text-white/90',
          title: 'text-white/95 font-medium',
          description: 'text-white/60',
          actionButton: 'bg-[#00bcd4]/20 text-[#00bcd4]',
          cancelButton: 'bg-white/[0.04] text-white/60',
        },
      }}
      {...props}
    />
  );
}
