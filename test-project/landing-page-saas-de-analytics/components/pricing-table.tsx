"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { pricingTiers } from "@/lib/data";
import { cn } from "@/lib/utils";

export function PricingTable() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-[#94A3B8]">
            Start for free. Upgrade when you need more.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <span
            className={cn(
              "text-sm transition-colors",
              !yearly ? "text-[#F8FAFC]" : "text-[#64748B]",
            )}
          >
            Monthly
          </span>
          <button
            onClick={() => setYearly(!yearly)}
            role="switch"
            aria-checked={yearly}
            aria-label="Toggle yearly pricing"
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors",
              yearly ? "bg-[#06B6D4]" : "bg-[rgba(255,255,255,0.15)]",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                yearly && "translate-x-5",
              )}
            />
          </button>
          <span
            className={cn(
              "text-sm transition-colors",
              yearly ? "text-[#F8FAFC]" : "text-[#64748B]",
            )}
          >
            Yearly{" "}
            <span className="text-[#06B6D4]">Save 20%</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 grid gap-8 lg:grid-cols-3"
        >
          {pricingTiers.map((tier) => (
            <motion.div
              key={tier.name}
              layout
              className={cn(
                "relative rounded-xl border p-8 transition-all duration-300",
                tier.highlighted
                  ? "border-[#06B6D4] bg-[rgba(6,182,212,0.04)]"
                  : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]",
              )}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#06B6D4] px-4 py-0.5 text-xs font-semibold text-[#0B1120]">
                  Popular
                </div>
              )}
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <p className="mt-4 font-mono text-4xl font-bold tabular-nums">
                {yearly ? tier.yearlyPrice : tier.price}
                <span className="text-base font-normal text-[#64748B]">
                  /mo
                </span>
              </p>
              {yearly && (
                <p className="mt-1 text-sm text-[#64748B]">
                  Billed annually
                </p>
              )}
              <ul className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#06B6D4]" />
                    <span className="text-[#94A3B8]">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={cn(
                  "mt-8 w-full",
                  tier.highlighted
                    ? "bg-[#06B6D4] text-[#0B1120] hover:bg-[#06B6D4]/90"
                    : "border-[rgba(255,255,255,0.15)] text-[#F8FAFC] hover:bg-[rgba(255,255,255,0.05)]",
                )}
                variant={tier.highlighted ? "default" : "outline"}
              >
                {tier.name === "Free" ? "Get started" : "Subscribe"}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
