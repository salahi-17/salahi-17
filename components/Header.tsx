import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { name: "About", link: "/about" },
  { name: "Hotels", link: "/hotels" },
  { name: "Activities", link: "/activities" },
  { name: "Food and Culture", link: "/food-and-culture" },
  { name: "Islands", link: "/islands" },
  { name: "History", link: "/history" },
  { name: "Contact Us", link: "/contact" },
  { name: "Itinerary Creator", link: "/itinerary-creator" }
];


export const Header = () => {
  return (
    <header className="bg-white p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
        Zafiri
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex space-x-4">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link href={item.link} className="text-gray-600 hover:text-gray-900">{item.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

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
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};