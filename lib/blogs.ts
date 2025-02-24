import fs from 'fs';
import path from 'path';

export type CategoryType = 'history' | 'islands' | 'activities' | 'home' | 'about' | 'hotels';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  content: Array<{
    type: string;
    title: string;
    content?: string;
    items?: Array<{
      title: string;
      content: string;
    }>;
  }>;
}

export const getBlogsByCategory = async (category: string): Promise<BlogPost[]> => {
  const blogsDirectory = path.join(process.cwd(), 'app/blogs/data', category);
  
  try {
    const fileNames = await fs.promises.readdir(blogsDirectory);
    const blogs = await Promise.all(
      fileNames.map(async (fileName) => {
        const filePath = path.join(blogsDirectory, fileName);
        const fileContent = await fs.promises.readFile(filePath, 'utf8');
        return JSON.parse(fileContent) as BlogPost;
      })
    );
    
    return blogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error(`Error reading blog files for category ${category}:`, error);
    return [];
  }
};

export const getBlogBySlug = async (slug: string): Promise<BlogPost | null> => {
  // Search through all category directories to find the blog
  const categories = ['history', 'islands', 'activities', 'home' , 'about', 'hotels'];
  
  for (const category of categories) {
    const blogsDirectory = path.join(process.cwd(), 'app/blogs/data', category);
    try {
      const fileNames = await fs.promises.readdir(blogsDirectory);
      const blogFileName = fileNames.find(name => name.replace('.json', '') === slug);
      
      if (blogFileName) {
        const filePath = path.join(blogsDirectory, blogFileName);
        const fileContent = await fs.promises.readFile(filePath, 'utf8');
        return JSON.parse(fileContent) as BlogPost;
      }
    } catch (error) {
      continue;
    }
  }
  
  return null;
};