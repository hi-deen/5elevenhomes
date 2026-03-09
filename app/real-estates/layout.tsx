import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real Estate Projects",
  description: "Explore our premium real estate developments. Quality construction, modern design, and excellent investment opportunities in Kaduna, Nigeria.",
  openGraph: {
    title: "Real Estate Projects | 5Eleven Homes Ltd",
    description: "Explore our premium real estate developments and investment opportunities.",
  },
};

export default function RealEstatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
