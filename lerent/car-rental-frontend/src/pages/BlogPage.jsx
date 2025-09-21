import React from 'react';
import ReviewsSection from '../components/ReviewsSection';
import ContactMapSection from '../components/ContactMapSection';
import BookingFormSection from '../components/BookingFormSection';

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 font-goldman">
            BLOG
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Obsah sa pripravuje
          </p>
        </div>
      </div>

      {/* Shared Sections */}
      <ReviewsSection />
      <ContactMapSection />
      <BookingFormSection />
    </div>
  );
};

export default BlogPage;