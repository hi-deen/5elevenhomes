import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with 5Eleven Homes Ltd. Visit our office in Kaduna or reach out via phone and email for inquiries and consultations.",
  openGraph: {
    title: "Contact Us | 5Eleven Homes Ltd",
    description: "Get in touch with 5Eleven Homes Ltd for inquiries and consultations.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
