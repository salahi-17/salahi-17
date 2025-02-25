import type { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

// Function to recursively get all blog files
async function getAllBlogPaths() {
  const blogCategories = ['islands', 'activities', 'hotels', 'history', 'about', 'food'];
  let blogPaths: string[] = [];
  
  try {
    for (const category of blogCategories) {
      const categoryDir = path.join(process.cwd(), 'app/blogs/data', category);
      
      // Skip if directory doesn't exist
      if (!fs.existsSync(categoryDir)) continue;
      
      const files = fs.readdirSync(categoryDir);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          // Extract the blog ID (filename without extension)
          const blogId = file.replace(/\.json$/, '');
          blogPaths.push(`/blogs/${blogId}`);
        }
      }
    }
  } catch (error) {
    console.error('Error reading blog files:', error);
  }
  
  return blogPaths;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URLs
  const baseUrls: MetadataRoute.Sitemap = [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/hotels`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/activities`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/food-and-culture`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/islands`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/history`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/itinerary-creator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
  
  // Get all blog paths
  const blogPaths = await getAllBlogPaths();
  
  // Create sitemap entries for blogs
  const blogUrls: MetadataRoute.Sitemap = blogPaths.map(blogPath => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}${blogPath}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
  
  // Add island detail pages
  const islands = ['unguja', 'pemba', 'mnemba', 'changuu'];
  const islandUrls: MetadataRoute.Sitemap = islands.map(island => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/islands/${island}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  
  // Combine all URLs
  return [...baseUrls, ...blogUrls, ...islandUrls];
}