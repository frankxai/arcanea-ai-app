/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

const NAV_ITEMS = [
  { name: "Chat", href: "/chat", shortcut: "C", group: "Create" },
  { name: "Imagine", href: "/imagine", shortcut: "I", group: "Create" },
  { name: "Voice", href: "/voice", group: "Create" },
  { name: "Studio", href: "/studio", group: "Create" },
  { name: "Worlds", href: "/worlds", shortcut: "W", group: "Create" },
  { name: "Game Studio", href: "/games", group: "Create" },
  { name: "Music Studio", href: "/music-studio", group: "Create" },
  { name: "Cinema Studio", href: "/cinema-studio", group: "Create" },
  { name: "Canvas", href: "/canvas", group: "Create" },
  { name: "Forge", href: "/forge", group: "Create" },
  { name: "Gallery", href: "/gallery", group: "Explore" },
  { name: "Living Constellation", href: "/constellation", group: "Explore" },
  { name: "Library", href: "/library", shortcut: "L", group: "Explore" },
  { name: "Luminors", href: "/luminors", group: "Explore" },
  { name: "Lore", href: "/lore", group: "Explore" },
  { name: "Factions", href: "/factions", group: "Explore" },
  { name: "Showcase", href: "/showcase", group: "Explore" },
  { name: "Academy", href: "/academy", group: "Learn" },
  { name: "Model Arena", href: "/models", group: "Learn" },
  { name: "Developers", href: "/developers", group: "Learn" },
  { name: "Ecosystem", href: "/ecosystem", group: "Open Core" },
  { name: "MCP & CLI", href: "/mcp", group: "Open Core" },
  { name: "Blueprints", href: "/templates", shortcut: "B", group: "Open Core" },
  { name: "Pricing", href: "/pricing", group: "Open Core" },
  { name: "Settings", href: "/settings", group: "Account" },
  { name: "Profile", href: "/profile", group: "Account" },
];

const ACTION_ITEMS = [
  { name: "New Chat", href: "/chat", group: "Actions" },
  { name: "Universal Create", href: "/create", group: "Actions" },
  { name: "Create World", href: "/worlds/create", group: "Actions" },
  { name: "Plan Game", href: "/games", group: "Actions" },
  { name: "Plan Music Project", href: "/music-studio", group: "Actions" },
  { name: "Forge Luminor", href: "/forge/luminor", group: "Actions" },
  { name: "Take Origin Quiz", href: "/quiz", group: "Actions" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  if (!open) return null;

  const groups = [...new Set(NAV_ITEMS.map((i) => i.group))];

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Command dialog */}
      <div className="absolute top-[20vh] left-1/2 -translate-x-1/2 w-full max-w-lg px-4">
        <div className="rounded-2xl border border-white/[0.08] bg-[var(--arc-cosmic-void)]/95 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_32px_80px_-12px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.03)_inset] overflow-hidden">
          <Command>
            <CommandInput placeholder="Where do you want to go?" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              <CommandGroup heading="Quick Actions">
                {ACTION_ITEMS.map((item) => (
                  <CommandItem
                    key={item.href + item.name}
                    onSelect={() => navigate(item.href)}
                  >
                    <span className="text-[var(--arc-brand-atlantean-teal)]">
                      +
                    </span>
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandSeparator />

              {groups.map((group) => (
                <CommandGroup key={group} heading={group}>
                  {NAV_ITEMS.filter((i) => i.group === group).map((item) => (
                    <CommandItem
                      key={item.href}
                      onSelect={() => navigate(item.href)}
                    >
                      {item.name}
                      {item.shortcut && (
                        <CommandShortcut>{item.shortcut}</CommandShortcut>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>

            <div className="border-t border-white/[0.06] px-3 py-2 flex items-center justify-between text-[10px] text-[var(--arc-text-muted)] font-mono">
              <span>Navigate with ↑↓ · Enter to go · Esc to close</span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[9px]">
                  ⌘K
                </kbd>
              </span>
            </div>
          </Command>
        </div>
      </div>
    </div>
  );
}
