import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { prisma } from '@/lib/prisma';
import BookNowButton from './BookNowButton';
import { getPlaceholderImage } from '@/utils/images';
import Loader from '@/components/Loader';

interface Activity {
    id: string;
    name: string;
    category: string;
    location: string;
    description: string;
    price: number;
    amenities: string[];
    image: string;
    createdAt: Date;
    updatedAt: Date;
}

async function getActivities(category: string, area: string): Promise<Activity[]> {
    const whereClause: any = {
        category: {
            equals: category,
            mode: 'insensitive'
        }
    };

    if (area !== 'undefined') {
        whereClause.location = {
            contains: area,
            mode: 'insensitive'
        };
    }

    return await prisma.activity.findMany({ where: whereClause });
}

function ActivityList({ activities }: { activities: Activity[] }) {
    if (activities.length === 0) {
        return <p className="text-center text-xl mt-8">No activities found for this category and area.</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
                <Card key={activity.id} className="overflow-hidden">
                    <div className="relative h-48">
                        <Image
                            src={activity.image}
                            alt={activity.name}
                            fill
                            style={{ objectFit: "cover" }}
                        />
                    </div>
                    <CardContent className="p-4">
                        <h2 className="font-semibold text-xl mb-2">{activity.name}</h2>
                        <p className="text-sm text-gray-600 mb-2">{activity.location}</p>
                        <p className="mb-4">{activity.description}</p>
                        <p className="font-bold">Price: ${activity.price}</p>
                    </CardContent>
                    <CardFooter>
                        <BookNowButton
                            category={activity.category}
                            activityName={activity.name}
                        />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}

export default async function ActivityDetailPage({ params }: { params: { category: string, area: string } }) {
    const { category, area } = params;
    const decodedCategory = decodeURIComponent(category);
    const decodedArea = decodeURIComponent(area);

    let activities: Activity[] = [];
    let error: Error | null = null;

    try {
        activities = await getActivities(decodedCategory, decodedArea);
    } catch (e) {
        error = e as Error;
    }

    const heroImageData = await getPlaceholderImage("/activities/sight-seeing.jpg");

    return (
        <>
            {/* Hero Section */}
            <div className="relative h-[500px] mb-12">
                <Image
                    src="/activities/sight-seeing.jpg"
                    alt={`${decodedCategory} Activities`}
                    fill
                    style={{ objectFit: "cover" }}
                    placeholder="blur"
                    blurDataURL={heroImageData.placeholder}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
                    <h1 className="text-4xl md:text-7xl font-bold text-center">
                        {decodedCategory} {decodedArea !== 'undefined' ? `in ${decodedArea}` : ''}
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {error ? (
                    <p className="text-center text-xl mt-8 text-red-500">Error loading activities: {error.message}</p>
                ) : (
                    <ActivityList activities={activities} />
                )}
            </div>
        </>
    );
}