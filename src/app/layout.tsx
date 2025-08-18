import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/provider";
import Footer from "@/components/Footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Engr. Hachnayen Ahmed - BIM & AutoCAD Trainer | Structural Analysis Specialist | CADD CORE",
    template: "%s | Engr. Hachnayen Ahmed"
  },
  description: "Professional BIM modeling, structural analysis, AutoCAD, and design skills. BIM & AutoCAD Trainer, Structural Analysis Specialist. Founder & CEO - CADD CORE. Empowering students with professional BIM modeling expertise.",
  keywords: [
    "BIM modeling",
    "AutoCAD training",
    "structural analysis",
    "CAD design",
    "BIM trainer",
    "structural engineer",
    "CADD CORE",
    "Engr. Hachnayen Ahmed",
    "civil engineering",
    "3D modeling",
    "construction technology",
    "building information modeling"
  ],
  authors: [{ name: "Engr. Hachnayen Ahmed" }],
  creator: "Engr. Hachnayen Ahmed",
  publisher: "CADD CORE",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.hachnayen.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.hachnayen.com',
    title: 'Engr. Hachnayen Ahmed - BIM & AutoCAD Trainer | Structural Analysis Specialist',
    description: 'Professional BIM modeling, structural analysis, AutoCAD, and design skills. Founder & CEO - CADD CORE. Empowering students with professional BIM modeling expertise.',
    siteName: 'Engr. Hachnayen Ahmed Portfolio',
    images: [
      {
        url: '/og-image.jpg', // Add your Open Graph image
        width: 1200,
        height: 630,
        alt: 'Engr. Hachnayen Ahmed - BIM & AutoCAD Specialist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engr. Hachnayen Ahmed - BIM & AutoCAD Trainer | Structural Analysis Specialist',
    description: 'Professional BIM modeling, structural analysis, AutoCAD, and design skills. Founder & CEO - CADD CORE.',
    creator: '@hachnayen', // Add your Twitter handle
    images: ['/og-image.jpg'], // Add your Twitter image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}>
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
