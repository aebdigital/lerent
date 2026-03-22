import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import {
  CalendarIcon,
  UserIcon,
  ClockIcon,
  ArrowLeftIcon,
  ShareIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import Logo from '../logoRENT.svg';
import blogPosts from '../data/blogPosts';
import ReviewsSection from '../components/ReviewsSection';
import ContactMapSection from '../components/ContactMapSection';

const BlogPostPage = () => {
  const { id } = useParams();

  // Find post by slug or by numeric id for backwards compat
  const blogPost = blogPosts.find(p => p.slug === id) || blogPosts.find(p => String(p.id) === id);

  if (!blogPost) {
    return <Navigate to="/blog" replace />;
  }

  // Related posts (other posts excluding current)
  const relatedPosts = blogPosts.filter(p => p.id !== blogPost.id).slice(0, 3);

  // Schema for SEO
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blogPost.title,
    "author": {
      "@type": "Organization",
      "name": blogPost.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "LeRent",
      "logo": {
        "@type": "ImageObject",
        "url": "https://lerent.sk/logoRENT.svg"
      }
    },
    "datePublished": blogPost.date,
    "dateModified": blogPost.date,
    "description": blogPost.excerpt
  };

  return (
    <>
      <SEOHead
        title={`${blogPost.title} | LeRent Blog`}
        description={blogPost.excerpt}
        keywords={`blog, ${blogPost.category}, lerent, autopožičovňa, prenájom áut`}
        type="article"
        schema={blogSchema}
      />
      <div className="min-h-screen bg-black">

        {/* Mini Hero */}
        <div className="h-[18vh] bg-gradient-to-br from-gray-900 to-black" />

        {/* Article */}
        <article className="bg-black">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ maxWidth: '90rem' }}>
            <div className="max-w-4xl mx-auto">

              {/* Category and Meta */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(250, 146, 8, 0.15)', color: '#fa9208' }}>
                  {blogPost.categoryLabel}
                </span>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{blogPost.readTime} čítania</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
                {blogPost.title}
              </h1>

              {/* Author and Date */}
              <div className="mb-8 pb-8 border-b border-gray-700">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-black font-bold text-lg" style={{ backgroundColor: '#fa9208' }}>
                    {blogPost.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-white font-medium">
                      <UserIcon className="h-4 w-4" />
                      <span>{blogPost.author}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{new Date(blogPost.date).toLocaleDateString('sk-SK', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none prose-invert blog-content"
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
                style={{
                  lineHeight: '1.8',
                  color: '#d1d5db'
                }}
              />

              {/* Back Navigation */}
              <div className="mt-10 mb-4">
                <Link
                  to="/blog"
                  className="inline-flex items-center hover:opacity-80 transition-colors font-medium"
                  style={{ color: '#fa9208' }}
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Späť na blog
                </Link>
              </div>

              {/* Share Footer */}
              <div className="mt-12 pt-8 border-t border-gray-700">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <span className="text-gray-300">Bol tento článok užitočný?</span>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-colors text-black font-medium" style={{ backgroundColor: '#fa9208' }}>
                    <ShareIcon className="h-4 w-4" />
                    <span>Zdieľať článok</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="py-12" style={{ backgroundColor: 'rgb(18, 18, 18)' }}>
            <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '90rem' }}>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-8">Súvisiace články</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedPosts.map((post) => (
                    <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                      <article className="rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 border border-gray-800" style={{ backgroundColor: 'rgb(25, 25, 25)' }}>
                        <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <img src={Logo} alt="LeRent" className="h-14 w-auto opacity-60" />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(250, 146, 8, 0.15)', color: '#fa9208' }}>
                              {post.categoryLabel}
                            </span>
                            <span className="text-xs text-gray-400">{post.readTime}</span>
                          </div>
                          <h3 className="font-semibold text-white group-hover:text-[#fa9208] transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <div className="flex items-center justify-end mt-3" style={{ color: '#fa9208' }}>
                            <span className="text-sm font-medium">Čítať viac</span>
                            <ChevronRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Shared Sections */}
        <ReviewsSection />
        <ContactMapSection />
      </div>
    </>
  );
};

export default BlogPostPage;
