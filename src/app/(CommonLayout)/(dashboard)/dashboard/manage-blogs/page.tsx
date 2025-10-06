/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useGetBlogsQuery, useDeleteBlogMutation, useUpdateBlogMutation, useGetSingleBlogQuery } from "@/redux/api/blogApi";
import { toast } from "sonner";
import { Eye, CheckCircle2, Camera, Play } from "lucide-react";

// Utility function to generate slug from title
const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-");

// Predefined categories
const CATEGORIES = [
  "Civil",
  "Architectural",
  "BIM",
  "Structural",
  "AutoCAD",
  "Revit",
  "Safe",
  "Autodesk",
  "STAAD.Pro",
  "Etabs",
  "Software",
  "Engineering",
  "3D Modeling",
  "Design",
  "Construction",
  "Planning",
  "MEP",
  "Infrastructure",
  "Project Management",
  "CAD",
  "Visualization",
  "Analysis"
];

const ManageBlogsPage = () => {
  const { data: blogs, isLoading, isError, refetch } = useGetBlogsQuery({});
  const [deleteBlog] = useDeleteBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();

  // Update modal states
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [blogImages, setBlogImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showCustomCategory, setShowCustomCategory] = useState<boolean>(false);

  const [editFormData, setEditFormData] = useState({
    slug: "",
    title: "",
    category: "",
    customCategory: "",
    image: "",
    video: "",
    tags: "",
    description: "",
  });

  // Fetch single blog data when editing
  const { data: singleBlog } = useGetSingleBlogQuery(editingBlogId || "", {
    skip: !editingBlogId,
  });

  // Populate form when single blog data is loaded
  useEffect(() => {
    if (singleBlog?.data && editingBlogId) {
      const blog = singleBlog.data;
      setEditFormData({
        slug: blog.slug || "",
        title: blog.title || "",
        category: blog.category || "",
        customCategory: "",
        image: blog.image || "",
        video: blog.video || "",
        tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",
        description: blog.description || "",
      });
      setBlogImages(blog.image ? [blog.image] : []);
      setImagePreviews(blog.image ? [blog.image] : []);
      setShowCustomCategory(false);
    }
  }, [singleBlog, editingBlogId]);

  // Auto-generate slug from title
  useEffect(() => {
    setEditFormData((prev) => ({
      ...prev,
      slug: slugify(prev.title),
    }));
  }, [editFormData.title]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(id);
        toast.success("Blog deleted successfully!");
        refetch();
      } catch (error: any) {
        toast.error(`Delete failed: ${error?.data?.message || error?.message || "Unknown error"}`);
      }
    }
  };

  const handleEditClick = (blog: any) => {
    setEditingBlogId(blog._id);
  };

  /**
   * Uploads a single file to Cloudinary.
   * @param file The File object to upload.
   * @returns The secure URL of the uploaded image, or null if upload fails.
   */
  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "CADDCOREWEB");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dbkwiwoll/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Image uploaded successfully!");
        return data.secure_url;
      } else {
        toast.error(`Image upload failed: ${data.error?.message || "Unknown error"}`);
        return null;
      }
    } catch (error: any) {
      console.error("Cloudinary Upload Error:", error);
      toast.error("Image upload failed due to network or server error.");
      return null;
    }
  };

  /**
   * Handles the change event for the image input.
   * Generates previews and uploads files to Cloudinary.
   * @param e The change event from the file input.
   */
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);

      // Generate local previews immediately
      const previews = Array.from(files).map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);

      // Upload files to Cloudinary
      const uploadedImageUrls = await Promise.all(
        Array.from(files).map((file) => uploadToCloudinary(file))
      );

      // Filter out any failed uploads (null values)
      const validImages = uploadedImageUrls.filter((url) => url !== null) as string[];
      setBlogImages(validImages);

      if (validImages.length > 0) {
        // Set the first uploaded image as the primary image for the blog post
        setEditFormData((prev) => ({ ...prev, image: validImages[0] }));
      } else {
        setEditFormData((prev) => ({ ...prev, image: "" }));
      }

      setIsUploading(false);
      // Clean up object URLs
      previews.forEach(URL.revokeObjectURL);
    } else {
      setImagePreviews([]);
      setBlogImages([]);
      setEditFormData((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "category") {
      if (value === "others") {
        setShowCustomCategory(true);
        setEditFormData((prev) => ({
          ...prev,
          [name]: "",
          customCategory: "",
        }));
      } else {
        setShowCustomCategory(false);
        setEditFormData((prev) => ({
          ...prev,
          [name]: value,
          customCategory: "",
        }));
      }
    } else {
      setEditFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingBlogId) return;

    // Determine final category
    const finalCategory = showCustomCategory
      ? editFormData.customCategory.trim()
      : editFormData.category;

    if (!finalCategory) {
      toast.error("Please select or enter a category.");
      return;
    }

    const blogData = {
      ...editFormData,
      category: finalCategory,
      tags: editFormData.tags.split(",").map((tag) => tag.trim()),
    };

    // Remove customCategory from blogData
    const { customCategory, ...finalBlogData } = blogData;

    try {
      await updateBlog({ id: editingBlogId, ...finalBlogData }).unwrap();
      toast.success("Blog updated successfully!");
      setEditingBlogId(null);
      refetch();
    } catch (err: any) {
      console.error("❌ Blog update failed:", err);
      toast.error(`Blog update failed: ${err?.data?.message || err?.message || "Unknown error"}`);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-sm text-gray-600">Loading...</div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-sm text-red-600">Failed to load blogs.</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h1 className="text-xl font-bold text-gray-900">Manage Blogs</h1>
        <Link
          href="/dashboard/new-blog"
          className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
        >
          Create New Blog
        </Link>
      </div>

      {blogs?.data?.length === 0 ? (
        <div className="text-center text-gray-500 py-8 text-sm">
          No blogs found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded">
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="py-2 px-3 text-center text-xs font-medium">Title</th>
                <th className="py-2 px-3 text-center text-xs font-medium">Category</th>
                <th className="py-2 px-3 text-center text-xs font-medium">Date</th>
                <th className="py-2 px-3 text-center text-xs font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs?.data?.map((blog: any) => (
                <tr
                  key={blog._id}
                  className="border-b border-gray-100 transition-all hover:bg-gray-50"
                >
                  <td className="py-2 px-3 text-sm font-medium text-gray-900">
                    {blog.title}
                  </td>
                  <td className="py-2 px-3 text-sm text-gray-700">
                    {blog.category}
                  </td>
                  <td className="py-2 px-3 text-sm text-gray-700">
                    {blog.date}
                  </td>
                  <td className="py-2 px-3 space-x-1">
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="bg-gray-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-gray-700 transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEditClick(blog)}
                      className="bg-black text-white px-2 py-1 rounded text-xs font-medium hover:bg-gray-800 transition-colors"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingBlogId && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white border border-gray-200 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            initial={{ y: "-100vh" }}
            animate={{ y: 0 }}
            exit={{ y: "100vh" }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Update Blog</h2>
                <button
                  onClick={() => setEditingBlogId(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-6">
                {/* Title Section */}
                <div>
                  <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-2">
                    Blog Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-title"
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    placeholder="Enter blog title"
                    required
                  />
                  {editFormData.slug && (
                    <p className="mt-1 text-xs text-gray-500">
                      URL: <span className="font-mono">/{editFormData.slug}</span>
                    </p>
                  )}
                </div>

                {/* Category Section */}
                <div>
                  <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="edit-category"
                    name="category"
                    value={showCustomCategory ? "others" : editFormData.category}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    required={!showCustomCategory}
                  >
                    <option value="">Choose a category</option>
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                    <option value="others">✨ Custom Category</option>
                  </select>

                  {showCustomCategory && (
                    <input
                      type="text"
                      name="customCategory"
                      value={editFormData.customCategory}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black mt-2"
                      placeholder="Enter custom category"
                      required
                    />
                  )}
                </div>

                {/* Content Section */}
                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-2">
                    Blog Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="edit-description"
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black resize-none"
                    placeholder="Write your blog content here..."
                    rows={6}
                    required
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                      This will be the main content of your blog post
                    </p>
                    <span className="text-xs text-gray-400">
                      {editFormData.description.length} characters
                    </span>
                  </div>
                </div>

                {/* Tags Section */}
                <div>
                  <label htmlFor="edit-tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (Optional)
                  </label>
                  <input
                    type="text"
                    id="edit-tags"
                    name="tags"
                    value={editFormData.tags}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    placeholder="Enter tags separated by commas"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Separate multiple tags with commas
                  </p>
                </div>

                {/* Media Section */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Image Upload */}
                  <div>
                    <label htmlFor="edit-imageUpload" className="block text-sm font-medium text-gray-700 mb-2">
                      Featured Image
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="edit-imageUpload"
                        name="imageUpload"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={isUploading}
                      />
                      <label
                        htmlFor="edit-imageUpload"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200 ${
                          isUploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isUploading ? (
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                            <p className="mt-2 text-sm text-gray-600">Uploading...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Camera className="w-6 h-6 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">Click to upload image</p>
                            <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                          </div>
                        )}
                      </label>
                    </div>

                    {/* Image Preview */}
                    {imagePreviews.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {imagePreviews.slice(0, 4).map((src, index) => (
                          <div key={index} className="relative aspect-video rounded-lg overflow-hidden shadow-md group">
                            <img
                              src={src}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
                              <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {editFormData.image && !isUploading && (
                      <div className="mt-3 flex items-center space-x-2 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm">Image ready</span>
                      </div>
                    )}
                  </div>

                  {/* Video URL */}
                  <div>
                    <label htmlFor="edit-video" className="block text-sm font-medium text-gray-700 mb-2">
                      Video URL (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Play className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        id="edit-video"
                        name="video"
                        value={editFormData.video}
                        onChange={handleEditChange}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Supports YouTube, Vimeo, and direct video links
                    </p>
                  </div>
                </div>

                {/* Submit Section */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    onClick={() => setEditingBlogId(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? 'Uploading...' : 'Update Blog'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ManageBlogsPage;
