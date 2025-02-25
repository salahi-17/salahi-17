import React from 'react';
import Image from 'next/image';
import { getPlaceholderImage } from '@/utils/images';
import SafariCard from './SafariCard';
import ActivityCard from './ActivityCard';

import { Metadata } from 'next';
import BlogSection from '@/components/BlogSection';
import { getBlogsByCategory } from '@/lib/blogs';
import FaqSection from '@/components/FaqSection';
import { getFaqsByCategory } from '@/lib/getFaqData';

export const metadata: Metadata = {
  title: "Zanzibar Tours & Activities - Adventure Await",
  description: "Experience the best tours and activities Zanzibar has to offer. From safaris to ocean adventures, Zafiri creates unforgettable memories",
};

async function ToursActivitiesPage() {
  
  const blogs = await getBlogsByCategory('activities');
  const faqData = await getFaqsByCategory('activities');

  const safaris = [
    {
      title: "11 DAYS SAFARI TRIP TANZANIA AND ZANZIBAR",
      price: "2000",
      image: "/activities/keyur-nandaniya.webp",
      description: "• 24/7 service\n• All accommodations\n• Includes: Serengeti, Two days Central Serengeti,\nNgorongoro, six days Zanzibar",
    },
    {
      title: "11 DAYS SAFARI TRIP TANZANIA AND ZANZIBAR",
      price: "2000",
      image: "/activities/elephants.webp",
      description: "• 24/7 service\n• All accommodations\n• Includes: Serengeti, Two days Central Serengeti,\nNgorongoro, six days Zanzibar",
    },
    {
      title: "11 DAYS SAFARI TRIP TANZANIA AND ZANZIBAR",
      price: "2000",
      image: "/activities/lareised-leneseur.webp",
      description: "• 24/7 service\n• All accommodations\n• Includes: Serengeti, Two days Central Serengeti,\nNgorongoro, six days Zanzibar",
    },
  ];

  const activities = [
    { title: "LAND ACTIVITIES | QUAD BIKING", location: "Zanzibar | Jambiani", image: "/activities/Quad-Biking.webp", category: "Quad Biking", area: "Jambiani" },
    { title: "LAND ACTIVITIES | YOGA", location: "Zanzibar | Kizimkazi", image: "/activities/Yoga-.webp", category: "Yoga", area: "Kizimkazi" },
    { title: "LAND ACTIVITIES | HORSE RIDING", location: "Zanzibar | Kiwengwa Beach", image: "/activities/Horse-Riding.webp", category: "Horse Riding", area: "Kiwengwa Beach" },
    { title: "WATER ACTIVITIES | JET SKI", location: "Zanzibar | Paje Beach", image: "/activities/Jet-Ski.webp", category: "Jet Ski", area: "Paje Beach" },
    { title: "WATER ACTIVITIES | KAYAKING", location: "Zanzibar | Nungwi Beach", image: "/activities/Kayak.webp", category: "Kayaking", area: "Nungwi Beach" },
    { title: "LAND ACTIVITIES | CAMEL RIDING", location: "Zanzibar | Kiwengwa", image: "/activities/Camel-Riding.webp", category: "Camel Riding", area: "Kiwengwa" },
  ];

  const heroImageData = await getPlaceholderImage("/activities/sight-seeing.jpg");
  
  const safarisWithPlaceholders = await Promise.all(
    safaris.map(async (safari) => {
      const imageData = await getPlaceholderImage(safari.image);
      return { ...safari, imageData };
    })
  );

  const activitiesWithPlaceholders = await Promise.all(
    activities.map(async (activity) => {
      const imageData = await getPlaceholderImage(activity.image);
      return { ...activity, imageData };
    })
  );

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[500px] mb-12">
        <Image
          src="/activities/sight-seeing.jpg"
          alt="Tours and Activities"
          fill
          style={{ objectFit: "cover" }}
          placeholder="blur"
          blurDataURL={heroImageData.placeholder}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
          <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl md:text-7xl font-bold text-white text-center">
            TOURS AND ACTIVITIES
          </h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Tours and Safaris</h2>
        <div className="space-y-6">
          {safarisWithPlaceholders.map((safari, index) => (
            <SafariCard key={index} safari={safari} />
          ))}
        </div>

        <h2 className="text-3xl font-bold my-8">Activities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activitiesWithPlaceholders.map((activity, index) => (
            <ActivityCard key={index} activity={activity} />
          ))}
        </div>
      </div>
      <BlogSection 
        blogs={blogs}
        title="Acitivites in Zanzibar"
        category="activities"
      />
      {faqData && faqData.faqs.length > 0 && (
        <FaqSection 
          faqs={faqData.faqs} 
          title={faqData.pageTitle}
        />
      )}
    </>
  );
};

export default ToursActivitiesPage;