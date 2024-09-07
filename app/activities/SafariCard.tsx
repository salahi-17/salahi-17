'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SafariProps {
  safari: {
    title: string;
    price: string;
    image: string;
    description: string;
    imageData: {
      src: string;
      placeholder: string;
    };
  };
}

const SafariCard: React.FC<SafariProps> = ({ safari }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleBookNow = () => {
    router.push(`/itinerary-creator?category=Safaris&activity=${encodeURIComponent(safari.title)}`);
  };

  return (
    <>
      <Card className="flex flex-col md:flex-row overflow-hidden">
        <div className="relative w-full md:w-1/3 h-96 md:h-auto">
          <Image
            src={safari.imageData.src}
            alt={safari.title}
            fill
            style={{ objectFit: "cover" }}
            placeholder="blur"
            blurDataURL={safari.imageData.placeholder}
          />
        </div>
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
          <div className="space-y-2 w-full">
            <Button 
              className="bg-[#e75f40] hover:bg-[#d54e30] text-white w-full"
              onClick={() => setIsOpen(true)}
            >
              VIEW NOW
            </Button>
            <Button 
              className="bg-[#4CAF50] hover:bg-[#45a049] text-white w-full"
              onClick={handleBookNow}
            >
              BOOK NOW
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{safari.title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="relative h-64">
              <Image
                src={safari.imageData.src}
                alt={safari.title}
                fill
                style={{ objectFit: "cover" }}
                placeholder="blur"
                blurDataURL={safari.imageData.placeholder}
              />
            </div>
            <p>{safari.description}</p>
            <p className="font-semibold">Price: £{safari.price} GBP</p>
          </div>
          <Button 
            className="bg-[#4CAF50] hover:bg-[#45a049] text-white w-full"
            onClick={handleBookNow}
          >
            BOOK NOW
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SafariCard;