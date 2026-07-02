"use client";

import { motion } from "framer-motion";
import { Activity, ArrowRight, BarChart3, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";

const floatingShapes = [
  { icon: TrendingUp, x: "15%", y: "20%", duration: 6, delay: 0 },
  { icon: BarChart3, x: "80%", y: "30%", duration: 8, delay: 1 },
  { icon: Activity, x: "70%", y: "60%", duration: 7, delay: 0.5 },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.15),transparent_50%)]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {floatingShapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute hidden md:block text-[#06B6D4]/20"
          style={{ left: shape.x, top: shape.y }}
          animate={{ y: [0, -20, 0] }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            delay: shape.delay,
            ease: "easeInOut",
          }}
        >
          <shape.icon size={48} />
        </motion.div>
      ))}

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-1.5 text-sm text-[#94A3B8]"
        >
          <span className="h-2 w-2 rounded-full bg-[#06B6D4] animate-pulse" />
          New — AI-powered anomaly detection
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Analytics that{" "}
          <span className="bg-gradient-to-r from-[#06B6D4] to-[#0891B2] bg-clip-text text-transparent">
            drive decisions
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#94A3B8] sm:text-xl"
        >
          Real-time dashboards, AI-powered insights, and seamless integrations
          for data-driven teams. Stop guessing. Start knowing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            className="bg-[#06B6D4] text-[#0B1120] hover:bg-[#06B6D4]/90 shadow-lg shadow-[#06B6D4]/25 gap-2 text-base"
          >
            Start free trial
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-[rgba(255,255,255,0.15)] text-[#F8FAFC] hover:bg-[rgba(255,255,255,0.05)] text-base"
          >
            Watch demo
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
