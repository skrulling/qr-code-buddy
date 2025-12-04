import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QR Code Buddy",
  description: "Generate and download high-quality PNG QR codes in seconds.",
  metadataBase: new URL("https://qr-code-buddy.vercel.app"),
  openGraph: {
    title: "QR Code Buddy",
    description: "Generate and download high-quality PNG QR codes in seconds.",
    url: "https://qr-code-buddy.vercel.app",
    siteName: "QR Code Buddy",
    images: ["/opengraph-image"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Code Buddy",
    description: "Generate and download high-quality PNG QR codes in seconds.",
    images: ["/twitter-image"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
