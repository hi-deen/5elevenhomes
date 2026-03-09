'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  FolderKanban, 
  Building, 
  LogOut,
  Menu,
  X,
  Settings
} from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [status, pathname, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If on login page
  if (pathname === '/admin/login') {
    // If authenticated, redirect to dashboard
    if (status === 'authenticated') {
      router.push('/admin/dashboard');
      return null;
    }
    // If unauthenticated, show login page
    return <>{children}</>;
  }

  // For all other admin pages, require authentication
  if (status === 'unauthenticated') {
    return null;
  }

  const menuItems = [
    { href: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { href: '/admin/showroom', icon: <Package size={20} />, label: 'Showroom' },
    { href: '/admin/portfolio', icon: <FolderKanban size={20} />, label: 'Portfolio' },
    { href: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const realEstateMenuItem = { 
    href: '/admin/real-estates', 
    icon: <Building size={20} />, 
    label: 'Real Estates' 
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <div className="min-h-screen bg-primary">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-primary-light border-b border-gold/20 z-50 flex items-center justify-between px-4">
        <span className="text-xl font-serif font-bold text-gold">5Eleven Admin</span>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gold p-2"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-primary-light border-r border-gold/20 z-40 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-6 border-b border-gold/20">
          <h1 className="text-2xl font-serif font-bold text-gold">5Eleven Admin</h1>
          <p className="text-sm text-gray-400 mt-1">Welcome, {session?.user?.name}</p>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive
                    ? 'bg-gold text-primary font-semibold'
                    : 'text-gray-300 hover:bg-primary hover:text-gold'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}

          {/* Real Estates - Separated */}
          <div className="pt-3 mt-3 border-t border-gold/20">
            <Link
              href={realEstateMenuItem.href}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors border ${
                pathname.startsWith(realEstateMenuItem.href)
                  ? 'bg-gold text-primary font-semibold border-gold'
                  : 'text-gold hover:bg-gold/10 border-gold/30'
              }`}
            >
              {realEstateMenuItem.icon}
              {realEstateMenuItem.label}
            </Link>
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gold/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-300 hover:bg-red-500/10 hover:text-red-400 rounded-md transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
