import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Logo from '../logoRENT.svg';
import blogPosts from '../data/blogPosts';
import ReviewsSection from '../components/ReviewsSection';
import ContactMapSection from '../components/ContactMapSection';

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div className="pt-32 pb-12 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-goldman">
          BLOG
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Tipy, rady a novinky zo sveta prenájmu vozidiel
        </p>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="group">
              <article className="rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-800 hover:border-gray-700" style={{ backgroundColor: 'rgb(25, 25, 25)' }}>
                {/* Card image placeholder */}
                <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <img src={Logo} alt="LeRent" className="h-16 w-auto opacity-60" />
                </div>
                <div className="p-6">
                  {/* Category + Read time */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(250, 146, 8, 0.15)', color: '#fa9208' }}>
                      {post.categoryLabel}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <ClockIcon className="h-3.5 w-3.5" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-[#fa9208] transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      <span>{new Date(post.date).toLocaleDateString('sk-SK', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center text-[#fa9208] group-hover:translate-x-1 transition-transform">
                      <span className="text-sm font-medium">Čítať</span>
                      <ChevronRightIcon className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {blogPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-300">Obsah sa pripravuje</p>
          </div>
        )}
      </div>

      {/* Shared Sections */}
      <ReviewsSection />
      <ContactMapSection />
    </div>
  );
};

export default BlogPage;
