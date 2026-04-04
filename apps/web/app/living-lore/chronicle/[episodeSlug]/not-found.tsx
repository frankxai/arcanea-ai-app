import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <p className="text-6xl mb-4">&#9670;</p>
      <h2 className="font-display text-xl text-text-primary mb-2">Episode Not Found</h2>
      <p className="text-sm text-text-muted mb-6">This chapter hasn&apos;t been written in the Chronicle yet.</p>
      <Link href="/living-lore" className="px-5 py-2.5 rounded-xl text-sm font-medium bg-atlantean-teal-aqua/10 border border-atlantean-teal-aqua/30 text-atlantean-teal-aqua hover:bg-atlantean-teal-aqua/20 transition-colors">
        Return to Living Lore
      </Link>
    </div>
  );
}
