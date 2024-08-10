import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function AboutStory() {
    return (
        <section className="py-8 md:py-16">
            <div className="container mx-auto px-4">
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-center mb-4">
                            <Image src="/ZAFIRI_Z-Mark-RGB.webp" alt="Zafiri Logo" width={100} height={100} />
                        </div>
                        <h2 className="text-2xl font-semibold text-center mb-4">The Zafiri Story</h2>
                        <div className="gap-4">
                            <p className="text-gray-600 text-center">
                                After the early years of their lives they moved to the UK to pursue further education and obtained degrees across various industries. Even during this time they often travelled back to Zanzibar always drawn back to the cultural vibrance of the place they called home.
                            </p>
                            <p className="text-gray-600 text-center">
                                Zafiri came about as our way to share with the world this beautiful holiday destination. We heard from many people that they wanted to travel to Zanzibar but they didn't know how to approach it, Zafiri is the answer to that query.
                            </p>
                            <p className="text-gray-600 text-center">
                                We wanted to create a way for people to experience everything that Zanzibar has to offer and as locals ourselves, provide an exclusive experience of this Marvel of an island.
                            </p>
                            <p className="text-gray-600 text-center">
                                Our Target is to provide a unique and remarkable holiday in a sustainable manner that also boosts local opportunities.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}

