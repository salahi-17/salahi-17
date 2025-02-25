"use client";

import React, { useState } from 'react';
import { FAQ } from '@/lib/getFaqData';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FaqSectionProps {
  faqs: FAQ[];
  title?: string;
}

const FaqSection: React.FC<FaqSectionProps> = ({ faqs, title = "Frequently Asked Questions" }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card key={faq.id} className="border-0 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <button
                  className={`flex justify-between items-center w-full p-4 text-left ${openIndex === index ? 'bg-primary text-white' : 'bg-white'}`}
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openIndex === index}
                >
                  <span className="font-medium">{faq.question}</span>
                  {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 p-4' : 'max-h-0'}`}
                >
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqSection;