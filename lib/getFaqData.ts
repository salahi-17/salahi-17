import fs from 'fs';
import path from 'path';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface FAQPage {
  pageTitle: string;
  pageDescription: string;
  faqs: FAQ[];
}

export const getFaqsByCategory = async (category: string): Promise<FAQPage | null> => {
  const faqPath = path.join(process.cwd(), 'app/faqs/data', category, `${category}-faqs.json`);
  
  try {
    if (!fs.existsSync(faqPath)) return null;
    const fileContent = await fs.promises.readFile(faqPath, 'utf8');
    return JSON.parse(fileContent) as FAQPage;
  } catch (error) {
    console.error(`Error reading FAQ file for category ${category}:`, error);
    return null;
  }
};