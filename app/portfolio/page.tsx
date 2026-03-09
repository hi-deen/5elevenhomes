'use client';

import { motion } from 'framer-motion';
import Script from 'next/script';
import Container from '@/components/ui/Container';

export default function PortfolioPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary-light to-primary">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">
              Our <span className="text-gold">Portfolio</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Follow our latest projects and designs on Instagram
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Instagram Feed Section */}
      <section className="section-padding">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Elfsight Instagram Feed | 5eleven Instagram Feed */}
            <Script 
              src="https://elfsightcdn.com/platform.js" 
              strategy="lazyOnload"
            />
            <div className="elfsight-app-50405a9b-ec9f-48f1-88ef-1cccd9b18d89" data-elfsight-app-lazy></div>
          </motion.div>
        </Container>
      </section>
    </>
  );
}
