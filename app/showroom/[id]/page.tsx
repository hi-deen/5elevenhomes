'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import { ArrowLeft, Phone, Mail } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { formatPrice } from '@/lib/utils';

interface ShowroomItem {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  price: number;
  category: string;
  availability: string;
  specifications: any;
  images: { url: string; id: string }[];
}

export default function ShowroomItemPage() {
  const params = useParams();
  const [item, setItem] = useState<ShowroomItem | null>(null);
  const [relatedItems, setRelatedItems] = useState<ShowroomItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  useEffect(() => {
    if (params.id) {
      fetchItem();
    }
  }, [params.id]);

  const fetchItem = async () => {
    try {
      const response = await fetch(`/api/showroom/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setItem(data.item);
        setRelatedItems(data.relatedItems || []);
      }
    } catch (error) {
      console.error('Failed to fetch item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available':
        return 'bg-green-500/20 text-green-400 border-green-500';
      case 'Sold':
        return 'bg-red-500/20 text-red-400 border-red-500';
      case 'Reserved':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-white mb-4">Item Not Found</h2>
        <Link href="/showroom">
          <Button>
            <ArrowLeft className="mr-2" size={20} />
            Back to Showroom
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <section className="section-padding">
      <Container>
        {/* Back Button */}
        <Link href="/showroom">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2" size={20} />
            Back to Showroom
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {item.images && item.images.length > 0 ? (
              <div className="space-y-4">
                <Swiper
                  modules={[Navigation, Thumbs, Pagination]}
                  navigation
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  pagination={{ clickable: true }}
                  className="rounded-lg overflow-hidden h-[500px]"
                >
                  {item.images.map((image) => (
                    <SwiperSlide key={image.id}>
                      <div className="relative w-full h-full">
                        <Image
                          src={image.url}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {item.images.length > 1 && (
                  <Swiper
                    modules={[Thumbs]}
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    watchSlidesProgress
                    className="thumbs-swiper"
                  >
                    {item.images.map((image) => (
                      <SwiperSlide key={image.id} className="cursor-pointer">
                        <div className="relative w-full h-24 rounded-md overflow-hidden">
                          <Image
                            src={image.url}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>
            ) : (
              <div className="w-full h-[500px] bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No Images Available</span>
              </div>
            )}
          </motion.div>

          {/* Item Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4">
              <span className="text-gold text-sm font-medium">{item.category}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {item.title}
            </h1>
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium border mb-6 ${getAvailabilityColor(item.availability)}`}>
              {item.availability}
            </div>

            <div className="mb-8">
              <span className="text-5xl font-bold text-gold">{formatPrice(item.price)}</span>
            </div>

            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              {item.fullDescription || item.description}
            </p>

            {item.specifications && (
              <Card className="p-6 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Specifications</h3>
                <div className="space-y-2">
                  {Object.entries(item.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-gold/10 pb-2">
                      <span className="text-gray-400 capitalize">{key}:</span>
                      <span className="text-white">{value as string}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Contact CTA */}
            <Card className="p-6 bg-gold/5 border-gold/30">
              <h3 className="text-xl font-semibold text-white mb-4">Interested in this item?</h3>
              <p className="text-gray-300 mb-4">
                Contact us today to learn more, schedule a viewing, or make a purchase.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/contact" className="flex-1">
                  <Button className="w-full">
                    <Mail className="mr-2" size={18} />
                    Contact Us
                  </Button>
                </Link>
                <a href="tel:+2348132001621" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Phone className="mr-2" size={18} />
                    Call Now
                  </Button>
                </a>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-serif font-bold text-white mb-8">Related Items</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedItems.slice(0, 4).map((relatedItem) => (
                <Link key={relatedItem.id} href={`/showroom/${relatedItem.id}`}>
                  <Card hover className="h-full overflow-hidden group">
                    <div className="relative h-48 overflow-hidden">
                      {relatedItem.images && relatedItem.images.length > 0 ? (
                        <Image
                          src={relatedItem.images[0].url}
                          alt={relatedItem.title}
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
                        {relatedItem.title}
                      </h3>
                      <span className="text-gold font-bold">{formatPrice(relatedItem.price)}</span>
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
