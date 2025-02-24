import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Zafiri - Connecting You to Zanzibar's Wonders",
  description: "Learn about Zafiri, your trusted travel guide to Zanzibar. Explore our mission to provide authentic experiences and connections to this magical destination.",
};

import {AboutHero} from "@/components/about/AboutHero"
import {AboutStory} from "@/components/about/AboutStory"
import {ExcellenceSection} from "@/components/about/ExcellenceSection"
import {TourismProgress} from "@/components/about/TourismProgress"
import { OurValues } from '@/components/about/AboutValues';
import { TourismStats } from '@/components/about/TourismStats';
import { ZafiriEmpire } from '@/components/about/ZafiriEmpire';
import { MakeADifference } from '@/components/about/MakeDifference';
import { AboutZanzibar } from '@/components/about/AboutZanzibar';
import BlogSection from '@/components/BlogSection';
import { getBlogsByCategory } from '@/lib/blogs';

const AboutPage = async () => {
    const blogs = await getBlogsByCategory('about');
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <AboutHero/>
      <AboutStory/>
      <ExcellenceSection/>
      <TourismProgress/>
      <OurValues />
      <TourismStats/>
      <ZafiriEmpire />
      <MakeADifference/>
      <AboutZanzibar />
      <BlogSection 
        blogs={blogs}
        title="Discover Zanzibar"
        category="about"
      />
    </main>
  );
};

export default AboutPage;