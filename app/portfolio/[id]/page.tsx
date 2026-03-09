'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ArrowLeft, Building2, User, MapPin, Calendar, CheckCircle } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { formatDate } from '@/lib/utils';

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  clientType: string;
  location: string;
  servicesDelivered: string[];
  completionDate: string;
  images: { url: string; id: string }[];
}

export default function PortfolioProjectPage() {
  const params = useParams();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/portfolio/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
        setRelatedProjects(data.relatedProjects || []);
      }
    } catch (error) {
      console.error('Failed to fetch project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-white mb-4">Project Not Found</h2>
        <Link href="/portfolio">
          <Button>
            <ArrowLeft className="mr-2" size={20} />
            Back to Portfolio
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <section className="section-padding">
      <Container>
        {/* Back Button */}
        <Link href="/portfolio">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2" size={20} />
            Back to Portfolio
          </Button>
        </Link>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            {project.clientType === 'Corporate' ? (
              <Building2 className="text-gold" size={24} />
            ) : (
              <User className="text-gold" size={24} />
            )}
            <span className="text-gold font-medium">{project.clientType} Project</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-6 text-gray-300">
            {project.location && (
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-gold" />
                <span>{project.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-gold" />
              <span>Completed: {formatDate(project.completionDate)}</span>
            </div>
          </div>
        </motion.div>

        {/* Image Gallery */}
        {project.images && project.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              className="rounded-lg overflow-hidden h-[500px] md:h-[600px]"
            >
              {project.images.map((image) => (
                <SwiperSlide key={image.id}>
                  <div className="relative w-full h-full">
                    <Image
                      src={image.url}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          {/* Project Description */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="p-8">
              <h2 className="text-3xl font-serif font-bold text-white mb-6">
                Project Overview
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </Card>
          </motion.div>

          {/* Services Delivered */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="p-8">
              <h3 className="text-2xl font-serif font-bold text-white mb-6">
                Services Delivered
              </h3>
              <ul className="space-y-3">
                {project.servicesDelivered.map((service, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-gold mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{service}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-8 bg-gold/5 border-gold/30 text-center">
            <h3 className="text-2xl font-serif font-bold text-white mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Let us bring your vision to life with the same quality and attention to detail 
              you see in our portfolio.
            </p>
            <Link href="/contact">
              <Button size="lg">Get Started Today</Button>
            </Link>
          </Card>
        </motion.div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-serif font-bold text-white mb-8">
              Related Projects
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProjects.slice(0, 3).map((relatedProject) => (
                <Link key={relatedProject.id} href={`/portfolio/${relatedProject.id}`}>
                  <Card hover className="h-full overflow-hidden group">
                    <div className="relative h-48 overflow-hidden">
                      {relatedProject.images && relatedProject.images.length > 0 ? (
                        <Image
                          src={relatedProject.images[0].url}
                          alt={relatedProject.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                        {relatedProject.title}
                      </h3>
                      <span className="text-gold text-sm">{relatedProject.clientType}</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
