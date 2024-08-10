import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import { FaTiktok, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-white py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <Image src="/zafiri-group-footer.webp" alt="Zafiri Group" width={150} height={50} />
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="font-semibold mb-2">Discover Zafiri</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>
                <Link href="/islands">
                  Islands
                </Link>
              </li>
              <li>
                <Link href="/activities">
                  Activities
                </Link>
              </li>
              <li>
                <Link href="/hotels">
                  Hotels
                </Link>
              </li>
              <li>
                <Link href="/food-and-culture">
                  Food and drinks
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="font-semibold mb-2">Contact us</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>📧 contact@zafiri.uk</li>
              <li>🇬🇧 +44 7436 790393</li>
              <li>🇹🇿 +255 7470 55776</li>
            </ul>
          </div>
          <div className="w-full md:w-1/4">
            <h4 className="font-semibold mb-2">Don't miss out</h4>
            <p className="text-sm text-gray-600 mb-2">Subscribe for latest events, travel tips, personalized itineraries and more.</p>
            <form className="space-y-2">
              <Input type="text" placeholder="First Name" className="bg-white" />
              <Input type="text" placeholder="Last Name" className="bg-white" />
              <Input type="email" placeholder="Email" className="bg-white" />
              <Button variant="outline" className="w-full bg-[#E5C1B5] text-white hover:bg-[#d8a795]">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-xs text-gray-500">
          <div className="mb-4 space-x-4">
            <span>BOOKING TERMS & CONDITIONS</span>
            <span>PRIVACY POLICY</span>
            <span>DISCLAIMER</span>
          </div>
          <div className="flex justify-center space-x-4 mb-4">
            <div className="flex justify-center mt-8 space-x-4">
              <Button variant="outline" size={"icon"} className="rounded-full w-16 h-16 p-0 bg-primary text-white border-primary hover:bg-transparent hover:text-primary ">
                <Link href="https://www.facebook.com/profile.php?id=61556144293257">
                  <FaFacebookF size="24" />
                </Link>
              </Button>
              <Button variant="outline" size={"icon"} className="rounded-full w-16 h-16 p-0 bg-primary text-white border-primary hover:bg-transparent hover:text-primary ">
                <Link href="https://www.instagram.com/zafiritravel/">
                  <FaInstagram size="24" />
                </Link>
              </Button>
              <Button variant="outline" size={"icon"} className="rounded-full w-16 h-16 p-0 bg-primary text-white border-primary hover:bg-transparent hover:text-primary ">
                <Link href="https://www.tiktok.com/@zafiritravel?lang=en">
                  <FaTiktok size="24" />
                </Link>
              </Button>
              <Button variant="outline" size={"icon"} className="rounded-full w-16 h-16 p-0 bg-primary text-white border-primary hover:bg-transparent hover:text-primary ">
                <Link href="https://www.linkedin.com/company/zafiritravel/">
                  <FaLinkedinIn size="24" />
                </Link>
              </Button>
            </div>
          </div>
          <p>© 2024 All Rights Reserved | Designed by Zafiri ltd</p>
        </div>
      </div>
    </footer>
  );
};