'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Sidebar context — lets any descendant toggle the sidebar
// ---------------------------------------------------------------------------

interface SidebarContextValue {
  expanded: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  expanded: false,
  toggle: () => {},
});

export function useSidebar(): SidebarContextValue {
  return useContext(SidebarContext);
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SIDEBAR_COLLAPSED_WIDTH = 48;
const SIDEBAR_EXPANDED_WIDTH = 280;
const MD_BREAKPOINT = 768;

// ---------------------------------------------------------------------------
// ChatLayout — 2-column flex layout with collapsible sidebar
// ---------------------------------------------------------------------------

interface ChatLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  /** Controlled expanded state from parent */
  sidebarExpanded: boolean;
  /** Toggle handler from parent */
  onToggleSidebar: () => void;
}

export function ChatLayout({ sidebar, children, sidebarExpanded, onToggleSidebar }: ChatLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);

  // Detect mobile on mount and on resize
  useEffect(() => {
    function check() {
      setIsMobile(window.innerWidth < MD_BREAKPOINT);
    }
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close mobile overlay on Escape
  useEffect(() => {
    if (!isMobile || !sidebarExpanded) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onToggleSidebar();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isMobile, sidebarExpanded, onToggleSidebar]);

  return (
    <SidebarContext.Provider value={{ expanded: sidebarExpanded, toggle: onToggleSidebar }}>
      <div className="flex h-dvh bg-cosmic-void overflow-hidden">
        {/* ----------------------------------------------------------------- */}
        {/* Sidebar — desktop: inline column, mobile: fixed overlay           */}
        {/* ----------------------------------------------------------------- */}

        {isMobile ? (
          <>
            {/* Backdrop */}
            {sidebarExpanded && (
              <div
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onToggleSidebar}
                aria-hidden="true"
              />
            )}
            {/* Slide-over sidebar */}
            <aside
              className="fixed inset-y-0 left-0 z-50 flex flex-col border-r border-cosmic-border bg-cosmic-deep/95 backdrop-blur-xl transition-transform duration-200 ease-out"
              style={{
                width: SIDEBAR_EXPANDED_WIDTH,
                transform: sidebarExpanded ? 'translateX(0)' : `translateX(-${SIDEBAR_EXPANDED_WIDTH}px)`,
              }}
              role="complementary"
              aria-label="Chat sidebar"
              onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
              onTouchEnd={(e) => {
                const deltaX = e.changedTouches[0].clientX - touchStartX.current;
                if (deltaX < -80) onToggleSidebar();
              }}
            >
              {sidebar}
            </aside>
          </>
        ) : (
          /* Desktop inline sidebar with animated width */
          <aside
            className="flex flex-col shrink-0 border-r border-cosmic-border bg-cosmic-deep/95 backdrop-blur-xl overflow-hidden transition-[width] duration-200 ease-out"
            style={{ width: sidebarExpanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH }}
            aria-label="Sidebar"
          >
            {sidebar}
          </aside>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Main content                                                      */}
        {/* ----------------------------------------------------------------- */}

        <main className="flex-1 flex flex-col min-w-0 min-h-0" aria-label="Chat">
          {children}
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
