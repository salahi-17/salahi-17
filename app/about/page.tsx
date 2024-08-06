import React from 'react';
import {AboutHero} from "@/components/about/AboutHero"
import {AboutStory} from "@/components/about/AboutStory"
import {ExcellenceSection} from "@/components/about/ExcellenceSection"
import {TourismProgress} from "@/components/about/TourismProgress"

const AboutPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <AboutHero/>
      <AboutStory/>
      <ExcellenceSection/>
      <TourismProgress/>
    </main>
  );
};

export default AboutPage;