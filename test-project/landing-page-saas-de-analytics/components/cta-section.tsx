"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-br from-[#06B6D4] to-[#0891B2] px-8 py-16 text-center sm:px-16"
      >
        <h2 className="text-3xl font-bold tracking-tight text-[#0B1120] sm:text-4xl">
          Ready to transform your data?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-[#0B1120]/80">
          Join thousands of teams already using Analytiq to make smarter, faster
          decisions.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="bg-[#0B1120] text-[#F8FAFC] hover:bg-[#0B1120]/90 gap-2 text-base"
          >
            Start free trial
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-[#0B1120]/20 text-[#0B1120] hover:bg-[#0B1120]/5 text-base"
          >
            Talk to sales
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
