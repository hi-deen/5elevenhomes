'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { CheckCircle, Clock, Lightbulb } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface RealEstateSection {
  id: string;
  sectionName: string;
  description: string;
  completedWorks: string[];
  ongoingWorks: string[];
  progressPercentage: number;
  status: string;
  images: string[];
  order: number;
}

export default function RealEstatesPage() {
  const [sections, setSections] = useState<RealEstateSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/real-estates');
      if (response.ok) {
        const data = await response.json();
        setSections(data);
      }
    } catch (error) {
      console.error('Failed to fetch sections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Planning':
        return {
          icon: <Lightbulb size={20} />,
          color: 'bg-blue-500/20 text-blue-400 border-blue-500',
          label: 'Planning',
        };
      case 'Ongoing':
        return {
          icon: <Clock size={20} />,
          color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
          label: 'Ongoing',
        };
      case 'Completed':
        return {
          icon: <CheckCircle size={20} />,
          color: 'bg-green-500/20 text-green-400 border-green-500',
          label: 'Completed',
        };
      default:
        return {
          icon: <Clock size={20} />,
          color: 'bg-gray-500/20 text-gray-400 border-gray-500',
          label: status,
        };
    }
  };

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
              Real Estate <span className="text-gold">Projects</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover our premium real estate developments designed for modern living and investment excellence
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Sections */}
      <section className="section-padding">
        <Container>
          {isLoading ? (
            <div className="py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : sections.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No real estate sections available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {sections.map((section, index) => {
                const statusConfig = getStatusConfig(section.status);
                
                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <Card className="overflow-hidden">
                      {/* Header */}
                      <div className="p-8 border-b border-gold/20">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
                            {section.sectionName}
                          </h2>
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig.color}`}>
                            {statusConfig.icon}
                            <span className="font-medium">{statusConfig.label}</span>
                          </div>
                        </div>
                        <p className="text-gray-300 text-lg leading-relaxed">
                          {section.description}
                        </p>
                      </div>

                      {/* Image Gallery */}
                      {section.images && section.images.length > 0 && (
                        <div className="p-8 border-b border-gold/20">
                          <Swiper
                            modules={[Navigation, Pagination]}
                            navigation
                            pagination={{ clickable: true }}
                            spaceBetween={20}
                            slidesPerView={1}
                            breakpoints={{
                              640: { slidesPerView: 2 },
                              1024: { slidesPerView: 3 },
                            }}
                            className="project-gallery"
                          >
                            {section.images.map((image, idx) => (
                              <SwiperSlide key={idx}>
                                <div className="relative h-64 rounded-lg overflow-hidden">
                                  <Image
                                    src={image}
                                    alt={`${section.sectionName} - Image ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        </div>
                      )}

                      {/* Progress Bar */}
                      <div className="p-8 border-b border-gold/20">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-semibold">Project Progress</span>
                          <span className="text-gold font-bold text-xl">
                            {section.progressPercentage}%
                          </span>
                        </div>
                        <div className="w-full h-4 bg-primary-light rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${section.progressPercentage}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="h-full bg-gradient-to-r from-gold-dark to-gold-light"
                          />
                        </div>
                      </div>

                      {/* Works Lists */}
                      <div className="p-8 grid md:grid-cols-2 gap-8">
                        {/* Completed Works */}
                        {section.completedWorks && section.completedWorks.length > 0 && (
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                              <CheckCircle className="text-green-400" size={24} />
                              Completed Works
                            </h3>
                            <ul className="space-y-2">
                              {section.completedWorks.map((work, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-gray-300">{work}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Ongoing Works */}
                        {section.ongoingWorks && section.ongoingWorks.length > 0 && (
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                              <Clock className="text-yellow-400" size={24} />
                              Ongoing Works
                            </h3>
                            <ul className="space-y-2">
                              {section.ongoingWorks.map((work, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0 animate-pulse" />
                                  <span className="text-gray-300">{work}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-light">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-12 text-center bg-gold/5 border-gold/30">
              <h2 className="text-4xl font-serif font-bold text-white mb-4">
                Invest in Quality Real Estate
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Be part of our premium developments. Contact us to learn more about investment 
                opportunities and available properties.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:Investwith5eleven@gmail.com">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gold hover:bg-gold-dark text-primary font-semibold rounded-md transition-colors"
                  >
                    Contact Investment Team
                  </motion.button>
                </a>
                <a href="tel:+2348132001621">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-transparent hover:bg-gold/10 text-gold border-2 border-gold font-semibold rounded-md transition-colors"
                  >
                    Call Us Now
                  </motion.button>
                </a>
              </div>
            </Card>
          </motion.div>
        </Container>
      </section>
    </>
  );
}
