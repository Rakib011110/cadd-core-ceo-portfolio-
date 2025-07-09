
"use client";
import React, { useState } from "react";
import { useCreateVideoMutation } from "@/redux/api/videoApi";
import { toast, Toaster } from "react-hot-toast";

const initialState = {
  title: "",
  playlistId: "",
  videoUrl: "",
  description: "",
};

export default function AddNewVideo() {
  const [form, setForm] = useState(initialState);
  const [createVideo, { isLoading }] = useCreateVideoMutation();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createVideo(form).unwrap();
      toast.success("Video uploaded successfully!");
      setForm(initialState);
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof (err as { data?: unknown })?.data === "object" &&
        (err as { data?: { message?: unknown } }).data &&
        "message" in ((err as { data?: { message?: unknown } }).data as object)
      ) {
        toast.error(String((err as { data: { message: unknown } }).data.message));
      } else {
        toast.error("Failed to upload video");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Add New YouTube Video</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-semibold">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter video title"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Playlist ID <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="playlistId"
            value={form.playlistId}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter playlist ID"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">YouTube Video URL</label>
          <input
            type="url"
            name="videoUrl"
            value={form.videoUrl}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter video description (optional)"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-200 disabled:opacity-60"
        >
          {isLoading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
}