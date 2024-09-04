import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';
import { getPlaceholderImage } from '@/utils/images';
import { aclonica } from '@/utils/aclonica';

const ZanzibarCuisinePage = async () => {
  const foodCategories = [
    {
      title: "MAIN MEALS",
      items: [
        { name: "Urojo soup (Zanzibar mix)", description: "A tangy, creamy and spicy soup also known as Zanzibar Mix, is a popular street food. This specialty combines potatoes in curry soup, crispy bhajias, boiled eggs, kachori (fried chickpea balls), and garnished with cassava flakes and chutney.", image: "/" },
        { name: "Ndizi ya nyama", description: "Do you have meat and bananas on hand? If so, you're all set to make ndizi na nyama - a flavorful stew combining both ingredients.  Using unripe plantains adds a tender and delicious element to this unique stew..", image: "/food-and-culture/Ndizi-ya-nyama.webp" },
        { name: "Pilau", description: "A traditional rice dish of Zanzibar, thanks to its Swahili and Arab history. Pilau is cooked with flavored spices, vegetables, and meat, giving it its characteristic brown color. The blend of flavors, including cardamom, cinnamon, and cloves, creates a unique aroma that perfectly complements the tender meat, presenting a delicate and fragrant experience.", image: "/food-and-culture/Pilau.webp" },
        { name: "Mishkaki", description: "Mishkaki stands out as a renowned BBQ meat delicacy in East Africa. This dish involves marinating small meat pieces, skewering them, and grilling until they reach a tender texture. Mishkaki comes in various forms, including Cow meat (Mishaki ya nyama), Chicken meat (Mishkaki ya Kuku), and Goat (Mishkaki ya mbuzi)", image: "/food-and-culture/Mishkaki.webp" },
        { name: "Zanzibar Pizza", description: "A beloved street food of the archipelago. Unlike traditional Italian pizza, Zanzibar pizza is more like a stuffed pancake or folded crepe. It features a thin dough filled with a variety of ingredients such as meat, vegetables, cheese, and even chocolate for sweet versions, then folded and cooked on a griddle until crispy.", image: "/food-and-culture/Zanzibar-Pizza.webp" },
        { name: "Ugali", description: "Ugali, a staple in East African and Tanzanian is a dense, starchy side dish made from maize flour (cornmeal). It's cooked by gradually adding the flour to boiling water and stirring until it forms a thick, smooth paste. Ugali is typically served with meat or vegetable stews and eaten by hand, often used to scoop up the accompanying dishes.", image: "/food-and-culture/Ugali.webp" }
      ]
    },
    {
      title: "DESSERT",
      items: [
        { name: "Vipopoo", description: "In Zanzibar, the dish known as Vipopoo or Vitobwesha, crafted from cassava flour, is a local favorite, particularly during Ramadan. These special little dumplings in sweet spiced coconut milk consists of a yummy, gooey interface where the apples meet the pastry in apple pies.", image: "/food-and-culture/Vipopoo.webp" },
        { name: "Ndizi mbeechi", description: "Ndizi Mbeechi, a banana pudding variant from Zanzibar, gets its name from the Swahili term for overripe bananas. However, these aren't just any bananas; they're delectably sweet plantains.", image: "/food-and-culture/Ndizi-mbeechi.webp" },
        { name: "Spice cake", description: "As Zanzibar is known as the 'Spice Island,' it's no surprise that spices make their way into desserts too. Spice cake is a moist, flavorful cake infused with a blend of aromatic spices like cinnamon, cloves, and nutmeg. This cake is particularly beloved for its embodiment of Zanzibar's spice heritage and rich flavors.", image: "/food-and-culture/Spice-cake.webp" }
      ]
    },
    {
      title: "PASTRIES",
      items: [
        { name: "Maandazi", description: "Maandazi (or Mandazi) emerges as a delicate, airy, and immensely delectable African bread, securing its position at the apex of culinary delights. Renowned as one of Kenya's ubiquitous sweet treats, it often draws comparisons to the esteemed doughnut.", image: "/food-and-culture/Maandazi.webp" },
        { name: "Kaimati", description: "Kaimati stands as an iconic delicacy along the East African coast, particularly cherished in locales like Mombasa and Zanzibar. This delectable snack is crafted from a blend of plain flour, baking powder, water, and yeast, forming small balls that are fried to perfection.", image: "/food-and-culture/Kaimati.webp" },
        { name: "Vitumbua", description: "Vitumbua (with the singular form being kitumbua) is a delightful confection resembling a doughnut or pancake, characterized by a gently crisped exterior and an irresistibly soft, fluffy centre that seems to dissolve on the tongue.", image: "/food-and-culture/Vitumbuwa.webp" }
      ]
    },
    {
      title: "DRINKS",
      items: [
        { name: "Juice ya miwa", description: " This beverage is not only delicious and refreshing, but it also offers significant health benefits. It acts as a hydrating agent, replenishing the body with energy, carbohydrates, and protein. ", image: "/food-and-culture/Juice-ya-miwa.webp" },
        { name: "Juice ya ukwaju", description: "In Kiswahili, tamarind is known as `ukwaju` and it's a popular ingredient in Zanzibar. Tamarind can be used in a variety of dishes, but is primarily known as a primary ingredient in tamarind juice.", image: "/food-and-culture/Juice-ya-ukwaju.webp" },
        { name: "Juice ya tende", description: "Discovering this delightful smoothie is a rewarding quest; it's a uniquely flavored date fruit blend with a sweet twist. This concoction is the perfect energizing drink for summer!", image: "/food-and-culture/Juice-ya-tende.webp" }
      ]
    }
  ];
const heroImageData = await getPlaceholderImage("/food-and-culture/food-and-culture-zanzibar.png");

  const categoriesWithPlaceholders = await Promise.all(
    foodCategories.map(async (category) => ({
      ...category,
      items: await Promise.all(
        category.items.map(async (item) => ({
          ...item,
          imageData: await getPlaceholderImage(item.image),
        }))
      ),
    }))
  );

  return (
    <>
      <div className="relative h-[500px] mb-12">
        <Image
          src="/food-and-culture/food-and-culture-zanzibar.png"
          alt="Zanzibar cuisine"
          fill
          style={{ objectFit: "cover" }}
          placeholder="blur"
          blurDataURL={heroImageData.placeholder}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
          <h1 className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl md:text-7xl font-bold text-white text-center drop-shadow-lg ${aclonica.className}`}>
            Zanzibar cuisine
          </h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {categoriesWithPlaceholders.map((category, index) => (
          <div key={index} className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">{category.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item, itemIndex) => (
                <Card key={itemIndex} className="flex flex-col">
                  <AspectRatio ratio={4 / 3}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-xl"
                      placeholder="blur"
                      blurDataURL={item.imageData.placeholder}
                    />
                  </AspectRatio>
                  <CardContent className="flex-grow">
                    <h3 className="font-semibold my-2">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Cook now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ZanzibarCuisinePage;