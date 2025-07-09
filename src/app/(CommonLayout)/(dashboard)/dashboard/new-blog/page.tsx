/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useCreateBlogMutation } from "@/redux/api/blogApi";
import React, { useState, useEffect } from "react";
import { toast } from "sonner"; // Assuming sonner is configured for toasts

// Utility function to generate slug from title
const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-");

const NewBlogPage = () => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [blogImages, setBlogImages] = useState<string[]>([]); // Stores Cloudinary URLs
  const [isUploading, setIsUploading] = useState<boolean>(false); // New state for upload loading

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    category: "",
    image: "", // This will store the primary image URL from Cloudinary
    tags: "",
    excerpt: "",
  });

  const [createBlog, { isLoading: isCreatingBlog }] = useCreateBlogMutation();

  // Auto-generate slug from title
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      slug: slugify(prev.title),
    }));
  }, [formData.title]);

  /**
   * Uploads a single file to Cloudinary.
   * @param file The File object to upload.
   * @returns The secure URL of the uploaded image, or null if upload fails.
   */
  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "CADDCOREWEB"); // Ensure this preset is unsigned in Cloudinary

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dbkwiwoll/image/upload", // Replace 'dbkwiwoll' with your Cloudinary Cloud Name
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
      setIsUploading(true); // Set uploading state to true

      // Generate local previews immediately
      const previews = Array.from(files).map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);

      // Upload files to Cloudinary
      const uploadedImageUrls = await Promise.all(
        Array.from(files).map((file) => uploadToCloudinary(file))
      );

      // Filter out any failed uploads (null values)
      const validImages = uploadedImageUrls.filter((url) => url !== null) as string[];
      setBlogImages(validImages); // Store all valid Cloudinary URLs

      if (validImages.length > 0) {
        // Set the first uploaded image as the primary image for the blog post
        setFormData((prev) => ({ ...prev, image: validImages[0] }));
      } else {
        setFormData((prev) => ({ ...prev, image: "" })); // Clear image if no valid uploads
      }

      setIsUploading(false); // Set uploading state to false
      // Clean up object URLs after they are no longer needed (e.g., after component unmount or new selection)
      // Note: This is a simplified cleanup. For a more robust solution, you might want to
      // manage these URLs in a state and revoke them in a useEffect cleanup.
      previews.forEach(URL.revokeObjectURL);
    } else {
      setImagePreviews([]);
      setBlogImages([]);
      setFormData((prev) => ({ ...prev, image: "" }));
    }
  };

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

    // Basic validation: ensure an image is uploaded if required
    if (!formData.image && blogImages.length === 0) {
      toast.error("Please upload an image for the blog post.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const blogData = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      date: today,
    };

    try {
      await createBlog(blogData).unwrap();
      toast.success("Blog created successfully!");

      // Reset form and states after successful submission
      setFormData({
        slug: "",
        title: "",
        category: "",
        image: "",
        tags: "",
        excerpt: "",
      });
      setImagePreviews([]);
      setBlogImages([]);
    } catch (err: any) {
      console.error("❌ Blog create failed:", err);
      toast.error(`Blog creation failed: ${err?.data?.message || err?.message || "Unknown error"}`);
    }
  };

  return (
    <div className="font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-300 min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400">
          Create New Blog Post
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Enter blog title"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="e.g., Engineering, Software, Design"
              required
            />
          </div>

          {/* Image Upload Input */}
          <div>
            <label htmlFor="imageUpload" className="block text-sm font-medium mb-1">
              Upload Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="imageUpload"
              name="imageUpload"
              accept="image/*" // Accept only image files
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-900 dark:text-gray-300
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100
                         dark:file:bg-blue-900 dark:file:text-blue-200
                         dark:hover:file:bg-blue-800"
              disabled={isUploading}
            />
            {isUploading && (
              <p className="mt-2 text-blue-500 dark:text-blue-400 text-sm">
                Uploading image(s)... Please wait.
              </p>
            )}
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative aspect-video rounded-md overflow-hidden shadow-md">
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs font-semibold opacity-0 hover:opacity-100 transition-opacity">
                      Preview
                    </div>
                  </div>
                ))}
              </div>
            )}
            {formData.image && !isUploading && (
              <p className="mt-2 text-green-600 dark:text-green-400 text-sm">
                Image uploaded successfully:{" "}
                <a href={formData.image} target="_blank" rel="noopener noreferrer" className="underline">
                  View Image
                </a>
              </p>
            )}
          </div>

          {/* Tags */}
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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="e.g., Revit, BIM, Civil"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium mb-1">
              Excerpt <span className="text-red-500">*</span>
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Enter a short excerpt for the blog post"
              rows={4}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isCreatingBlog || isUploading} // Disable if creating blog or uploading images
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200
                       disabled:bg-blue-400 dark:disabled:bg-blue-700 disabled:cursor-not-allowed flex items-center justify-center">
            {isCreatingBlog ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting Blog...
              </>
            ) : isUploading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading Image...
              </>
            ) : (
              "Submit Blog"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewBlogPage;
