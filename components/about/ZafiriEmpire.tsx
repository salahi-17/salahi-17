"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { getPlaceholderImage } from '@/utils/images';

interface Stat {
  value: number;
  label: string;
}

const stats: Stat[] = [
  { value: 64, label: 'HOTELS' },
  { value: 76, label: 'RESTAURANTS' },
  { value: 8, label: 'SAFARIS' },
  { value: 32, label: 'TOUR OPERATORS' },
  { value: 79, label: 'ACTIVITIES' },
];

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = Math.ceil(end / (duration / 16));

      const timer = setInterval(() => {
        start += increment;
        if (start > end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return <span ref={ref}>{count}</span>;
};

export const ZafiriEmpire: React.FC = () => {
  const [imageData, setImageData] = useState<{ src: string; placeholder: string } | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      const data = await getPlaceholderImage("/about/zafiri-empire.webp");
      setImageData(data);
    };
    loadImage();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            {imageData && (
              <Image
                src={imageData.src}
                alt="Zafiri partnerships"
                width={600}
                height={400}
                layout="responsive"
                className="rounded-lg border-4 border-[#E5C1B5]"
                placeholder="blur"
                blurDataURL={imageData.placeholder}
              />
            )}
          </div>
          <div className="md:w-1/2 md:pl-12">
            <p className="text-[#E5C1B5] uppercase font-semibold mb-2">TOGETHER</p>
            <h2 className="text-4xl font-bold mb-4">Zafiri empire</h2>
            <p className="text-gray-600 mb-8">
              At Zafiri we have partnered up with a plethora of hotels and restaurants all in 
              hopes to ensure you get the best experience thats tailored to your needs.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl font-bold text-[#E5C1B5]">
                    <AnimatedNumber value={stat.value} />
                  </p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};