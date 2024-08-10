import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaTiktok, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Link from 'next/link';

const ContactPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[600px] bg-gradient-to-br from-gray-800 to-black mb-12">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <p className="text-2xl font-bold mb-2 text-primary">DISCOVER ZANZIBAR WITH ZAFIRI</p>
          <h1 className="text-4xl md:text-7xl font-bold">Contact us</h1>
        </div>
      </div>

      {/* Get in Touch Section */}
      <div className="container mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Get in Touch</h2>
        <Card className="max-w-3xl mx-auto shadow-lg bg-white">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Input placeholder="Name" />
                <Input placeholder="Email Address" />
                <Textarea placeholder="Message" rows={4} />
                <Button className="text-white">Submit</Button>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Address</h3>
                <p>UK: PO Box 57465, London, FL 33139</p>
                <p>TZ: PO Box 57465, Zanzibar, FL 33139</p>
                <h3 className="font-semibold">Email</h3>
                <p className="text-primary">📧 contact@zafiri.uk</p>
                <h3 className="font-semibold">Phone</h3>
                <p>🇬🇧 +44 7436 790393</p>
                <p>🇹🇿 +255 7470 55776</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-center mt-8 space-x-4">
          <Button variant="outline" size={"icon"} className="rounded-full w-16 h-16 p-0 bg-primary text-white border-primary hover:bg-transparent hover:text-primary ">
            <Link href="https://www.facebook.com/profile.php?id=61556144293257">
              <FaFacebookF size="24"/>
            </Link>
          </Button>
          <Button variant="outline" size={"icon"} className="rounded-full w-16 h-16 p-0 bg-primary text-white border-primary hover:bg-transparent hover:text-primary ">
            <Link href="https://www.instagram.com/zafiritravel/">
              <FaInstagram size="24"/>
            </Link>
          </Button>
          <Button variant="outline" size={"icon"} className="rounded-full w-16 h-16 p-0 bg-primary text-white border-primary hover:bg-transparent hover:text-primary ">
            <Link href="https://www.tiktok.com/@zafiritravel?lang=en">
              <FaTiktok size="24"/>
            </Link>
          </Button>
          <Button variant="outline" size={"icon"} className="rounded-full w-16 h-16 p-0 bg-primary text-white border-primary hover:bg-transparent hover:text-primary ">
            <Link href="https://www.linkedin.com/company/zafiritravel/">
              <FaLinkedinIn size="24"/>
            </Link>
          </Button>
        </div>
      </div>

      {/* Visual Journey Section */}
      <div className="bg-black py-16">
        <div className="container mx-auto px-4">
          <p className="text-primary text-center mb-2">EXPLORE OUR TRAVEL GALLERY</p>
          <h2 className="text-3xl font-bold text-white text-center mb-8">Visual Journey of Zanzibar</h2>
          <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <img src="/contact/0-3e4e4a76-10fb-4c05-b998-56c7a80db400-800x800.webp" alt="Zanzibar Waterfall" className="w-full h-64 object-cover rounded-lg" />
            <img src="/contact/0-5ce404db-ade4-4474-b4a0-ba38d8481e0b-800x800.jpg" alt="Zanzibar Market" className="w-full h-64 object-cover rounded-lg" />
            <img src="/contact/0-327a226c-fb7f-41da-aec6-1d427661c42e-800x800.jpg" alt="Zanzibar Landscape" className="w-full h-64 object-cover rounded-lg" />
            <img src="/contact/0-0775daac-b81d-4689-8fc0-52f4e3d95aec-800x800.webp" alt="Zanzibar Interior" className="w-full h-64 object-cover rounded-lg" />
          </div>
        </div>
      </div>

      {/* We're here for you Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h2 className="text-3xl font-bold mb-4">We are here for you</h2>
            <p className="mb-4">
              Discover the beauty of Zanzibar while enjoying peace of mind. Our team is available 24/7 to help you plan your perfect trip. Whether you need travel advice, destination information, or just want to say hello, we're here for you.
            </p>
          </div>
          <div className="md:w-1/2">
            <img src="/contact/0-7fa7be3a-45cc-4fb7-84e7-66936d5b5e75-800x800.webp" alt="Zanzibar Sunset" className="w-full h-96 object-cover rounded-lg transition-all duration-[2000ms] ease-in-out transform group-hover:scale-110" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;