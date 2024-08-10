import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Leaf, Users, ClipboardCheck, LucideIcon } from 'lucide-react';

interface CoreValue {
  title: string;
  description: string;
}

type IconMapType = {
  [key: string]: LucideIcon;
};

const IconMap: IconMapType = {
  'Social Responsibility': Briefcase,
  'Sustainability': Leaf,
  'Trust & Integrity': Users,
  'Quality Assurance': ClipboardCheck,
};

export function ExcellenceSection(): JSX.Element {
    const values: CoreValue[] = [
        { title: 'Social Responsibility', description: 'Empowering local communities through sustainable tourism.' },
        { title: 'Sustainability', description: "Promoting eco-friendly practices to preserve Zanzibar's natural beauty." },
        { title: 'Trust & Integrity', description: 'Building lasting relationships with our clients and partners.' },
        { title: 'Quality Assurance', description: 'Delivering exceptional experiences and services to our guests.' },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <p className="text-sm uppercase text-primary mb-2">OUR CORE VALUES</p>
                    <h2 className="text-4xl font-bold mb-4">Zafiri's Commitment to Excellence</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        At Zafiri, we are dedicated to upholding the highest standards in all that we do. Our values guide us in
                        delivering exceptional service and fostering a positive impact on society and the environment.
                    </p>
                </div>
                <Card className="bg-[#E5C1B5]">
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((item, index) => {
                                const Icon: LucideIcon = IconMap[item.title];
                                return (
                                    <div key={index} className="flex flex-col items-center text-center">
                                        <Icon className="w-12 h-12 text-white mb-4" />
                                        <h3 className="font-semibold text-xl mb-2 text-white">{item.title}</h3>
                                        <p className="text-sm text-white">{item.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}