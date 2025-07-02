"use client";
import React, { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";

// --- MOCK DATA (Simulating API response) ---
const allPosts = [
  {
    id: 1,
    slug: "revit-bim-essentials",
    title: "Revit BIM Essentials for Structural Engineers",
    category: "Revit",
    date: "2025-07-20",
    image:
      "https://guru.com/blog/wp-content/uploads/2023/04/what-is-revit-used-for.jpg",
    tags: ["Revit", "BIM", "Structural Design"],
    excerpt:
      "Unlock the power of Building Information Modeling with our deep dive into Autodesk Revit for structural analysis and design. This guide covers everything from basic modeling to advanced documentation.",
  },
  {
    id: 2,
    slug: "autocad-drafting-techniques",
    title: "Advanced 2D & 3D Drafting Techniques in AutoCAD",
    category: "AutoCAD",
    date: "2025-06-18",
    image: "https://placehold.co/800x450/e2e8f0/334155?text=AutoCAD",
    tags: ["AutoCAD", "Drafting"],
    excerpt:
      "Go beyond the basics. Learn professional workflows, tips, and tricks to enhance your drafting speed and precision in AutoCAD.",
  },
  {
    id: 3,
    slug: "etabs-seismic-design",
    title: "Seismic Design & Analysis using Etabs",
    category: "Etabs",
    date: "2024-11-15",
    image: "https://placehold.co/800x450/e2e8f0/334155?text=Etabs",
    tags: ["Etabs", "Seismic", "Analysis"],
    excerpt:
      "A comprehensive guide to performing seismic analysis and designing earthquake-resistant structures with Etabs software.",
  },
  {
    id: 4,
    slug: "tekla-steel-detailing",
    title: "Mastering Steel Detailing with Tekla Structures",
    category: "Tekla",
    date: "2024-10-05",
    image: "https://placehold.co/800x450/e2e8f0/334155?text=Tekla",
    tags: ["Tekla", "Steel"],
    excerpt:
      "From model creation to fabrication drawings, this guide covers the essentials of steel detailing using Tekla Structures.",
  },
];

const categories = [
  "All",
  "Revit",
  "AutoCAD",
  "Etabs",
  "Tekla",
  "Structural Design",
  "BIM",
];
const years = ["All", "2025", "2024"];
const months = [
  "All",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// --- SVG Icons for Civil Tech ---
const CivilTechLogos = () => (
  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4">
    <div className="w-12 h-12 bg-slate-800/20 p-2 rounded-full backdrop-blur-sm flex items-center justify-center border border-white/20">
      <p className="text-xl font-bold text-white">Re</p>
    </div>
    <div className="w-12 h-12 bg-slate-800/20 p-2 rounded-full backdrop-blur-sm flex items-center justify-center border border-white/20">
      <p className="text-xl font-bold text-white">At</p>
    </div>
    <div className="w-12 h-12 bg-slate-800/20 p-2 rounded-full backdrop-blur-sm flex items-center justify-center border border-white/20">
      <p className="text-xl font-bold text-white">ET</p>
    </div>
  </div>
);

// --- Main Blog Page Component ---
export default function BlogPage() {
  //   const [activeCategory, setActiveCategory] = useState("All");

  // This will be used for the new filter bar
  const [filters, setFilters] = useState({
    category: "All",
    year: "All",
    month: "All",
    text: "",
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const postDate = new Date(post.date);
      const postYear = postDate.getFullYear().toString();
      const postMonth = postDate.toLocaleString("default", { month: "long" });

      const categoryMatch =
        filters.category === "All" || post.category === filters.category;
      const yearMatch = filters.year === "All" || postYear === filters.year;
      const monthMatch = filters.month === "All" || postMonth === filters.month;
      const textMatch =
        post.title.toLowerCase().includes(filters.text.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(filters.text.toLowerCase());

      return categoryMatch && yearMatch && monthMatch && textMatch;
    });
  }, [filters]);

  const recentArticles = useMemo(() => allPosts.slice(0, 4), []);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 p-4 sm:p-8">
      <div className="max-w-screen-xl mx-auto">
        <header className="mb-8">
          <div className="relative">
            <input
              type="text"
              name="text"
              value={filters.text}
              onChange={handleFilterChange}
              placeholder="Search Our Civil Engineering Blog..."
              className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <div className="bg-white p-6 rounded-lg border border-slate-200/80">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Recent Articles
              </h3>
              <ul className="space-y-4">
                {recentArticles.map((article) => (
                  <li
                    key={article.id}
                    className="flex items-center  space-x-3 group cursor-pointer">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <span className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                      {article.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200/80 mt-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        category: category,
                        year: "All",
                        month: "All",
                        text: "",
                      }))
                    }
                    className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                      filters.category === category
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-blue-100"
                    }`}>
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-9">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-lg border border-slate-200/80 mb-8 flex flex-wrap items-center gap-4">
              <span className="font-semibold text-slate-600">Filter By:</span>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="filter-dropdown">
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <select
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="filter-dropdown">
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                name="month"
                value={filters.month}
                onChange={handleFilterChange}
                className="filter-dropdown">
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="text"
                value={filters.text}
                onChange={handleFilterChange}
                placeholder="Enter text to filter"
                className="filter-dropdown flex-grow"
              />
              <button className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700">
                <Filter size={20} />
              </button>
            </div>

            {filteredPosts.length > 0 ? (
              <div className="bg-white rounded-lg border border-slate-200/80 overflow-hidden shadow-sm">
                <div className="relative border-4  border-slate-100 m-2 rounded-lg overflow-hidden">
                  <img
                    src={filteredPosts[0].image}
                    alt={filteredPosts[0].title}
                    className="w-full h-auto max-h-[300px] object-cover rounded-lg shadow-md mb-4"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <CivilTechLogos />
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-slate-500">
                      {filteredPosts[0].date}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {filteredPosts[0].tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
                    {filteredPosts[0].title}
                  </h1>
                  <p className="text-slate-600 leading-relaxed">
                    {filteredPosts[0].excerpt}
                    <a
                      href="#"
                      className="text-blue-600 font-semibold ml-2 hover:underline">
                      Read More
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg border border-slate-200/80">
                <h3 className="text-2xl font-bold text-slate-700">
                  No Articles Found
                </h3>
                <p className="text-slate-500 mt-2">
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
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #334155;
        }
        .filter-dropdown:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px #bfdbfe;
        }
      `}</style>
    </div>
  );
}
