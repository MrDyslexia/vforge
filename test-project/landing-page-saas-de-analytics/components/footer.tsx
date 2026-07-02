import { ExternalLink } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
    { label: "Documentation", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Security", href: "#" },
    { label: "Cookies", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] bg-[#0B1120] px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="text-xl font-bold tracking-tight">
              Analytiq
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#64748B]">
              Real-time analytics and AI-powered insights for data-driven teams.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a href="#" aria-label="GitHub" className="text-[#64748B] hover:text-[#06B6D4] transition-colors">
                <ExternalLink className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-[#64748B] hover:text-[#06B6D4] transition-colors">
                <ExternalLink className="h-5 w-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-[#64748B] hover:text-[#06B6D4] transition-colors">
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-[#F8FAFC]">
                {category}
              </h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[#64748B] transition-colors hover:text-[#06B6D4]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 border-t border-[rgba(255,255,255,0.08)] pt-8 text-center text-sm text-[#64748B]">
          &copy; {new Date().getFullYear()} Analytiq. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
