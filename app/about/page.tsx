import React from 'react';
import {AboutHero} from "@/components/about/AboutHero"
import {AboutStory} from "@/components/about/AboutStory"
import {ExcellenceSection} from "@/components/about/ExcellenceSection"
import {TourismProgress} from "@/components/about/TourismProgress"
import { OurValues } from '@/components/about/AboutValues';
import { TourismStats } from '@/components/about/TourismStats';
import { ZafiriEmpire } from '@/components/about/ZafiriEmpire';
import { MakeADifference } from '@/components/about/MakeDifference';
import { AboutZanzibar } from '@/components/about/AboutZanzibar';

const AboutPage = () => {
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
    </main>
  );
};

export default AboutPage;