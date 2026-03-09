import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about 5Eleven Homes Ltd - Your premier destination for luxury interior design and real estate solutions in Kaduna, Nigeria.",
  openGraph: {
    title: "About Us | 5Eleven Homes Ltd",
    description: "Learn about 5Eleven Homes Ltd - Your premier destination for luxury interior design and real estate solutions.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
