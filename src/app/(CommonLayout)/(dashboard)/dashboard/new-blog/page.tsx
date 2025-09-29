/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useCreateBlogMutation } from "@/redux/api/blogApi";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import RichTextEditor from "@/components/ui/RichTextEditor";
import RichTextRenderer from "@/components/ui/RichTextRenderer";


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

const NewBlogPage = () => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [blogImages, setBlogImages] = useState<string[]>([]); // Stores Cloudinary URLs
  const [isUploading, setIsUploading] = useState<boolean>(false); // New state for upload loading
  const [showCustomCategory, setShowCustomCategory] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    category: "",
    customCategory: "",
    image: "", // This will store the primary image URL from Cloudinary
    video: "", // New video field
    tags: "",
    description: "", // Changed from excerpt to description
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
   * @returns The secure URL of the uploaded image.
   * @throws Error if upload fails
   */
  const uploadToCloudinary = async (file: File): Promise<string> => {
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
        const errorMessage = `Image upload failed: ${data.error?.message || "Unknown error"}`;
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = error.message || "Image upload failed due to network or server error.";
      console.error("Cloudinary Upload Error:", error);
      toast.error(errorMessage);
      throw new Error(errorMessage);
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

      try {
        // Upload files to Cloudinary
        const uploadedImageUrls = await Promise.all(
          Array.from(files).map((file) => uploadToCloudinary(file))
        );

        setBlogImages(uploadedImageUrls); // Store all valid Cloudinary URLs

        if (uploadedImageUrls.length > 0) {
          // Set the first uploaded image as the primary image for the blog post
          setFormData((prev) => ({ ...prev, image: uploadedImageUrls[0] }));
        } else {
          setFormData((prev) => ({ ...prev, image: "" })); // Clear image if no valid uploads
        }
      } catch (error) {
        console.error("Image upload failed:", error);
        // Error handling is done in uploadToCloudinary function
        setBlogImages([]);
        setFormData((prev) => ({ ...prev, image: "" }));
      } finally {
        setIsUploading(false); // Set uploading state to false
        // Clean up object URLs after they are no longer needed
        previews.forEach(URL.revokeObjectURL);
      }
    } else {
      setImagePreviews([]);
      setBlogImages([]);
      setFormData((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "category") {
      if (value === "others") {
        setShowCustomCategory(true);
        setFormData((prev) => ({
          ...prev,
          [name]: "",
          customCategory: "",
        }));
      } else {
        setShowCustomCategory(false);
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          customCategory: "",
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation: ensure an image is uploaded if required
    if (!formData.image && blogImages.length === 0) {
      toast.error("Please upload an image for the blog post.");
      return;
    }

    // Determine final category
    const finalCategory = showCustomCategory 
      ? formData.customCategory.trim() 
      : formData.category;

    if (!finalCategory) {
      toast.error("Please select or enter a category.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const blogData = {
      ...formData,
      category: finalCategory,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      date: today,
    };

    // Remove customCategory from blogData as it's not needed in the final submission
    const { customCategory: _, ...finalBlogData } = blogData;

    try {
      await createBlog(finalBlogData).unwrap();
      toast.success("Blog created successfully!");

      // Reset form and states after successful submission
      setFormData({
        slug: "",
        title: "",
        category: "",
        customCategory: "",
        image: "",
        video: "",
        tags: "",
        description: "",
      });
      setImagePreviews([]);
      setBlogImages([]);
      setShowCustomCategory(false);
    } catch (err: any) {
      console.error("❌ Blog create failed:", err);
      toast.error(`Blog creation failed: ${err?.data?.message || err?.message || "Unknown error"}`);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-2">
            Create New Blog Post
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Share your expertise and insights with your audience
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Section */}
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-black dark:text-white">Basic Information</h2>
                
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Blog Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 text-gray-900 dark:text-gray-100 text-sm"
                    placeholder="Enter an engaging title for your blog post"
                    required
                  />
                  {formData.slug && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      URL: <span className="font-mono text-black dark:text-white">/{formData.slug}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Category Section */}
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-black dark:text-white">Category</h2>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={showCustomCategory ? "others" : formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 text-gray-900 dark:text-gray-100 text-sm"
                    required={!showCustomCategory}
                  >
                    <option value="">Choose a category</option>
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                    <option value="others">Custom Category</option>
                  </select>
                  
                  {/* Custom Category Input with Animation */}
                  {showCustomCategory && (
                    <div className="mt-3">
                      <input
                        type="text"
                        id="customCategory"
                        name="customCategory"
                        value={formData.customCategory}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 text-gray-900 dark:text-gray-100 text-sm"
                        placeholder="Enter your custom category"
                        required
                      />
                    </div>
                  )}
                </div>
              </div> 

              {/* Content Section */}
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-black dark:text-white">Content</h2>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Blog Content <span className="text-red-500">*</span>
                  </label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                    placeholder="Write your blog content here..."
                    onImageUpload={uploadToCloudinary}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      This will be the main content of your blog post
                    </p>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {formData.description.replace(/<[^>]*>/g, '').length} characters
                    </span>
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-black dark:text-white">Media</h2>

                {/* Image Upload */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Featured Image <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="imageUpload"
                        name="imageUpload"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={isUploading}
                      />
                      <label
                        htmlFor="imageUpload"
                        className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 ${
                          isUploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isUploading ? (
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                            <p className="mt-1 text-xs text-black dark:text-white">Uploading...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Click to upload image</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG up to 10MB</p>
                          </div>
                        )}
                      </label>
                    </div>

                    {/* Image Preview */}
                    {imagePreviews.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {imagePreviews.slice(0, 4).map((src, index) => (
                          <div key={index} className="relative aspect-video rounded-md overflow-hidden shadow-sm">
                            <img
                              src={src}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {formData.image && !isUploading && (
                      <div className="mt-2 flex items-center space-x-1 text-green-600 dark:text-green-400">
                        <span className="text-xs">Image uploaded successfully</span>
                      </div>
                    )}
                  </div>

                  {/* Video URL */}
                  <div>
                    <label htmlFor="video" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Video URL (Optional)
                    </label>
                    <input
                      type="url"
                      id="video"
                      name="video"
                      value={formData.video}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 text-gray-900 dark:text-gray-100 text-sm"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Supports YouTube, Vimeo, and direct video links
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium text-sm"
                  >
                    Save Draft
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingBlog || isUploading}
                    className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-black focus:ring-offset-1 dark:focus:ring-offset-gray-900 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
                  >
                    {isCreatingBlog ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                        <span>Publishing...</span>
                      </>
                    ) : isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <span>Publish Blog</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
          <div className="flex items-start space-x-3">
            <div>
              <h3 className="text-sm font-medium text-black dark:text-white mb-2">
                Tips for a Great Blog Post
              </h3>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Use a clear, engaging title that describes your content</li>
                <li>• Choose the most relevant category for better discoverability</li>
                <li>• Include high-quality images to make your post visually appealing</li>
                <li>• Write detailed content that provides value to your readers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewBlogPage;