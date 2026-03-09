'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, Building2 } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/showroom', label: 'Showroom' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-primary/95 backdrop-blur-sm z-50 border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <span className="text-2xl md:text-3xl font-serif font-bold text-gold">
                5Eleven Homes
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-gold transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Real Estates - Separated */}
            <div className="relative h-8 border-l border-gold/30 pl-8">
              <Link
                href="/real-estates"
                className="flex items-center gap-2 px-4 py-2 bg-gold/10 hover:bg-gold/20 text-gold rounded-md transition-all duration-200 font-semibold border border-gold/30"
              >
                <Building2 size={18} />
                Real Estates
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gold p-2"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-primary-light border-t border-gold/20"
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-gray-300 hover:text-gold transition-colors duration-200 py-2 font-medium"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Real Estates - Separated */}
            <div className="pt-3 mt-3 border-t border-gold/20">
              <Link
                href="/real-estates"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-3 bg-gold/10 hover:bg-gold/20 text-gold rounded-md transition-all duration-200 font-semibold border border-gold/30"
              >
                <Building2 size={20} />
                Real Estates
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
