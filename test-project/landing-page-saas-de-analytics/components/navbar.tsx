"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/data";
import Link from "next/link";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#0B1120]/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)]"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Analytiq
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#94A3B8] transition-colors hover:text-[#06B6D4]"
            >
              {link.label}
            </Link>
          ))}
          <Button className="bg-[#06B6D4] text-[#0B1120] hover:bg-[#06B6D4]/90">
            Get Started
          </Button>
        </div>

        <button
          className="md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1120] rounded-md"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-[rgba(255,255,255,0.08)] bg-[#0B1120] md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-[#94A3B8] transition-colors hover:text-[#06B6D4]"
                >
                  {link.label}
                </Link>
              ))}
              <Button
                className="bg-[#06B6D4] text-[#0B1120] hover:bg-[#06B6D4]/90"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
