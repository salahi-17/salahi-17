import React from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'

const navItems = [
  { name: "About", link: "/about" },
  { name: "Hotels", link: "/hotels" },
  { name: "Activities", link: "/activities" },
  { name: "Food and Culture", link: "/food-and-culture" },
  { name: "Islands", link: "/islands" },
  { name: "History", link: "/history" },
  { name: "Contact Us", link: "/contact" },
];

export const Header = async () => {
  const session = await getServerSession(authOptions);
  const isNotAuthenticated = !session;
  return (
    <header className="p-4 shadow-sm text-primary">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          <div className="relative w-[100px] h-[100px]">
            <Image
              src="/ZAFIRI_Stacked-Logo-RGB.webp"
              alt="Zafiri"
              layout="fill"
              objectFit="contain"
              className="[filter:brightness(0)_saturate(100%)_invert(85%)_sepia(11%)_saturate(1004%)_hue-rotate(325deg)_brightness(99%)_contrast(92%)]"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center">
          <ul className="flex space-x-4">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link href={item.link}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className='hidden lg:flex space-x-4'>
          <Link href={"/itinerary-creator"}>
            <Button >
              Itinerary Creator
            </Button>
          </Link>

          {isNotAuthenticated ? (<Link href={"/auth/signin?callbackUrl=/"}>
            <Button variant={"outline"} className='border-primary'>
              Sign In
            </Button>
          </Link>) : (
            <Link href={"/profile"}>
              <Button variant={"outline"} className='border-primary'>
                Profile
              </Button>
            </Link>)}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <nav className="flex flex-col space-y-4 mt-8">
              {navItems.map((item, index) => (
                <Link key={index} href={item.link} className="text-gray-600 hover:text-gray-900">{item.name}</Link>
              ))}
            </nav>
            <div className='flex flex-col pt-4 space-y-4'>
              <Button >
                <Link href={"/itinerary-creator"}>
                  Itinerary Creator
                </Link>
              </Button>
              <Button variant={"outline"} className='border-primary'>
                {isNotAuthenticated ? (<Link href={"/auth/signin?callbackUrl=/"}>
                  Sign In
                </Link>) : (
                  <Link href={"/profile"}>Profile</Link>)}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};