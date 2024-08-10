"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface Stat {
  value: number;
  label: string;
  color: string;
}

const stats: Stat[] = [
  { value: 53, label: 'Customers', color: 'text-red-500' },
  { value: 8, label: 'Charity partnerships', color: 'text-blue-500' },
  { value: 39, label: 'Employment Growth', color: 'text-green-500' }
];

const AnimatedNumber: React.FC<{ value: number; color: string }> = ({ value, color }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = value;
      const duration = 2000; // 2 seconds
      const increment = Math.ceil(end / (duration / 16)); // 60 FPS

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

  return <span ref={ref} className={`text-5xl font-bold ${color}`}>{count}</span>;
};

export const TourismStats: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-4 text-center">Tourism with Zafiri</h2>
        <p className="text-center text-gray-600 mb-12">Explore the remarkable growth of Zafiri in just 6 months.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-primary p-8 rounded-lg shadow-lg text-center">
              <AnimatedNumber value={stat.value} color={stat.color} />
              <p className="mt-2 text-xl font-semibold text-gray-700">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};