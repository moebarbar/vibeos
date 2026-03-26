"use client";

import { motion } from "framer-motion";

interface HandWrittenTitleProps {
  title?: string;
}

export function HandWrittenTitle({ title = "Hello World" }: HandWrittenTitleProps) {
  return (
    <div className="relative inline-flex items-center justify-center">
      <motion.svg
        viewBox="0 0 300 80"
        className="absolute inset-0 w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.path
          d="M 20 40 C 40 10, 260 10, 280 40 C 300 70, 260 70, 150 72 C 40 74, 0 70, 20 40"
          stroke="#00FFB2"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.5 }}
        />
      </motion.svg>
      <motion.h1
        className="relative z-10 text-4xl font-bold tracking-tight px-8 py-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {title}
      </motion.h1>
    </div>
  );
}
