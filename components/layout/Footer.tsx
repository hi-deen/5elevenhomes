'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Building2 } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-light border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-mono font-bold text-gold mb-4">
              5ELEVEN HOMES LTD
            </h3>
            <p className="text-gray-300 mb-4">
              Your premier destination for luxury interior design and exceptional real estate solutions. 
              We transform spaces into extraordinary living experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gold hover:text-gold-light transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gold hover:text-gold-light transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gold hover:text-gold-light transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gold hover:text-gold-light transition-colors">
                <Linkedin size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/showroom" className="text-gray-300 hover:text-gold transition-colors">
                  Showroom
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-gray-300 hover:text-gold transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-gold transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
            
            {/* Real Estates - Separated */}
            <div className="mt-4 pt-4 border-t border-gold/20">
              <Link 
                href="/real-estates" 
                className="flex items-center gap-2 px-3 py-2 bg-gold/10 hover:bg-gold/20 text-gold rounded-md transition-all duration-200 font-semibold border border-gold/30 w-fit"
              >
                <Building2 size={18} />
                Real Estates
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-gold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-gray-300">
                <MapPin size={20} className="text-gold mt-1 flex-shrink-0" />
                <span>TCC Commerce Center, Abakpa Kaduna, Nigeria</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-300">
                <Phone size={20} className="text-gold flex-shrink-0" />
                <div>
                  <div>+234 706 711 1222</div>
                  <div>+234 813 200 1621</div>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-gray-300">
                <Mail size={20} className="text-gold mt-1 flex-shrink-0" />
                <div className="break-all">
                  <div>5elevenhomes@gmail.com</div>
                  <div>Investwith5eleven@gmail.com</div>
                </div>
              </li>
            </ul>
            
            {/* Business Hours */}
            <div className="mt-6 pt-4 border-t border-gold/30">
              <h5 className="text-sm font-semibold text-gold mb-2">Business Hours</h5>
              <div className="text-sm space-y-1 text-gray-300">
                <div>Tue - Sat: 10am - 5pm</div>
                <div>Monday: By Appointment Only</div>
                <div className="text-gray-400">Closed on Sundays</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gold/20">
          <p className="text-center text-gray-400">
            © {currentYear} 5Eleven Homes Ltd. All rights reserved. | Designed for Excellence
          </p>
        </div>
      </div>
    </footer>
  );
}
