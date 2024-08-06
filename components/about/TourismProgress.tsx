export function TourismProgress() {
    return (
        <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-4">Zanzibar's Tourism Progress</h2>
            <p className="text-gray-600 mb-4">
                Explore the remarkable growth of Zanzibar's tourism industry from 2010 to 2024, showcasing key milestones and future projections.
            </p>
            <div className="space-y-4">
                {[
                    { year: '2010-2014', description: 'During this period, Zanzibar saw a 20% increase in tourist arrivals, reaching 200,000 visitors annually by 2014.' },
                    { year: '2015-2019', description: 'Tourism continued to flourish with a 30% growth rate, welcoming over 300,000 tourists each year by 2019.' },
                    { year: '2020-2022', description: "Despite the global pandemic, Zanzibar's tourism industry showed resilience, maintaining a steady influx of 250,000 visitors annually." },
                    { year: '2023-2024', description: 'Projections indicate a significant rebound with an expected 40% increase in tourist arrivals, aiming for 500,000 visitors by 2024.' },
                ].map((item, index) => (
                    <div key={index} className="flex">
                        <div className="w-24 font-semibold">{item.year}</div>
                        <div className="flex-1">{item.description}</div>
                    </div>
                ))}
            </div>
        </div>
        </section>
    )
}