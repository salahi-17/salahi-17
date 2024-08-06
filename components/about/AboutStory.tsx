import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function AboutStory() {
    return (
        <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
        <Card className="mb-8">
            <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                    <Image src="/path-to-zafiri-logo.png" alt="Zafiri Logo" width={50} height={50} />
                </div>
                <h2 className="text-2xl font-semibold text-center mb-4">The Zafiri Story</h2>
                <p className="text-gray-600 text-center">
                    After the early years of their lives they moved to the UK to pursue further education and obtained degrees across various industries. Even during this time they often travelled back to Zanzibar always drawn back to the cultural richness of the place they call home...
                </p>
                {/* Add more paragraphs as needed */}
            </CardContent>
        </Card>
        </div>
        </section>
    )
}

