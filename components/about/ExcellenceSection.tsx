import {Card, CardContent} from "@/components/ui/card"

export function ExcellenceSection() {
    return (
        <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-4">Zafiri's Commitment to Excellence</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: 'Social Responsibility', description: 'Supporting local communities through sustainable tourism' },
                    { title: 'Sustainability', description: "Implementing eco-friendly practices to preserve Zanzibar's natural beauty" },
                    { title: 'Trust & Integrity', description: 'Building lasting partnerships with tour operators and partners' },
                    { title: 'Quality Assurance', description: 'Delivering exceptional experiences and services to our guests' },
                ].map((item, index) => (
                    <Card key={index}>
                        <CardContent className="p-4">
                            <h3 className="font-semibold mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-600">{item.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
        </section>
    )
}