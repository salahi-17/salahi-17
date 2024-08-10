import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ToursActivitiesPage = () => {
  const safaris = [
    {
      title: "11 DAYS SAFARI TRIP TANZANIA AND ZANZIBAR",
      price: "2000",
      image: "/activities/keyur-nandaniya.webp",
      description: "• 24/7 service\n• All accommodations\n• Includes: Serengeti, Two days Central Serengeti,\nNgorongoro, six days Zanzibar",
    },
    {
      title: "11 DAYS SAFARI TRIP TANZANIA AND ZANZIBAR",
      price: "2000",
      image: "/activities/elephants.webp",
      description: "• 24/7 service\n• All accommodations\n• Includes: Serengeti, Two days Central Serengeti,\nNgorongoro, six days Zanzibar",
    },
    {
      title: "11 DAYS SAFARI TRIP TANZANIA AND ZANZIBAR",
      price: "2000",
      image: "/activities/lareised-leneseur.webp",
      description: "• 24/7 service\n• All accommodations\n• Includes: Serengeti, Two days Central Serengeti,\nNgorongoro, six days Zanzibar",
    },
  ];

  const activities = [
    { title: "LAND ACTIVITIES | QUAD BIKING", location: "Zanzibar | Jambiani", image: "/activities/Quad-Biking.webp" },
    { title: "LAND ACTIVITIES | YOGA", location: "Zanzibar | Kizimkazi", image: "/activities/Yoga-.webp" },
    { title: "LAND ACTIVITIES | HORSE RIDING", location: "Zanzibar | Kiwengwa Beach", image: "/activities/Horse-Riding.webp" },
    { title: "WATER ACTIVITIES | JET SKI", location: "Zanzibar | Paje Beach", image: "/activities/Jet-Ski.webp" },
    { title: "WATER ACTIVITIES | KAYAKING", location: "Zanzibar | Nungwi Beach", image: "/activities/Kayak.webp" },
    { title: "LAND ACTIVITIES | CAMEL RIDING", location: "Zanzibar | Kiwengwa", image: "/activities/Camel-Riding.webp" },
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[600px] mb-12">
        <img src="/activities/sight-seeing.jpg" alt="Tours and Activities" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
          <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl md:text-7xl font-bold text-white text-center">
            TOURS AND ACTIVITIES
          </h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Tours and Safaris</h2>
        <div className="space-y-6">
          {safaris.map((safari, index) => (
            <Card key={index} className="flex flex-col md:flex-row overflow-hidden">
              <img src={safari.image} alt={safari.title} className="w-full md:w-1/3 object-cover" />
              <CardContent className="flex-1 bg-[#f8d7ce] p-6">
                <h3 className="text-xl font-semibold mb-2">{safari.title}</h3>
                <p className="whitespace-pre-line">{safari.description}</p>
              </CardContent>
              <CardFooter className="bg-[#f8d7ce] p-6 flex flex-col justify-between items-end">
                <div className="text-right mb-4">
                  <p className="text-sm">FROM</p>
                  <p className="text-2xl font-bold">£{safari.price}</p>
                  <p className="text-sm">GBP</p>
                </div>
                <Button className="bg-[#e75f40] hover:bg-[#d54e30] text-white">VIEW NOW</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <h2 className="text-3xl font-bold my-8">Activities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, index) => (
            <Card key={index} className="overflow-hidden">
              <img src={activity.image} alt={activity.title} className="w-full h-48 object-cover" />
              <CardContent className="p-4">
                <h3 className="font-semibold">{activity.title}</h3>
                <p className="text-sm text-gray-600">{activity.location}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default ToursActivitiesPage;