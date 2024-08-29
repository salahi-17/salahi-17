import React from 'react';
import Image from 'next/image';
import { getPlaceholderImage } from '@/utils/images';

export async function AboutHero() {
    const imageWithPlaceholder = await getPlaceholderImage("/about-us-zafiri-hero.jpg");

    return (
        <section className="relative h-[600px] w-full overflow-hidden">
            <Image
                src={imageWithPlaceholder.src}
                alt="Beautiful Zanzibar beach"
                fill
                style={{ objectFit: "cover" }}
                quality={100}
                placeholder="blur"
                blurDataURL={imageWithPlaceholder.placeholder}
                priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
                <h1 className="text-4xl md:text-7xl font-bold text-white text-center">
                    About us
                </h1>
            </div>
        </section>
    );
}