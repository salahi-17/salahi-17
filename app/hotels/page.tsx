import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const HotelsPage = () => {
  const hotels = [
    { name: "Park Hyatt", location: "Zanzibar | Stone Town", image: "/hotels/Park-Hyatt.webp" },
    { name: "Serena", location: "Zanzibar | Stone Town", image: "/hotels/Serena-.webp" },
    { name: "Golden Tulip", location: "Zanzibar | Stone Town", image: "/hotels/Golden-Tulip.webp" },
    { name: "Tembo Hotel", location: "Zanzibar | Stone Town", image: "/hotels/Tembo-Hotel.webp" },
    { name: "Hotel Verde", location: "Zanzibar | Stone Town", image: "/hotels/Verde-2.webp" },
    { name: "Zuri Hotel", location: "Zanzibar | Nungwi", image: "/hotels/Zuri-Hotel.webp" },
    { name: "Ycona Luxury Resort", location: "Zanzibar | Nungwi", image: "/hotels/Ycona-Luxury-Resort.webp" },
    { name: "THE ISLAND PONGWE", location: "Zanzibar | Pongwe", image: "/hotels/THE-ISLAND-PONGWE.webp" },
    { name: "Bububu Bungalow", location: "Zanzibar | Bububu", image: "/hotels/Babalao-Bungalos.webp" },
  ];

  const amenities = [
    {name: "Hot Tub", image: "/hotels/hot-tub.webp"},
    { name: "Apartments", image: "/hotels/apartments.webp"},
    { name: "Pool", image: "/hotels/pool.webp" },
    { name: "Spa", image: "/hotels/spa.webp" },
    { name: "Sea View", image: "/hotels/sea-view.webp" },
    { name: "Family Friendly", image: "/hotels/family-friendly.webp" },
  ];

  const testimonials = [
    { text: "Zafiri made our Zanzibar trip unforgettable! The recommendations were spot on, and the service was impeccable.", author: "Sarah Johnson" },
    { text: "Booking through Zafiri was the best decision we made for our honeymoon. Every detail was perfect!", author: "James & Emily" },
    { text: "From the moment we landed to our departure, Zafiri ensured a seamless and luxurious experience. Highly recommended!", author: "Michael Brown" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative h-72 mb-12 rounded-lg overflow-hidden">
        <img src="/hotels/hotels-hero.png" alt="Hotels in Zanzibar" className="w-full h-full object-cover" />
        <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-white text-center">
          Hotels
        </h1>
      </div>

      {/* Hotels Section */}
      <h2 className="text-3xl font-bold mb-6">Hotels</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {hotels.map((hotel, index) => (
          <Card key={index} className="overflow-hidden">
            <img src={hotel.image} alt={hotel.name} className="w-full h-48 object-cover" />
            <CardContent className="p-4">
              <h3 className="font-semibold">{hotel.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{hotel.location}</p>
              <Button variant="outline" className="text-[#4cc9f0] border-[#4cc9f0] hover:bg-[#4cc9f0] hover:text-white">
                View more
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* What are you looking for? Section */}
      <h2 className="text-3xl font-bold mb-6">What are you looking for?</h2>
      <Carousel className="mb-12">
        <CarouselContent>
          {amenities.map((amenity, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
              <div className="relative h-48 rounded-lg overflow-hidden">
                <img src={amenity.image} alt={amenity.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <span className="text-white text-xl font-semibold">{amenity.name}</span>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* Testimonials Section */}
      <div className="bg-[#4cc9f0] py-12 px-4 rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-white text-center">Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white bg-opacity-20 p-6 rounded-lg">
              <p className="text-white mb-4">{testimonial.text}</p>
              <p className="text-white font-semibold">{testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;