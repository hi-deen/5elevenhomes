import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Showroom",
  description: "Browse our curated collection of premium furniture and décor items. Find the perfect pieces for your home or office.",
  openGraph: {
    title: "Showroom | 5Eleven Homes Ltd",
    description: "Browse our curated collection of premium furniture and décor items.",
  },
};

export default function ShowroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
