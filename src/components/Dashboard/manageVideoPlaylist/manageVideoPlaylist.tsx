"use client";
import React, { useState } from "react";
import {
  useGetVideosQuery,
  useDeleteVideoMutation,
  useUpdateVideoMutation,
} from "@/redux/api/videoApi";
import { toast, Toaster } from "react-hot-toast";

type Playlist = {
  _id?: string;
  title: string;
  playlistId: string;
  description?: string;
};

export default function ManageVideoPlaylist() {
  const { data, isLoading, refetch } = useGetVideosQuery({});
  const [deleteVideo] = useDeleteVideoMutation();
  const [updateVideo] = useUpdateVideoMutation();
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Playlist | null>(null);
  const [showModal, setShowModal] = useState(false);

  const playlists: Playlist[] = data?.data || [];

  const handleEdit = (playlist: Playlist) => {
    setEditId(playlist._id || "");
    setEditForm({ ...playlist });
    setShowModal(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => (prev ? { ...prev, [name]: value } : prev));
  };


  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm || !editId) return;

    try {
      await updateVideo({ id: editId, ...editForm }).unwrap();
      toast.success("Playlist updated successfully!");
      setShowModal(false);
      setEditForm(null);
      setEditId(null);
      refetch();
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update playlist");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this playlist?")) return;
    try {
      await deleteVideo(id).unwrap();
      toast.success("Playlist deleted successfully!");
      refetch();
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete playlist");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">
        Manage YouTube Playlists
      </h1>

      {isLoading ? (
        <div className="text-center text-gray-500 py-8">Loading...</div>
      ) : playlists.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No playlists found.</div>
      ) : (
        <div className="overflow-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <table className="w-full table-auto text-sm">
            <thead className="bg-blue-100 dark:bg-gray-800 text-blue-900 dark:text-blue-300">
              <tr>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Playlist ID</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {playlists.map((playlist) => (
                <tr
                  key={playlist._id}
                  className="hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="p-4 font-medium text-gray-800 dark:text-white">
                    {playlist.title}
                  </td>
                  <td className="p-4 text-xs text-gray-600 dark:text-gray-300">
                    {playlist.playlistId}
                  </td>
                  <td className="p-4 text-gray-700 dark:text-gray-300 max-w-xs truncate">
                    {playlist.description || "-"}
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(playlist)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1.5 rounded-md text-sm font-semibold transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(playlist._id!)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm font-semibold transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update Modal */}
      {showModal && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-2xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              Edit Playlist
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:ring-2 ring-blue-400 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Playlist ID
                </label>
                <input
                  type="text"
                  name="playlistId"
                  value={editForm.playlistId}
                  onChange={handleEditChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:ring-2 ring-blue-400 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editForm.description || ""}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded border focus:ring-2 ring-blue-400 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
