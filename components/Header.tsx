import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from 'lucide-react';

const navItems = [
  "About",
  "Hotels",
  "Activities",
  "Food and Culture",
  "Islands",
  "History",
  "Contact Us",
  "Itinerary Creator",
  "Itinerary Interface"
];

export const Header = () => {
  return (
    <header className="bg-white p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-pink-500">Zafiri</div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex space-x-4">
            {navItems.map((item, index) => (
              <li key={index}>
                <Button variant="ghost">{item}</Button>
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
                <Button key={index} variant="ghost">{item}</Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};