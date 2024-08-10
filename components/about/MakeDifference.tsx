"use client";
import React, { useState } from 'react';
import Image from 'next/image';

interface TabContent {
  title: string;
  content: string;
  image: string;
}

const tabContents: TabContent[] = [
  {
    title: "Improving school life",
    content: "A better planet for future generations. \n\n The ecological effects from tourism are immeasurable; travelers directly impact soil erosion, CO2 emissions, animal welfare, and deforestation. It's a harsh reality, but we're here to make it a little brighter. \n\n Carbon Offset: We offset your entire trip, including international flights, using the UNFCCC Carbon Offset Platform. Elsewhere selects CERs that meet the highest level of environmental integrity.",
    image: "/about/zanzibar-schools.png"
  },
  {
    title: "Zanrec (waste management)",
    content: "Keeping hard-earned money where it belongs. \n\n 80% of low-income countries focus on tourism as a means of improving their economic situation, but shockingly, as little as 10% of money spent on a typical vacation is actually invested back into those local economies. \n\n Many popular tourist destinations are experiencing negative impacts due to over-tourism, which affects both the environment and local communities. Elsewhere promotes sustainable travel to ensure these destinations remain vibrant for future generations. ",
    image: "/about/zanrec.png"
  },
  {
    title: "Health Improvements Project Zanz",
    content: "Keeping hard-earned money where it belongs.\n\n80% of low-income countries focus on tourism as a means of improving their economic situation, but shockingly, as little as 10% of money spent on a typical vacation is actually invested back into those local economies.\n\nMany popular tourist destinations are experiencing negative impacts due to over-tourism, which affects both the environment and local communities. Elsewhere promotes sustainable travel to ensure these destinations remain vibrant for future generations.",
    image: "/about/hipz.png"
  }
];

export const MakeADifference: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-16 bg-primary w-full text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-4 text-center">Make a difference</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto">
          At Zafiri, we are dedicated to upholding the highest standards in all that we do. Our values guide us in delivering
          exceptional service and fostering a positive impact on society and the environment.
        </p>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-8 md:mb-0">
            {tabContents.map((tab, index) => (
              <div
                key={index}
                className={`py-3 px-6 mb-2 rounded-lg cursor-pointer transition-colors ${
                  activeTab === index ? 'bg-white text-[#E5C1B5]' : 'bg-transparent text-white hover:bg-white/10'
                }`}
                onClick={() => setActiveTab(index)}
              >
                {tab.title}
              </div>
            ))}
          </div>
          <div className="md:w-2/3 md:pl-8">
            <div className="bg-white p-6 rounded-lg text-gray-800">
              <Image
                src={tabContents[activeTab].image}
                alt={tabContents[activeTab].title}
                width={200}
                height={100}
                layout="responsive"
                className="rounded-lg mb-4"
              />
              <h3 className="text-2xl font-bold mb-4">{tabContents[activeTab].title}</h3>
              <p className="whitespace-pre-line">{tabContents[activeTab].content}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};