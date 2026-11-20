"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Moon, Sun, X } from "lucide-react";
import { profile } from "@/data/profile";
import { useGame } from "@/context/GameContext";
import { cn } from "@/lib/utils";

function navLinkClass(id: string, mobile = false) {
  const featured = id === "skills" || id === "projects";
  if (mobile) {
    return featured
      ? "block rounded-xl bg-cyan-200/15 px-3 py-2 text-sm font-semibold text-cyan-50"
      : "block rounded-xl px-3 py-2 text-sm text-slate-200 hover:bg-white/5";
  }
  return featured
    ? "rounded-full bg-cyan-200/15 px-3 py-1 text-sm font-semibold text-cyan-50"
    : "text-sm text-slate-300 transition hover:text-white";
}

const links = [
  ["about", "About"],
  ["experience", "Experience"],
  ["skills", "Expertise"],
  ["projects", "Projects"],
  ["philosophy", "Philosophy"],
  ["education", "Education"],
  ["contact", "Contact"],
] as const;

export function Navbar({
  onExplore,
  home = true,
}: {
  onExplore?: () => void;
  home?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useGame();
  const light = theme === "light";
  const hrefFor = (id: string) => (home ? `#${id}` : `/?view=classic#${id}`);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href={home ? "/#top" : "/?view=classic"} className="font-display text-lg text-white">
          {profile.initials}
          <span className="sr-only">{profile.name}</span>
        </Link>
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Portfolio">
          {links.map(([id, label]) => (
            <a key={id} href={hrefFor(id)} className={navLinkClass(id)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-pressed={light}
            aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15"
            onClick={() => setTheme(light ? "dark" : "light")}
          >
            {light ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {onExplore ? (
            <button
              type="button"
              onClick={onExplore}
              className="hidden rounded-full bg-cyan-200 px-4 py-2 text-sm font-semibold text-slate-950 sm:inline-flex"
            >
              Explore City
            </button>
          ) : (
            <Link
              href="/?view=city"
              className="hidden rounded-full bg-cyan-200 px-4 py-2 text-sm font-semibold text-slate-950 sm:inline-flex"
            >
              Explore City
            </Link>
          )}
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </div>
      <nav
        id="mobile-nav"
        className={cn("border-t border-white/10 lg:hidden", open ? "block" : "hidden")}
        aria-label="Mobile"
      >
        <div className="space-y-1 px-4 py-3">
          {links.map(([id, label]) => (
            <a
              key={id}
              href={hrefFor(id)}
              onClick={() => setOpen(false)}
              className={navLinkClass(id, true)}
            >
              {label}
            </a>
          ))}
          {onExplore ? (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onExplore();
              }}
              className="mt-2 w-full rounded-full bg-cyan-200 px-4 py-2 text-sm font-semibold text-slate-950"
            >
              Explore City
            </button>
          ) : (
            <Link
              href="/?view=city"
              className="mt-2 block rounded-full bg-cyan-200 px-4 py-2 text-center text-sm font-semibold text-slate-950"
            >
              Explore City
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
