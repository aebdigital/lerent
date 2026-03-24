import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Logo from '../logoRENT.svg';
import { blogAPI } from '../services/api';
import ReviewsSection from '../components/ReviewsSection';
import ContactMapSection from '../components/ContactMapSection';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogAPI.getBlogs();
        setPosts(data);
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
        setError('Nepodarilo sa načítať články.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

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
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-[#fa9208] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400">Načítavam články...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-300">{error}</p>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-300">Obsah sa pripravuje</p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="group">
                <article className="rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-800 hover:border-gray-700" style={{ backgroundColor: 'rgb(25, 25, 25)' }}>
                  {/* Card image */}
                  <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                    {post.featuredImage ? (
                      <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <img src={Logo} alt="LeRent" className="h-16 w-auto opacity-60" />
                    )}
                  </div>
                  <div className="p-6">
                    {/* Read time */}
                    {post.readingTime && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                        <ClockIcon className="h-3.5 w-3.5" />
                        <span>{post.readingTime}</span>
                      </div>
                    )}

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
                        <span>{new Date(post.publishDate).toLocaleDateString('sk-SK', {
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
        )}
      </div>

      {/* Shared Sections */}
      <ReviewsSection />
      <ContactMapSection />
    </div>
  );
};

export default BlogPage;
