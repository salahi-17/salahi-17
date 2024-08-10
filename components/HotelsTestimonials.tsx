import React from 'react';

const QuoteMark = () => (
  <svg className="w-12 h-12 text-white opacity-20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
);

const TestimonialsSection = () => {
  const featuredTestimonial = {
    text: "Zafiri made our Zanzibar trip unforgettable! The recommendations were spot on, and the service was impeccable.",
    author: "John Doe",
    role: "Travel Enthusiast"
  };

  const testimonials = [
    {
      text: "Booking through Zafiri was the best decision we made. Their local knowledge and tips were invaluable.",
      author: "Jane Smith",
      role: "Adventure Seeker"
    },
    {
      text: "From the moment we landed to the time we left, Zafiri took care of everything. Highly recommend!",
      author: "Emily Johnson",
      role: "Family Traveler"
    },
    {
      text: "Zafiri's travel planning services were top-notch. We enjoyed every moment of our stay in Zanzibar.",
      author: "Michael Brown",
      role: "Luxury Traveler"
    }
  ];

  return (
    <div className="bg-[#00e1e3] py-12 px-4 rounded-lg">
      <h2 className="text-4xl font-bold mb-10 text-[#3f3f3f] text-center">Testimonials</h2>
      
      {/* Featured Testimonial */}
      <div className="bg-white bg-opacity-20 p-8 rounded-lg mb-8 relative">
        <QuoteMark />
        <p className="text-white text-xl mb-4 mt-2">{featuredTestimonial.text}</p>
        <p className="text-white font-semibold">{featuredTestimonial.author}</p>
        <p className="text-white opacity-75">{featuredTestimonial.role}</p>
      </div>
      
      {/* Other Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white bg-opacity-20 p-6 rounded-lg relative">
            <QuoteMark />
            <p className="text-white mb-4 mt-2">{testimonial.text}</p>
            <p className="text-white font-semibold">{testimonial.author}</p>
            <p className="text-white opacity-75">{testimonial.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;