"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X, Menu } from "lucide-react";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Social proof", href: "#social-proof" },
  { label: "Pricing", href: "#pricing" },
  { label: "Waitlist", href: "#waitlist" },
];

export function LandingHeader() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-semibold tracking-tight text-zinc-50"
          aria-label="LinkHub home"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10 transition-colors group-hover:bg-white/10">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-fuchsia-400 to-violet-400" />
          </span>
          <span className="text-sm sm:text-base">LinkHub</span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 text-sm text-zinc-300 md:flex"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-zinc-50"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            asChild
            variant="ghost"
            className="text-zinc-200 hover:bg-white/5 hover:text-zinc-50"
          >
            <Link href="/login">Sign in</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white shadow-sm shadow-fuchsia-500/20 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-fuchsia-400"
          >
            <Link href="/register">Get started</Link>
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-zinc-200 hover:bg-white/5 hover:text-zinc-50 md:hidden"
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div
        className={cn(
          "md:hidden",
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!isOpen}
      >
        <div
          className={cn(
            "fixed inset-0 z-40 bg-zinc-950/60 backdrop-blur-sm transition-opacity",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsOpen(false)}
        />

        <div
          className={cn(
            "fixed left-0 right-0 top-[65px] z-50 mx-auto w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 p-4 shadow-2xl shadow-black/40 transition-all",
            isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          )}
          role="dialog"
          aria-label="Mobile menu"
        >
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button
              asChild
              variant="outline"
              className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              <Link href="/login">Sign in</Link>
            </Button>
            <Button
              asChild
              className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white hover:brightness-110"
              onClick={() => setIsOpen(false)}
            >
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
