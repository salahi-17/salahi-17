import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const IslandsPage = () => {
  const islands = [
    {
      name: "Unguja",
      description: "Unguja is often reffered to as the best island in Zanzibar. It is the home of stone town and the amazing Jozani Forest, where you can see the rare red colobus monkey. It is full of beautiful beaches like Kendwa and Paje.",
      image: "/islands/Unguja.webp"
    },
    {
      name: "Pemba",
      description: "Pemba is a hidden masterpiece littered with mangroves, hidden beaches, lagoons and tidal sandbanks. Pemba has many luxury hotels and resorts, and it's less touristy than Unguja. It can be accessed by local ferry or flights.",
      image: "/islands/Pemba.webp"
    },
    {
      name: "Mnemba",
      description: "Mnemba Island is a beautiful private island surrounded by coral reef that hosts a wide range of marine life. Located on the Northeast coast of Unguja, it only has one resort on the entire island offering a luxurious and exclusive getaway.",
      image: "/islands/Mnemba.webp"
    },
    {
      name: "Changuu",
      description: "Changuu Island or more famously known as Prison Island is a tropical paradise off the coast of Stone Town. Prison Island contains an abundance of great scenery including the beautiful beach and amazing wildlife.",
      image: "/islands/Prison-Island.webp"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[600px] mb-12">
        <img src="/islands/islands-hero.jpg" alt="Zanzibar Islands" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-7xl font-bold mb-4">Islands</h1>
          <p className="text-center max-w-2xl mb-6">
            Zanzibar is an archipelago consisting of 50 beautiful islands. The two main islands, also the two largest, are Unguja Island and Pemba.
          </p>
          <Button variant="outline" className="border-white text-black">
            Where to visit
          </Button>
        </div>
      </div>

      {/* Islands Section */}
      <div className="container mx-auto px-4 py-8">
        {islands.map((island, index) => (
          <Card key={index} className="mb-8 overflow-hidden bg-white">
            <div className="flex flex-col md:flex-row">
              {index % 2 === 0 ? (
                <>
                  <img src={island.image} alt={island.name} className="w-full md:w-1/2 h-64 md:h-auto object-cover" />
                  <CardContent className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                  <h2 className="text-2xl font-bold mb-4 text-primary">{island.name}</h2>
                    <p className="mb-4">{island.description}</p>
                    <Button variant="default" className="self-start text-white">
                      Explore more
                    </Button>
                  </CardContent>
                </>
              ) : (
                <>
                  <CardContent className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold mb-4 text-primary">{island.name}</h2>
                    <p className="mb-4">{island.description}</p>
                    <Button variant="default" className="self-start text-white">
                      Explore more
                    </Button>
                  </CardContent>
                  <img src={island.image} alt={island.name} className="w-full md:w-1/2 h-64 md:h-auto object-cover" />
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom Hero Section */}
      <div className="relative h-[400px]">
        <img src="/islands/zafiri-island.png" alt="Zanzibar Islands" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Islands</h2>
          <p className="text-center max-w-2xl mb-6">
            Zanzibar is an archipelago consisting of 50 beautiful islands, the two main islands, also the two largest, are Unguja Island and Pemba
          </p>
          <div className="space-x-4">
            <Button variant="outline" className="self-start rounded-none border-2 text-white border-white bg-transparent hover:text-white hover:bg-transparent">
              Where to visit
            </Button>
            <Button variant="outline" className="self-start rounded-none border-2 text-white border-white bg-transparent hover:text-white hover:bg-transparent">
              All places
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IslandsPage;