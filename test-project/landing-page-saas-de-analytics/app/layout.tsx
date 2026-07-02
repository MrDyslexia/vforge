import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Analytiq — Analytics that drive decisions",
  description:
    "Real-time dashboards, AI-powered insights, and seamless integrations for data-driven teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-[#06B6D4] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#0B1120]"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
