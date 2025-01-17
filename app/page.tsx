import { HeroSection } from "@/components/home/HeroSection";
import { ExcursionsSection } from "@/components/home/ExcursionsSection";
import { DiscoverSection } from "@/components/home/DiscoverSection";
import SurveyInvitation from "@/components/home/SurveyInvitation";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HeroSection />
      <ExcursionsSection />
      <DiscoverSection />
      <SurveyInvitation />
    </main>
  );
}
