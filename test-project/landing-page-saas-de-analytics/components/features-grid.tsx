"use client";

import { motion } from "framer-motion";

import { features } from "@/lib/data";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to understand your data
          </h2>
          <p className="mt-4 text-lg text-[#94A3B8]">
            Powerful tools that make analytics accessible for every team.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-8 transition-all duration-300 hover:border-[#06B6D4]/50 hover:-translate-y-0.5"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#06B6D4]/10">
                <feature.icon className="h-6 w-6 text-[#06B6D4]" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#94A3B8]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
