import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPlaceholderImage } from '@/utils/images';
import { aclonica } from '@/utils/aclonica';
import { Metadata } from 'next';
import { getBlogBySlug } from '@/lib/blogs';

// Define types for different content sections
interface BaseSection {
  type: string;
  title?: string;
  content?: string;
}

interface TextSection extends BaseSection {
  type: 'introduction' | 'section' | 'conclusion';
  items?: Array<{
    title: string;
    content: string;
  }>;
  subsections?: Array<{
    title: string;
    content: string;
  }>;
}

interface ImageSection extends BaseSection {
  type: 'image';
  src: string;
  alt?: string;
  caption?: string;
  imageData?: any;
}

interface TipSection extends BaseSection {
  type: 'tip';
}

interface SubsectionSection extends BaseSection {
  type: 'subsection';
  items?: Array<{
    title: string;
    content: string;
  }>;
}

type ContentSection = TextSection | ImageSection | TipSection | SubsectionSection | BaseSection;

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  content: ContentSection[];
}

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
  const post = await getBlogBySlug(params.slug) as unknown as BlogPost;
  if (!post) return null;

  const heroImageData = await getPlaceholderImage(post.image);

  // Get image placeholders for all images in the content
  const contentWithImageData = await Promise.all(
    post.content.map(async (section: any) => {
      if (section.type === 'image') {
        const imageSection = section as ImageSection;
        if (imageSection.src) {
          const imageData = await getPlaceholderImage(imageSection.src);
          return { ...imageSection, imageData };
        }
      }
      return section;
    })
  );

  // Get the back link and title based on category
  const getCategoryDetails = (category: string) => {
    const details: any = {
      history: { path: '/history', title: 'History' },
      islands: { path: '/islands', title: 'Islands' },
      about: { path: '/about', title: 'About' },
      hotels: { path: '/hotels', title: 'Hotels' },
      activities: { path: '/activities', title: 'Activities' }
    };
    return details[category] || { path: '/', title: 'Home' };
  };

  const categoryDetails = getCategoryDetails(post.category);

  // Helper function to render different section types
  const renderSection = (section: ContentSection, index: number) => {
    switch (section.type) {
      case 'introduction':
        const introSection = section as TextSection;
        return (
          <div key={index} className="mb-8">
            {introSection.title && (
              <h2 className="text-2xl font-bold mb-4 text-primary">{introSection.title}</h2>
            )}
            {introSection.content && (
              <p className="text-gray-700 mb-4 text-lg">{introSection.content}</p>
            )}
          </div>
        );

      case 'image':
        const imageSection = section as ImageSection;
        return (
          <div key={index} className="mb-8">
            <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
              <Image
                src={imageSection.src}
                alt={imageSection.alt || "Blog image"}
                fill
                style={{ objectFit: 'cover' }}
                placeholder="blur"
                blurDataURL={imageSection.imageData?.placeholder}
                className="rounded-lg"
              />
            </div>
            {imageSection.caption && (
              <p className="text-sm text-gray-500 mt-2 text-center italic">{imageSection.caption}</p>
            )}
          </div>
        );

      case 'tip':
        const tipSection = section as TipSection;
        return (
          <div key={index} className="mb-8 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-gray-700">{tipSection.content}</p>
          </div>
        );

      case 'conclusion':
        const conclusionSection = section as TextSection;
        return (
          <div key={index} className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-primary">Conclusion</h2>
            <p className="text-gray-700">{conclusionSection.content}</p>
          </div>
        );

      case 'section':
        const textSection = section as TextSection;
        return (
          <div key={index} className="mb-8">
            {textSection.title && (
              <h2 className="text-2xl font-bold mb-4 text-primary">{textSection.title}</h2>
            )}
            {textSection.content && (
              <p className="text-gray-700 mb-4">{textSection.content}</p>
            )}
            {textSection.items && (
              <div className="space-y-4 mt-4">
                {textSection.items.map((item, i) => (
                  <div key={i} className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-700">{item.content}</p>
                  </div>
                ))}
              </div>
            )}
            {textSection.subsections && (
              <div className="space-y-6 mt-6">
                {textSection.subsections.map((subsection, i) => (
                  <div key={i} className="mb-4 border-l-4 border-gray-200 pl-4">
                    <h3 className="text-xl font-semibold mb-2">{subsection.title}</h3>
                    <p className="text-gray-700">{subsection.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'subsection':
        const subsectionSection = section as SubsectionSection;
        return (
          <div key={index} className="mb-8 ml-4 border-l-4 border-gray-200 pl-4">
            {subsectionSection.title && (
              <h3 className="text-xl font-semibold mb-2">{subsectionSection.title}</h3>
            )}
            {subsectionSection.content && (
              <p className="text-gray-700 mb-4">{subsectionSection.content}</p>
            )}
            {subsectionSection.items && (
              <div className="space-y-4">
                {subsectionSection.items.map((item, i) => (
                  <div key={i} className="mb-4">
                    <h4 className="text-lg font-medium mb-1">{item.title}</h4>
                    <p className="text-gray-700">{item.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div key={index} className="mb-8">
            {section.title && (
              <h2 className="text-2xl font-bold mb-4 text-primary">{section.title}</h2>
            )}
            {section.content && (
              <p className="text-gray-700 mb-4">{section.content}</p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[400px]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          style={{ objectFit: 'cover' }}
          placeholder="blur"
          blurDataURL={heroImageData.placeholder}
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
            {contentWithImageData.map((section: any, index) => renderSection(section as ContentSection, index))}
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