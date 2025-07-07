"use client";
import { useCreateBlogMutation } from "@/redux/api/blogApi";
import React, { useState, useEffect } from "react";

// Utility function to generate slug from title
const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-");

const NewBlogPage = () => {
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    category: "",
    image: "",
    tags: "",
    excerpt: "",
  });

  const [createBlog, { isLoading }] = useCreateBlogMutation();

  // Auto-generate slug from title
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      slug: slugify(prev.title),
    }));
  }, [formData.title]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];
    const blogData = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      date: today,
    };

    try {
      await createBlog(blogData).unwrap();
      alert("✅ Blog created successfully!");

      setFormData({
        slug: "",
        title: "",
        category: "",
        image: "",
        tags: "",
        excerpt: "",
      });
    } catch (err) {
      console.error("❌ Blog create failed:", err);
      alert("❌ Blog create failed!");
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Create New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter title"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category"
            required
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            Image URL
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter image URL"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Revit, BIM, Civil"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium mb-1">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a short excerpt"
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          {isLoading ? "Submitting..." : "Submit Blog"}
        </button>
      </form>
    </div>
  );
};

export default NewBlogPage;
