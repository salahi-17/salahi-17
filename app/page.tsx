import Image from "next/image";
import { HeroSection } from "@/components/HeroSection";
import { ExcursionsSection } from "@/components/ExcursionsSection";
import { DiscoverSection } from "@/components/DiscoverSection";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HeroSection />
      <ExcursionsSection />
      <DiscoverSection />
    </main>
  );
}
