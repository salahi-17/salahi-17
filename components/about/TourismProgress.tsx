import React from 'react';

export function TourismProgress() {
    const timelineEvents = [
        {
            period: "2010-2014",
            year: "2014",
            description: "During this period, Zanzibar saw a 20% increase in tourist arrivals, reaching 200,000 visitors annually by 2014."
        },
        {
            period: "2015-2019",
            year: "2019",
            description: "Tourism continued to flourish with a 30% growth rate, welcoming over 300,000 tourists each year by 2019."
        },
        {
            period: "2020-2022",
            year: "2022",
            description: "Despite the global pandemic, Zanzibar's tourism industry showed resilience, maintaining a steady influx of 250,000 visitors annually."
        },
        {
            period: "2023-2024",
            year: "2024",
            description: "Projections indicate a significant rebound with an expected 40% increase in tourist arrivals, aiming for 500,000 visitors by 2024."
        }
    ];

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-4 text-center">Zanzibar's Tourism Progress</h2>
                <p className="text-center text-gray-600 mb-12">
                    Explore the remarkable growth of Zanzibar's tourism industry from 2010 to 2024, showcasing key milestones and future projections.
                </p>
                <div className="relative">
                    {timelineEvents.map((event, index) => (
                        <div key={index} className="mb-12 flex">
                            <div className="w-1/4 pr-8 text-right">
                                <h3 className="font-bold text-xl">{event.period}</h3>
                                <span className="text-gray-500">{event.year}</span>
                            </div>
                            <div className="w-3/4 pl-8 border-l-2 border-gray-300 relative">
                                <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-1.5"></div>
                                <p className="text-gray-700">{event.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}