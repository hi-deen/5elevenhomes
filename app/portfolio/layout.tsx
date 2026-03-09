import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Follow our latest interior design and real estate projects on Instagram. See how we've transformed spaces for individuals and corporate clients.",
  openGraph: {
    title: "Portfolio | 5Eleven Homes Ltd",
    description: "Follow our latest interior design and real estate projects on Instagram.",
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
