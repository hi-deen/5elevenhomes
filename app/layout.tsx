import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { AdminProvider } from "@/components/providers/AdminProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "5Eleven Homes Ltd - Luxury Interior Design & Real Estate",
    template: "%s | 5Eleven Homes Ltd",
  },
  description: "Premier interior design and real estate company offering luxury showroom items, custom interior solutions, and exceptional real estate projects in Kaduna, Nigeria.",
  keywords: ["interior design", "real estate", "luxury furniture", "home design", "Kaduna", "Nigeria", "5Eleven Homes"],
  authors: [{ name: "5Eleven Homes Ltd" }],
  creator: "5Eleven Homes Ltd",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://5elevenhomes.com",
    siteName: "5Eleven Homes Ltd",
    title: "5Eleven Homes Ltd - Luxury Interior Design & Real Estate",
    description: "Premier interior design and real estate company offering luxury showroom items and exceptional real estate projects.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "5Eleven Homes Ltd",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "5Eleven Homes Ltd - Luxury Interior Design & Real Estate",
    description: "Premier interior design and real estate company.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <AdminProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid #D4AF37',
              },
              success: {
                iconTheme: {
                  primary: '#D4AF37',
                  secondary: '#000',
                },
              },
            }}
          />
          
          {/* Elfsight Chatbot and Whatsapp Widget */}
          <Script 
            src="https://elfsightcdn.com/platform.js" 
            strategy="lazyOnload"
          />
          <script src="https://elfsightcdn.com/platform.js" async></script>
          <div className="elfsight-app-a6cddf72-1d7b-4368-9d95-3b29c6c6fcdc" data-elfsight-app-lazy></div>
          <div className="elfsight-app-ed5be1a4-4235-4893-b0f9-149b5b3b392b" data-elfsight-app-lazy></div>
          
        </AdminProvider>
      </body>
    </html>
  );
}
