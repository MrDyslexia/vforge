"use client";

import { motion } from "framer-motion";

import { stats } from "@/lib/data";

export function StatsBar() {
  return (
    <section className="border-y border-[rgba(255,255,255,0.08)] bg-[#0F172A] py-16 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-mono text-4xl font-bold tabular-nums text-[#06B6D4] sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-[#64748B]">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
