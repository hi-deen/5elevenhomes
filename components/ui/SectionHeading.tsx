'use client';

import { motion } from 'framer-motion';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeading({ title, subtitle, centered = true }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={centered ? 'text-center' : ''}
    >
      <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
        {title}
      </h2>
      {subtitle && (
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-12 bg-gold" />
          <p className="text-gray-300 text-lg max-w-2xl">{subtitle}</p>
          <div className="h-px w-12 bg-gold" />
        </div>
      )}
    </motion.div>
  );
}
