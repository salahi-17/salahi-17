import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import type { BlogPost, CategoryType } from '@/lib/blogs';

interface BlogSectionProps {
  blogs: BlogPost[];
  title: string;
  category: CategoryType;
  className?: string;
}

const BlogSection = ({ blogs, title, category, className = '' }: BlogSectionProps) => {
  if (blogs.length === 0) return null;

  return (
    <div className={`py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link key={blog.id} href={`/blogs/${blog.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-t-lg"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">{blog.date}</p>
                    <h3 className="text-xl font-semibold mb-2 text-primary hover:text-primary/80">
                      {blog.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 line-clamp-3">{blog.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;