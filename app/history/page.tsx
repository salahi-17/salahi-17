import React from 'react';
import Image from 'next/image';
import { getPlaceholderImage } from '@/utils/images';
import { aclonica } from '@/utils/aclonica';
import { Metadata } from 'next';
import BlogSection from '@/components/BlogSection';
import { getBlogsByCategory } from '@/lib/blogs';
import FaqSection from '@/components/FaqSection';
import { getFaqsByCategory } from '@/lib/getFaqData';

export const metadata: Metadata = {
  title: "Zanzibar History & Culture - A Journey Through Time",
  description: "Dive into Zanzibar’s rich history and diverse culture. Explore its roots in trade, its vibrant architecture, and the stories that shape this island paradise",
};


const HistoryCulturePage = async () => {
  const blogs = await getBlogsByCategory('history');
  const faqData = await getFaqsByCategory('history');

  const timelineEvents = [
    {
      period: "2000s",
      events: [
        {
          title: "Cultural Heritage and Spice Trade",
          description: "Zanzibar continues to thrive as a tourist haven, showcasing its rich cultural heritage, spice industries, and beautiful beaches. The islands remain a popular destination for travelers seeking a blend of history, culture, and tropical relaxation."
        },
        {
          title: "A Global Tourism Hotspot",
          description: "The substantial expansion of the tourism sector led to significant economic growth. Zanzibar became renowned for its pristine beaches, historic Stone Town, and vibrant culture. This period saw increased investment in infrastructure, hotels, and eco-friendly resorts."
        }
      ],
      image: "/history/joana-abreu.webp"
    },
    {
      period: "1900s",
      events: [
        {
          title: "Colonial Rule",
          description: "In 1890, the British and German governments signed an agreement, with the British taking control of Zanzibar and the Germans taking control of Tanganyika. Zanzibar officially became a British protectorate in 1890."
        },
        {
          title: "Tourism Renaissance & Preservation",
          description: "Zanzibar experienced a tourism boom during the 1980s and 1990s. Efforts to preserve the historic Stone Town began, leading to its eventual recognition as a UNESCO World Heritage site. The island's economy shifted towards tourism, with many traditional industries adapting to cater to visitors."
        }
      ],
      image: "/history/1900s-Zanzibar.webp"
    },
    {
      period: "1832 - 1896",
      events: [
        {
          title: "Zanzibar's Golden Age",
          description: "Sultan Said bin Sultan moved his capital to Zanzibar, heralding a golden age of trade and prosperity. The island of Zanzibar became the main slave market of the East African coast, Swahili civilization experienced a zenith."
        },
        {
          title: "UNESCO World Heritage Site",
          description: "Stone Town, the old part of Zanzibar City, is a fine example of the Swahili coastal trading towns of East Africa. It retains its urban fabric and townscape virtually intact and contains many fine buildings that reflect its particular culture, which has brought together and homogenized disparate elements of the cultures of Africa, the Arab region, India, and Europe over more than a millennium."
        }
      ],
      image: "/history/1896-Zanzibar.webp"
    },
    {
      period: "1698 - 1832",
      events: [
        {
          title: "Colonial Tug-of-War",
          description: "Zanzibar fell under the control of the Sultanate of Oman in 1698, gradually supplanting Portuguese influence. This period saw significant development of Zanzibar's spice plantations."
        },
        {
          title: "Maritime Influence",
          description: "The fortunes of Zanzibar were tied to the sea and global trade. The Omani rule brought about significant changes, including the development of Stone Town and the establishment of Zanzibar as a major port and maritime power."
        }
      ],
      image: "/history/1698-Zanzibar.webp"
    },
    {
      period: "700 AD - 17th Century",
      events: [
        {
          title: "Ancient Traders and Settlers",
          description: "Zanzibar's first permanent residents were African farmers who crossed from the mainland. By 700AD, Arab and Persian traders had established Zanzibar as a base for voyages to and from India, China, Arabia and Persia. The island of Unguja offered a protected and defensible harbor, fresh water, and fertile soil."
        },
        {
          title: "Colonization",
          description: "The Portuguese were among the first Europeans to explore the region. In 1498, Vasco da Gama's expedition landed on the East African coast. The Portuguese subsequently colonized Zanzibar, which remained under their control until the early 18th century when the Omani Arabs ousted them."
        }
      ],
      image: "/history/700-AD.webp"
    }
  ];

  const heroImageData = await getPlaceholderImage("/home/humphrey-muleba-e6dRLBx6Kg8-unsplash-scaled.jpeg");

  const timelineEventsWithPlaceholders = await Promise.all(
    timelineEvents.map(async (event) => ({
      ...event,
      imageData: await getPlaceholderImage(event.image),
    }))
  );

  const galleryImages = [
    "/history/zanzibar-history-1.webp",
    "/history/zanzibar-history-2.webp",
    "/history/zanzibar-history-3.webp",
  ];

  const galleryImagesWithPlaceholders = await Promise.all(
    galleryImages.map(async (image) => ({
      src: image,
      imageData: await getPlaceholderImage(image),
    }))
  );

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[500px] mb-12">
        <Image
          src="/home/humphrey-muleba-e6dRLBx6Kg8-unsplash-scaled.jpeg"
          alt="Zanzibar History"
          fill
          style={{ objectFit: "cover" }}
          placeholder="blur"
          blurDataURL={heroImageData.placeholder}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white z-10">
          <h1 className={`text-4xl md:text-7xl font-bold mb-4 drop-shadow-lg ${aclonica.className}`}>History & Culture</h1>
        </div>
      </div>

      {/* Introduction */}
      <div className="container mx-auto px-4 mb-12">
        <p className="text-center max-w-3xl mx-auto">
          Known for its cultural diversity and strategic location, Zanzibar's history reflects a melange of influences, from ancient trade routes to colonial powers. As a historically important trading post in the Indian Ocean, the Zanzibar archipelago played a significant role in the spice trade, the slave trade, and the political dynamics of East Africa. This rich historical tapestry has left an indelible mark on Zanzibar's culture, architecture, cuisine, and social fabric, making it a unique blend of African, Arab, Indian, and European influences.
        </p>
      </div>

      {/* Timeline Section */}
      <div className="container mx-auto px-4 py-12">
        {timelineEventsWithPlaceholders.map((event, index) => (
          <div key={index} className="mb-16 md:flex items-stretch">
            {/* Period */}
            <div className="md:w-1/4 pr-8 mb-4 md:mb-0">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-700">{event.period}</h2>
            </div>

            {/* Image and Events */}
            <div className="md:w-3/4 flex flex-col md:flex-row">
              {/* Image */}
              <div className="md:w-1/2 mb-4 md:mb-0 md:pr-8 relative">
                <div className="relative w-full h-0 pb-[75%]"> {/* Maintain aspect ratio */}
                  <Image
                    src={event.image}
                    alt={`${event.period} image`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                    className="rounded-lg z-10"
                    placeholder="blur"
                    blurDataURL={event.imageData.placeholder}
                  />
                </div>
              </div>

              {/* Events */}
              <div className="md:w-1/2 md:pl-8 md:border-l-2 border-[#e75f40]">
                {event.events.map((subEvent, subIndex) => (
                  <div key={subIndex} className="mb-6">
                    <h3 className="text-xl md:text-2xl font-semibold mb-2 text-[#e75f40]">{subEvent.title}</h3>
                    <p className="text-gray-600">{subEvent.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Gallery
      <div className="container mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {galleryImagesWithPlaceholders.map((image, index) => (
            <div key={index} className="relative h-72">
              <Image
                src={image.src}
                alt={`Zanzibar History ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg z-10"
                placeholder="blur"
                blurDataURL={image.imageData.placeholder}
              />
            </div>
          ))}
        </div>
      </div> */}
      <BlogSection 
        blogs={blogs}
        title="Discover Zanzibar's History"
        category="history"
      />

      {/* Rising Promise Section */}
      <div className="bg-primary py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Rising Promise</h2>
          <p className="max-w-2xl mx-auto">
            Zanzibar's future presents a wealth of promise, combining global interest with its pride in a unique heritage. As tourism continues to grow, sustainable practices are being implemented to preserve the archipelago's natural beauty and cultural significance. The government and local communities are working together to balance economic development with environmental conservation, ensuring Zanzibar remains a paradise for generations to come. Investments in education, healthcare, and infrastructure promise a brighter future for the island's inhabitants while maintaining the charm and allure that make Zanzibar a world-renowned destination.
          </p>
        </div>
      </div>

      {faqData && faqData.faqs.length > 0 && (
        <FaqSection 
          faqs={faqData.faqs} 
          title={faqData.pageTitle}
        />
      )}
    </div>
  );
};

export default HistoryCulturePage;
