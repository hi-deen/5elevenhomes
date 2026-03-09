'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = false }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -5 } : undefined}
      transition={{ duration: 0.3 }}
      className={cn(
        'bg-primary-light border border-gold/20 rounded-lg overflow-hidden',
        hover && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
