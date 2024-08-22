// prisma/seed-activities.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const activities = [
    { name: 'The Village Supermarket', category: 'Food & Drink', location: 'Kiwengwa Police Station', description: 'It\'s a supermarket', price: 0, amenities: ['Food', 'Drink', 'Essentials'], image: 'https://example.com/village-supermarket.jpg' },
    { name: 'Kadoo Bureau de Change', category: 'Financial services', location: 'Kiwengwa Police Station', description: 'Currency exchange', price: 0, amenities: ['Currency exchange'], image: 'https://example.com/kadoo-bureau.jpg' },
    { name: 'Mati Saloon', category: 'Hair & Beauty', location: 'Kiwengwa police station', description: 'It\'s a hairdresser shop', price: 0, amenities: ['Hair', 'Manicure', 'Pedicure', 'Facial'], image: 'https://example.com/mati-saloon.jpg' },
    { name: 'MATI', category: 'Culture', location: 'Kiwengwa police station', description: 'It\'s a culture shop', price: 0, amenities: ['Accessories', 'Souvenirs'], image: 'https://example.com/mati-culture.jpg' },
    { name: 'Bareira Activity', category: 'Transportation', location: 'Kiwengwa', description: 'Boat transfer', price: 25000, amenities: ['Boat ride to Bareira Sandbank'], image: 'https://example.com/bareira-activity.jpg' },
    { name: 'Matemwe Boat transfer', category: 'Transportation', location: 'Matemwe', description: 'Boat transfer', price: 80000, amenities: ['Boat ride to Mnemba Island'], image: 'https://example.com/matemwe-boat.jpg' },
    { name: 'PML Lodge & Restaurant', category: 'Accommodation', location: 'Matemwe', description: 'It\'s a restaurant', price: 185000, amenities: ['Breakfast', 'BBQ', 'Seafood', 'Drinks', 'Rooms'], image: 'https://example.com/pml-lodge.jpg' },
    { name: 'Bi Aisha', category: 'Culture', location: 'Matemwe', description: 'It is a stool that sells culture stuff', price: 60000, amenities: ['Clothes', 'Bags'], image: 'https://example.com/bi-aisha.jpg' },
    { name: 'Mora Hotel', category: 'Accommodation', location: 'Matemwe', description: 'It\'s a hotel that offers water excursions', price: 40, amenities: ['Snorkelling'], image: 'https://example.com/mora-hotel.jpg' },
    { name: 'Mora Hotel', category: 'Accommodation', location: 'Matemwe', description: 'It\'s a hotel that offers sand bank cruises', price: 90, amenities: ['Sandbank cruise'], image: 'https://example.com/mora-hotel-sandbank.jpg' },
    { name: 'Kendwa Mini Market', category: 'Food & Drink', location: 'Kendwa rocks', description: 'Supermarket services', price: 0, amenities: ['Supermarket services'], image: 'https://example.com/kendwa-market.jpg' },
    { name: 'Rafiki Mini Market', category: 'Food & Drink', location: 'Kendwa rocks', description: 'Supermarket and Wakala services', price: 0, amenities: ['Supermarket services', 'Wakala services'], image: 'https://example.com/rafiki-market.jpg' },
    { name: 'Natural Kendwa Villa', category: 'Accommodation', location: 'Kendwa rocks', description: 'Lodge and Spa', price: 0, amenities: ['Lodge', 'Spa'], image: 'https://example.com/natural-kendwa.jpg' },
    { name: 'Kendwa Pharmacy', category: 'Dispensary', location: 'Kendwa rocks', description: 'Pharmacy', price: 0, amenities: ['Pharmacy'], image: 'https://example.com/kendwa-pharmacy.jpg' },
    { name: 'ATM Machine', category: 'Finance', location: 'Kendwa rocks', description: 'Cash Withdrawal', price: 0, amenities: ['Cash Withdrawal'], image: 'https://example.com/atm-kendwa.jpg' },
    { name: 'Culture Shop', category: 'Culture', location: 'Kendwa rocks', description: 'Selling cultural clothing and bags', price: 80000, amenities: ['Cultural clothing', 'Bags'], image: 'https://example.com/culture-shop.jpg' },
    { name: 'Z Horse Club', category: 'Land Activity', location: 'Nungwi', description: 'Horse riding and swimming', price: 65, amenities: ['Horse riding', 'Swimming'], image: 'https://example.com/z-horse-club.jpg' },
    { name: 'Zanzbuggy', category: 'Land Activity', location: 'Kiwengwa Police Station', description: 'Buggy Driving', price: 120, amenities: ['Buggy Driving'], image: 'https://example.com/zanzbuggy.jpg' },
    { name: 'Cocobello Club', category: 'Night Club', location: 'Kendwa', description: 'Night Club', price: 10, amenities: ['Night Club'], image: 'https://example.com/cocobello-club.jpg' },
    { name: 'Jet Ski Activity', category: 'Water Activity', location: 'Kendwa rocks', description: 'Jet Ski', price: 100, amenities: ['Jet Ski'], image: 'https://example.com/jet-ski.jpg' },
  ];

  for (const activity of activities) {
    await prisma.activity.create({
      data: {
        ...activity,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    });
  }

  console.log(`Seeded ${activities.length} activities`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });