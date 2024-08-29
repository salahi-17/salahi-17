// components/TabContent.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface TabContentProps {
  tabContents: {
    title: string;
    content: string;
    imageData: {
      src: string;
      placeholder: string;
    };
  }[];
}

export const TabContent: React.FC<TabContentProps> = ({ tabContents }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
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
        <div className="bg-white p-6 rounded-lg text-gray-800 align-center">
          <Image
            src={tabContents[activeTab].imageData.src}
            alt={tabContents[activeTab].title}
            width={200}
            height={100}
            style={{ width: '20%', height: 'auto' }}
            placeholder="blur"
            blurDataURL={tabContents[activeTab].imageData.placeholder}
          />
          <h3 className="text-2xl font-bold mb-4">{tabContents[activeTab].title}</h3>
          <p className="whitespace-pre-line">{tabContents[activeTab].content}</p>
        </div>
      </div>
    </div>
  );
};