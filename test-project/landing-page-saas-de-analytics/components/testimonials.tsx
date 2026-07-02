"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

import { testimonials } from "@/lib/data";

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section id="testimonials" className="py-24 px-6">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by data teams everywhere
          </h2>
          <p className="mt-4 text-lg text-[#94A3B8]">
            Hear from the teams that use Analytiq every day.
          </p>
        </motion.div>

        <div className="relative mt-16 min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col items-center"
            >
              <Quote className="mb-6 h-10 w-10 text-[#06B6D4]/30" />
              <blockquote className="max-w-2xl text-lg leading-8 text-[#94A3B8] sm:text-xl">
                &ldquo;{testimonials[current].quote}&rdquo;
              </blockquote>
              <div className="mt-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#06B6D4]/20 text-sm font-semibold text-[#06B6D4]">
                  {testimonials[current].avatar}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">
                    {testimonials[current].name}
                  </p>
                  <p className="text-sm text-[#64748B]">
                    {testimonials[current].role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 bg-[#06B6D4]"
                  : "bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.3)]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
