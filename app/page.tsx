'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Home, Building2, Paintbrush, Package } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

// Hero Section Component with Transitioning Background Images
function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero background images - Replace with your actual images
  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2832&auto=format&fit=crop',
      alt: 'Luxury Living Room Interior'
    },
    {
      url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=2874&auto=format&fit=crop',
      alt: 'Modern Bedroom Design'
    },
    {
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2853&auto=format&fit=crop',
      alt: 'Elegant Dining Space'
    },
    {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2940&auto=format&fit=crop',
      alt: 'Contemporary Home Office'
    },
  ];

  // Auto-transition effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000); // Change image every 6 seconds

    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {heroImages.map((image, index) => (
            index === currentSlide && (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  quality={90}
                />
              </motion.div>
            )
          ))}
        </AnimatePresence>
        
        {/* Elegant Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10" />
        
        {/* Vignette Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)] z-10" />
      </div>

      {/* Content */}
      <Container className="relative z-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-6"
          >
            <span className="inline-block px-6 py-2 border border-gold/30 rounded-full text-gold text-sm font-medium tracking-wider backdrop-blur-sm bg-black/20">
              LUXURY INTERIOR & REAL ESTATE
            </span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-mono font-bold text-white mb-6 leading-tight">
            Welcome to <br className="hidden md:block" />
            <span className="text-gradient">5ELEVEN HOMES</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
            Where your living is curated with intention
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/showroom">
              <Button size="lg" className="group">
                Explore Showroom 
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="backdrop-blur-sm">
                Contact Us
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>

      {/* Slide Indicators */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 ${
              index === currentSlide
                ? 'w-12 h-1.5 bg-gold'
                : 'w-8 h-1.5 bg-white/30 hover:bg-white/50'
            } rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center backdrop-blur-sm bg-black/10">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 bg-gold rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}

// Company Introduction Component
function IntroductionSection() {
  return (
    <section className="section-padding bg-primary-light">
      <Container>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Crafting <span className="text-gold">Excellence</span> in Every Detail
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              5Eleven Homes Ltd is your premier destination for luxury interior design 
              and real estate solutions. With years of expertise, we transform ordinary 
              spaces into extraordinary living experiences.
            </p>
            <p className="text-gray-300 text-lg mb-8">
              From bespoke furniture pieces to complete interior makeovers and real estate 
              development, we bring your vision to life with unmatched quality and attention to detail.
            </p>
            <Link href="/about">
              <Button variant="outline">
                Learn More About Us <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[500px] rounded-lg overflow-hidden"
          >
            {/* <div className="absolute inset-0 bg-gradient-to-tr from-gold/20 to-transparent z-10" /> */}
            <div
    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center"
  />
            {/* <div className="absolute inset-0 bg-gray-800" /> */}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

// Services Preview Component
function ServicesSection() {
  const services = [
    {
      icon: <Home size={40} />,
      title: 'Interior Design',
      description: 'Transform your space with our bespoke interior design solutions tailored to your taste.',
      featured: false,
    },
    {
      icon: <Paintbrush size={40} />,
      title: 'Custom Designs',
      description: 'Personalized design services that reflect your unique style and preferences.',
      featured: false,
    },
    {
      icon: <Package size={40} />,
      title: 'Premium Showroom',
      description: 'Curated collection of luxury furniture and décor items for every room.',
      featured: false,
    },
  ];

  const realEstateService = {
    icon: <Building2 size={40} />,
    title: 'Real Estate Development',
    description: 'Exceptional real estate projects designed for modern living and investment opportunities.',
    link: '/real-estates',
  };

  return (
    <section className="section-padding">
      <Container>
        <SectionHeading
          title="Our Services"
          subtitle="Comprehensive solutions for all your interior and real estate needs"
        />

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card hover className="p-8 text-center h-full">
                <div className="text-gold mb-4 flex justify-center">{service.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Real Estate Service - Featured */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <Link href={realEstateService.link}>
            <Card hover className="p-8 bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border-2 border-gold/30 cursor-pointer group">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="text-gold bg-primary/50 p-6 rounded-full group-hover:scale-110 transition-transform duration-300">
                  {realEstateService.icon}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-semibold text-gold mb-3 group-hover:text-gold-light transition-colors">
                    {realEstateService.title}
                  </h3>
                  <p className="text-gray-300 text-lg">{realEstateService.description}</p>
                </div>
                <div className="text-gold group-hover:translate-x-2 transition-transform duration-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}

// Call to Action Component
function CTASection() {
  return (
    <section className="section-padding bg-gradient-to-r from-primary via-primary-light to-primary">
      <Container>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto border-2 border-gold/30 rounded-2xl p-12 bg-primary-light/50"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's bring your vision to life. Contact us today for a consultation and 
            discover how we can create the perfect space for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">
                Get in Touch <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button size="lg" variant="outline">
                View Our Work
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

// Testimonials Component
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Mr. Ahmed Ibrahim',
      role: 'Corporate Client',
      content: 'Working with 5Eleven Homes was an absolute pleasure. They transformed our office space into a modern, productive environment that our team loves.',
      rating: 5,
    },
    {
      name: 'Mrs. Grace Okonkwo',
      role: 'Residential Client',
      content: 'The attention to detail and quality of work exceeded our expectations. Our home now reflects the luxury and comfort we always dreamed of.',
      rating: 5,
    },
    {
      name: 'Mr. Yusuf Mohammed',
      role: 'Real Estate Investor',
      content: 'The real estate projects by 5Eleven Homes offer excellent investment opportunities. Professional service and impressive results.',
      rating: 5,
    },
  ];

  return (
    <section className="section-padding bg-primary-light">
      <Container>
        <SectionHeading
          title="What Our Clients Say"
          subtitle="Trusted by individuals and businesses across Nigeria"
        />

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-8 h-full">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-gold text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div className="border-t border-gold/20 pt-4">
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

// Main Page Component
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroductionSection />
      <ServicesSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
