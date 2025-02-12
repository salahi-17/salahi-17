import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPlaceholderImage } from '@/utils/images';
import { aclonica } from '@/utils/aclonica';
import { Metadata } from 'next';
import { getBlogBySlug } from '@/lib/blogs';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getBlogBySlug(params.slug);
  if (!post) return { title: 'Blog Post Not Found' };
  
  return {
    title: post.title,
    description: post.excerpt,
  };
}

const BlogPost = async ({ params }: PageProps) => {
  const post = await getBlogBySlug(params.slug);
  if (!post) return null;

  const imageData = await getPlaceholderImage(post.image);

  // Get the back link and title based on category
  const getCategoryDetails = (category: string) => {
    const details: any = {
      history: { path: '/history', title: 'History' },
      islands: { path: '/islands', title: 'Islands' },
      activities: { path: '/activities', title: 'Activities' }
    };
    return details[category] || { path: '/', title: 'Home' };
  };

  const categoryDetails = getCategoryDetails(post.category);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[400px]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          style={{ objectFit: 'cover' }}
          placeholder="blur"
          blurDataURL={imageData.placeholder}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${aclonica.className}`}>
              {post.title}
            </h1>
            <p className="text-lg">{post.date}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            {post.content.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-primary">{section.title}</h2>
                
                {section.content && (
                  <p className="text-gray-700 mb-4">{section.content}</p>
                )}
                
                {section.items && (
                  <div className="space-y-4">
                    {section.items.map((item, i) => (
                      <div key={i} className="mb-4">
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-gray-700">{item.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link href={categoryDetails.path}>
            <Button variant="outline">
              Back to {categoryDetails.title}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;