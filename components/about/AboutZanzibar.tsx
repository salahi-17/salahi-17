"use client";
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface Statistic {
  label: string;
  percentage: number;
}

const statistics: Statistic[] = [
  { label: "Increase in Number of Tourists (Dec-2022 to Dec-2023)", percentage: 94 },
  { label: "Average length of stay increase(Dec-2022 to Dec-2023)", percentage: 64 },
  { label: "Number of European Tourists (Dec-2023)", percentage: 73 },
  { label: "Increase in Tourism Revenue (Dec-2022 to Dec-2023)", percentage: 78 },
];

const ProgressBar: React.FC<{ percentage: number; isVisible: boolean }> = ({ percentage, isVisible }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setWidth(percentage);
    }
  }, [isVisible, percentage]);

  return (
    <div className="h-4 bg-gray-200 rounded-full overflow-hidden flex-grow">
      <div
        className="h-full bg-[#E5C1B5] rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

export const AboutZanzibar: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-16" ref={ref}>
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-center">About Zanzibar</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <p className="mb-4">
              Zanzibar's tourism industry has seen significant growth and development. This reason played a pivotal role in the birth of Zafiri, as we seek to provide services that are required now more than ever.
            </p>
            <p>
              Here are some key milestones and metrics showcasing the industry's progression over the past few years:
            </p>
          </div>
          <div className="md:w-1/2">
            {statistics.map((stat, index) => (
              <div key={index} className="mb-6">
                <p className="text-sm mb-2">{stat.label}</p>
                <div className="flex items-center">
                  <ProgressBar percentage={stat.percentage} isVisible={inView} />
                  <span className="ml-2 text-sm font-semibold w-12 text-right">{stat.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};