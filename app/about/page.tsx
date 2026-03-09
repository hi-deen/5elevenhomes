'use client';

import { motion } from 'framer-motion';
import { Eye, Target, Award, Users } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';

export default function AboutPage() {
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
              About <span className="text-gold">5Eleven Homes</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your trusted partner in creating exceptional living spaces and real estate solutions
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Company Overview */}
      <section className="section-padding">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-serif font-bold text-white mb-6">
                Who We Are
              </h2>
              <div className="space-y-4 text-gray-300 text-lg">
                <p>
                  5Eleven Homes Ltd is a premier interior design and real estate company 
                  based in Kaduna, Nigeria. We specialize in transforming residential and 
                  commercial spaces into stunning environments that reflect our clients' 
                  unique personalities and business identities.
                </p>
                <p>
                  With a commitment to excellence and attention to detail, we offer a comprehensive 
                  range of services including interior design, custom furniture, real estate 
                  development, and project management. Our team of skilled professionals brings 
                  years of experience and creativity to every project.
                </p>
                <p>
                  Whether you're looking to furnish your home with luxury items from our showroom, 
                  need a complete interior makeover, or are interested in our real estate projects, 
                  5Eleven Homes delivers quality and sophistication in every endeavor.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-6"
            >
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-gold mb-2">10,000+</div>
                <div className="text-gray-400">Projects Completed</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-gold mb-2">85%+</div>
                <div className="text-gray-400">Happy Clients</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-gold mb-2">10+</div>
                <div className="text-gray-400">Years Experience</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-gold mb-2">50+</div>
                <div className="text-gray-400">Team Members</div>
              </Card>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-primary-light">
        <Container>
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 h-full">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mr-4">
                    <Eye className="text-gold" size={32} />
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-gold">Our Vision</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  To become a trusted name in real estate development and interior design, known for quality delivery, timeless designs and exceptional project execution across Nigeria and beyond.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-8 h-full">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mr-4">
                    <Target className="text-gold" size={32} />
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-gold">Our Mission</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  To create thoughtfully designed spaces through innovative planning, skilled craftsmanship, and efficient project management while maintaining the highest standards of integrity, quality, and client's satisfaction.
                </p>
              </Card>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Our Services */}
      <section className="section-padding">
        <Container>
          <SectionHeading
            title="Our Services"
            subtitle="Comprehensive solutions tailored to your needs"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[
              {
                title: 'Interior Design',
                description: 'Complete interior design services for residential and commercial spaces, from concept to execution.',
                icon: '🎨',
              },
              {
                title: 'Custom Furniture',
                description: 'Bespoke furniture pieces crafted to your specifications, combining functionality with aesthetic appeal.',
                icon: '🪑',
              },
              {
                title: 'Showroom Sales',
                description: 'Curated collection of premium furniture, décor items, and accessories for every room.',
                icon: '🏪',
              },
              {
                title: 'Real Estate Development',
                description: 'Quality real estate projects offering excellent investment opportunities and modern living spaces.',
                icon: '🏗️',
              },
              {
                title: 'Project Management',
                description: 'End-to-end project management ensuring timely delivery and quality execution.',
                icon: '📋',
              },
              {
                title: 'Consultation Services',
                description: 'Expert advice and guidance for all your interior design and real estate needs.',
                icon: '💡',
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hover className="p-6 h-full">
                  <div className="text-5xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-400">{service.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-primary-light">
        <Container>
          <SectionHeading
            title="Why Choose 5Eleven Homes"
            subtitle="What sets us apart from the rest"
          />

          <div className="grid md:grid-cols-4 gap-8 mt-12">
            {[
              { icon: <Award size={40} />, title: 'Quality Assurance', description: 'Premium materials and expert craftsmanship' },
              { icon: <Users size={40} />, title: 'Client-Focused', description: 'Your satisfaction is our priority' },
              { icon: <Target size={40} />, title: 'On-Time Delivery', description: 'We respect your time and deadlines' },
              { icon: <Eye size={40} />, title: 'Innovative Designs', description: 'Creative solutions for modern living' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-gold mb-4 flex justify-center">{item.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
