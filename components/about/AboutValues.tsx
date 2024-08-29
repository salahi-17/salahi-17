import React from 'react';
import Image from 'next/image';
import { getPlaceholderImage } from '@/utils/images';

interface Value {
  title: string;
  description: string;
}

const values: Value[] = [
  {
    title: "Social Responsibility",
    description: "Empowering local communities through sustainable tourism."
  },
  {
    title: "Sustainability",
    description: "Promoting eco-friendly practices to preserve Zanzibar's natural beauty."
  },
  {
    title: "Trust",
    description: "Building lasting relationships with our clients and partners."
  },
  {
    title: "Integrity",
    description: "Upholding the highest standards of honesty and transparency."
  },
  {
    title: "Quality",
    description: "Delivering exceptional experiences and services to our guests."
  }
];

export const OurValues = async () => {
  const imageData = await getPlaceholderImage("/about/0-d7d21274-c0bf-4315-aa0f-0e4702f507d3-800x800.webp");

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-center">Our Values</h2>
        <div className="flex flex-col md:flex-row items-start">
          <div className="md:w-1/2 pr-8">
            <p className="mb-6">At Zafiri, we are committed to:</p>
            <ul className="space-y-4">
              {values.map((value, index) => (
                <li key={index}>
                  <strong className="font-semibold">{value.title}:</strong> {value.description}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <Image
              src={imageData.src}
              alt="Zafiri's commitment to nature and sustainability"
              width={600}
              height={400}
              placeholder="blur"
              blurDataURL={imageData.placeholder}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};