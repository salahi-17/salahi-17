import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/FooterSection";
import { Toaster } from "@/components/ui/toaster"
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import SurveyPopup from "@/components/SurveyPopup";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Welcome to Zafiri - Your Gateway to Zanzibar",
  description: "Discover the beauty of Zanzibar with Zafiri. Explore breathtaking beaches, curated itineraries, and unforgettable experiences. Plan your dream trip today!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
      <SessionProviderWrapper>
        <Header/>
        {children}
        <Footer/>
        <Toaster />
        </SessionProviderWrapper>
        <SurveyPopup />
      </body>
    </html>
  );
}

