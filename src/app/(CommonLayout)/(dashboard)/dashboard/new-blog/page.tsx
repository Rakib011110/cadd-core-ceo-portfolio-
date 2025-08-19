/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useCreateBlogMutation } from "@/redux/api/blogApi";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  FileText, 
  Image as ImageIcon, 
  Tag, 
  Eye, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Camera,
  Play
} from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Blog Post
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Share your expertise and insights with your audience
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
                </div>
                
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Blog Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100"
                    placeholder="Enter an engaging title for your blog post"
                    required
                  />
                  {formData.slug && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      URL: <span className="font-mono text-blue-600 dark:text-blue-400">/{formData.slug}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Category Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Category</h2>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={showCustomCategory ? "others" : formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100"
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
                  
                  {/* Custom Category Input with Animation */}
                  {showCustomCategory && (
                    <div className="mt-4 transform transition-all duration-300 ease-in-out">
                      <input
                        type="text"
                        id="customCategory"
                        name="customCategory"
                        value={formData.customCategory}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-300 dark:border-purple-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100"
                        placeholder="Enter your custom category"
                        required
                      />
                    </div>
                  )}
                </div>
              </div> 

              {/* Content Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Content</h2>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Blog Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 resize-none"
                    placeholder="Write your blog content here..."
                    rows={6}
                    required
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      This will be the main content of your blog post
                    </p>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {formData.description.length} characters
                    </span>
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Media</h2>
                </div>

                {/* Image Upload */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 ${
                          isUploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isUploading ? (
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">Uploading...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Camera className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload image</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG up to 10MB</p>
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

                    {formData.image && !isUploading && (
                      <div className="mt-3 flex items-center space-x-2 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm">Image uploaded successfully</span>
                      </div>
                    )}
                  </div>

                  {/* Video URL */}
                  <div>
                    <label htmlFor="video" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Video URL (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Play className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        id="video"
                        name="video"
                        value={formData.video}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Supports YouTube, Vimeo, and direct video links
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
                  >
                    Save Draft
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingBlog || isUploading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isCreatingBlog ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Publishing...</span>
                      </>
                    ) : isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Publish Blog</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Tips for a Great Blog Post
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
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