import { HeroSection } from "@/components/home/HeroSection";
import { ExcursionsSection } from "@/components/home/ExcursionsSection";
import { DiscoverSection } from "@/components/home/DiscoverSection";
import SurveyInvitation from "@/components/home/SurveyInvitation";
import BlogSection from "@/components/BlogSection";
import { getBlogsByCategory } from "@/lib/blogs";

export default async function Home() {
  const blogs = await getBlogsByCategory('home');


  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HeroSection />
      <ExcursionsSection />
      <DiscoverSection />
      <SurveyInvitation />
      <BlogSection 
        blogs={blogs}
        title="Discover Zanzibar"
        category="home"
      />
    </main>
  );
}
