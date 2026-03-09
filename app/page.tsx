'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { formatPrice } from '@/lib/utils';

interface ShowroomItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  availability: string;
  images: { url: string; id: string }[];
}

export default function ShowroomPage() {
  const [items, setItems] = useState<ShowroomItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ShowroomItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const categories = ['All', 'Living Room', 'Bedroom', 'Dining', 'Office', 'Outdoor', 'Decor'];
  const availabilityOptions = ['All', 'Available', 'Sold', 'Reserved'];

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm, selectedCategory, selectedAvailability]);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/showroom');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Availability filter
    if (selectedAvailability !== 'All') {
      filtered = filtered.filter((item) => item.availability === selectedAvailability);
    }

    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

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
              Our <span className="text-gold">Showroom</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover our curated collection of premium furniture and décor items
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Filters Section */}
      <section className="section-padding">
        <Container>
          <Card className="p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Search */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-primary-light border border-gold/30 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-primary-light border border-gold/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Availability
                </label>
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  className="w-full px-4 py-3 bg-primary-light border border-gold/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {availabilityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Results */}
          {isLoading ? (
            <div className="py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : currentItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No items found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {currentItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Link href={`/showroom/${item.id}`}>
                      <Card hover className="h-full overflow-hidden group">
                        <div className="relative h-64 overflow-hidden">
                          {item.images && item.images.length > 0 ? (
                            <Image
                              src={item.images[0].url}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                              <span className="text-gray-500">No Image</span>
                            </div>
                          )}
                          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium border ${getAvailabilityColor(item.availability)}`}>
                            {item.availability}
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-gold font-bold text-lg">
                              {formatPrice(item.price)}
                            </span>
                            <span className="text-gray-500 text-sm">{item.category}</span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={index}
                      variant={currentPage === index + 1 ? 'primary' : 'outline'}
                      onClick={() => setCurrentPage(index + 1)}
                      className="w-10"
                    >
                      {index + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </Container>
      </section>
    </>
  );
}
