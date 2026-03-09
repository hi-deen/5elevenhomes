'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Package, FolderKanban, Building, Plus, Settings } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    showroomItems: 0,
    portfolioProjects: 0,
    realEstateSections: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [showroom, portfolio, realEstates] = await Promise.all([
        fetch('/api/showroom').then(res => res.json()),
        fetch('/api/portfolio').then(res => res.json()),
        fetch('/api/real-estates').then(res => res.json()),
      ]);

      setStats({
        showroomItems: showroom.length || 0,
        portfolioProjects: portfolio.length || 0,
        realEstateSections: realEstates.length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const dashboardCards = [
    {
      title: 'Showroom Items',
      count: stats.showroomItems,
      icon: <Package size={40} />,
      color: 'from-blue-500 to-blue-600',
      href: '/admin/showroom',
    },
    {
      title: 'Portfolio Projects',
      count: stats.portfolioProjects,
      icon: <FolderKanban size={40} />,
      color: 'from-purple-500 to-purple-600',
      href: '/admin/portfolio',
    },
    {
      title: 'Real Estate Sections',
      count: stats.realEstateSections,
      icon: <Building size={40} />,
      color: 'from-green-500 to-green-600',
      href: '/admin/real-estates',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Manage your website content</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card hover className="p-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center mb-4 text-white`}>
                {card.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{card.count}</h3>
              <p className="text-gray-400 mb-4">{card.title}</p>
              <Link href={card.href}>
                <Button variant="outline" size="sm" className="w-full">
                  Manage
                </Button>
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <Card className="p-6">
          <h2 className="text-2xl font-serif font-bold text-white mb-4">Website Links</h2>
          <div className="space-y-3">
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" className="w-full justify-start">
                View Public Website
              </Button>
            </a>
            <a href="/showroom" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" className="w-full justify-start">
                View Showroom
              </Button>
            </a>
            <a href="/portfolio" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" className="w-full justify-start">
                View Portfolio
              </Button>
            </a>
            <a href="/real-estates" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" className="w-full justify-start">
                View Real Estates
              </Button>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
