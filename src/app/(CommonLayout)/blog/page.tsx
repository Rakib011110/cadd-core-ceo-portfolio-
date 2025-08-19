"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter,  BookOpen, Loader2 } from "lucide-react";
import { useGetBlogsQuery } from "@/redux/api/blogApi";

// --- BLOG INTERFACE ---
interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  image?: string;
  video?: string;
  tags: string[];
  description: string;
}


// --- HELPER COMPONENTS ---

// const CivilTechLogos = () => (
//   <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4">
//     {["Re", "At", "ET"].map((text) => (
//       <div
//         key={text}
//         className="w-12 h-12 bg-slate-800/20 p-2 rounded-full backdrop-blur-sm flex items-center justify-center border border-white/20"
//       >
//         <p className="text-xl font-bold text-white">{text}</p>
//       </div>
//     ))}
//   </div>
// );

// This component handles YouTube embeds and images
const PostMedia = ({ image, video }: { image?: string; video?: string }) => {
  if (!image && !video) {
    return null;
  }

  const isYoutubeUrl = video && (video.includes("youtube.com") || video.includes("youtu.be"));
  const getYoutubeEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/embed")) return url;
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("watch?v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <div className="relative overflow-hidden">
      <div className={`grid gap-1 ${image && video ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
        {image && (
          <div className="relative group">
            <img
              src={image}
              alt="Post content"
              className="w-full h-64 md:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/800x450/3b82f6/ffffff?text=Blog+Image';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}
        {video && isYoutubeUrl && (
          <div className="w-full aspect-video">
            <iframe
              className="w-full h-full"
              src={getYoutubeEmbedUrl(video)}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        )}
        {video && !isYoutubeUrl && (
          <video 
            controls 
            src={video} 
            className="w-full h-64 md:h-80 object-cover bg-gray-900 rounded-lg"
            poster={image}
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
};


// --- MAIN PAGE COMPONENT ---
export default function BlogPage() {
  // Fetch blogs from API
  const { data: apiResponse, isLoading, isError, error } = useGetBlogsQuery({});
  const blogs: BlogPost[] = apiResponse?.data || [];

  const [filters, setFilters] = useState({
    category: "All",
    year: "All", 
    month: "All",
    text: "",
  });

  const [visibleCount, setVisibleCount] = useState(6);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(blogs.map((post) => post.category).filter(Boolean))
    );
    return ["All", ...uniqueCategories];
  }, [blogs]);

  const years = useMemo(() => {
    const validDates = blogs
      .map((p) => p.date)
      .filter(Boolean)
      .map((date) => new Date(date).getFullYear().toString())
      .filter((year) => !isNaN(Number(year)));
    return ["All", ...Array.from(new Set(validDates))];
  }, [blogs]);

  const months = [
    "All", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setVisibleCount(6);
  };

  const filteredPosts = useMemo(() => {
    return blogs
      .filter((post) => {
        if (!post.date) return true;
        
        const postDate = new Date(post.date);
        const postYear = postDate.getFullYear().toString();
        const postMonth = postDate.toLocaleString("default", { month: "long" });

        const categoryMatch = filters.category === "All" || post.category === filters.category;
        const yearMatch = filters.year === "All" || postYear === filters.year;
        const monthMatch = filters.month === "All" || postMonth === filters.month;
        const textMatch =
          post.title.toLowerCase().includes(filters.text.toLowerCase()) ||
          post.description.toLowerCase().includes(filters.text.toLowerCase());

        return categoryMatch && yearMatch && monthMatch && textMatch;
      })
      .sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime());
  }, [blogs, filters]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  const recentArticles = useMemo(() =>
    [...blogs]
      .sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime())
      .slice(0, 5),
    [blogs]
  );

  const handleRecentArticleClick = (postId: string) => {
    const postElement = document.getElementById(postId);
    if (postElement) {
      postElement.scrollIntoView({ behavior: "smooth" });
      setExpandedPostId(postId);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Loading blogs...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Please wait while we fetch the latest articles
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Failed to Load Blogs
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error && 'data' in error ? 
              (error.data as { message: string })?.message || 'Something went wrong while fetching blogs' :
              'Network error occurred'
            }
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans text-slate-800 dark:text-slate-100 p-4 sm:p-8">
      <div className="max-w-screen-lg mx-auto">
        <header className="mb-8">
          <div className="relative">
            <input
              type="text"
              name="text"
              value={filters.text}
              onChange={handleFilterChange}
              placeholder="Search Our Civil Engineering Blog..."
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg py-3 px-4 pl-12 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200/80 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Recent Articles
              </h3>
              <ul className="space-y-4">
                {recentArticles.map((article) => (
                  <li
                    key={article._id}
                    onClick={() => handleRecentArticleClick(article._id)}
                    className="flex items-start space-x-3 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 p-2 rounded-lg transition-colors"
                  >
                    {article.image && (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                      />
                    )}
                    {!article.image && article.video && (
                       <div className="w-12 h-12 rounded-md flex-shrink-0 bg-slate-700 flex items-center justify-center">
                           <Filter size={20} className="text-white"/>
                       </div>
                    )}
                    <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                      {article.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200/80 dark:border-slate-700 mt-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, category, year: "All", month: "All", text: "" }))
                    }
                    className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                      filters.category === category
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-9">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200/80 dark:border-slate-700 mb-8 flex flex-wrap items-center gap-4">
              <span className="font-semibold text-slate-600 dark:text-white">
                Filter By:
              </span>
              <select name="category" value={filters.category} onChange={handleFilterChange} className="filter-dropdown">
                {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
              <select name="year" value={filters.year} onChange={handleFilterChange} className="filter-dropdown">
                {years.map((year) => (<option key={year} value={year}>{year}</option>))}
              </select>
              <select name="month" value={filters.month} onChange={handleFilterChange} className="filter-dropdown">
                {months.map((month) => (<option key={month} value={month}>{month}</option>))}
              </select>
              <button className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700">
                <Filter size={20} />
              </button>
            </div>

            {visiblePosts.length > 0 ? (
              <div className="space-y-6">
                {visiblePosts.map((post) => {
                  const isExpanded = expandedPostId === post._id;
                  return (
                    <div
                      key={post._id}
                      id={post._id}
                      className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700 overflow-hidden shadow-sm"
                    >
                      <PostMedia image={post.image} video={post.video} />
                      
                      <div className="p-8">
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {post.date ? new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'No date'}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {post.tags?.map((tag, index) => (
                              <span key={`${tag}-${index}`} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-bold px-3 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                          {post.title}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {isExpanded ? post.description : post.description?.slice(0, 300)}
                          {post.description?.length > 300 && (
                            <button
                              onClick={() => setExpandedPostId(prev => prev === post._id ? null : post._id)}
                              className="text-blue-600 dark:text-blue-400 font-semibold ml-2 hover:underline"
                            >
                              {isExpanded ? "Show Less" : "...Read More"}
                            </button>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {visibleCount < filteredPosts.length && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 10)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                      Show More
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700">
                <h3 className="text-2xl font-bold text-slate-700 dark:text-white">
                  No Articles Found
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                  Please try adjusting your filters.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
      <style jsx>{`
        .filter-dropdown {
          background-color: white;
          color: #334155;
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
        }
        .filter-dropdown:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px #bfdbfe;
        }
        .dark .filter-dropdown {
          background-color: #1e293b;
          color: white;
          border-color: #475569;
        }
      `}</style>
    </div>
  );
}
