import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
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
  metadataBase: new URL("https://fix-it-project.vercel.app"),
  title: "FixIt - Servis Mewah Tanpa Drama",
  description: "Platform terpercaya untuk servis dan pemeliharaan barang elektronik rumah tangga dengan transparansi biaya penuh dan teknisi tersertifikasi.",
  icons: {
    icon: "/images/logo/logo-fixit.png",
    apple: "/images/logo/logo-fixit.png",
  },
  openGraph: {
    title: "FixIt - Servis Mewah Tanpa Drama",
    description: "Platform terpercaya untuk servis dan pemeliharaan barang elektronik rumah tangga dengan transparansi biaya penuh dan teknisi tersertifikasi.",
    url: "https://fix-it-project.vercel.app",
    siteName: "FixIt",
    images: [
      {
        url: "/og-image.png",
        width: 1024,
        height: 576,
        alt: "FixIt - Premium Home Appliance Repair Services",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FixIt - Servis Mewah Tanpa Drama",
    description: "Platform terpercaya untuk servis dan pemeliharaan barang elektronik rumah tangga dengan transparansi biaya penuh.",
    images: ["/og-image.png"],
  },
};

import NextTopLoader from "nextjs-toploader";
import PageTransition from "@/components/layout/PageTransition";
import NotificationToast from "@/components/features/NotificationToast";
import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-900 text-slate-50 selection:bg-orange-500 selection:text-white">
        <Providers>
          <NextTopLoader 
            color="#f97316"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #f97316,0 0 5px #f97316"
        />
        <Navbar />
        <main className="flex-1 flex flex-col">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <NotificationToast />
        </Providers>
      </body>
    </html>
  );
}
