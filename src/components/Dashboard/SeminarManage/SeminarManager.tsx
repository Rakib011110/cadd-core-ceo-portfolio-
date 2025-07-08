"use client";
import React, { useState } from "react";
import {
  useGetSeminarsQuery,
  useUpdateSeminarMutation,
  useDeleteSeminarMutation,
} from "@/redux/api/seminarApi";
import { toast, Toaster } from "react-hot-toast";


type Seminar = {
  _id: string;
  topic: string;
  place: string;
  date: string;
  time: string;
  type: 'Paid' | 'Free';
  price?: number;
};

const SeminarManager = () => {
  const { data, isLoading, refetch } = useGetSeminarsQuery({});
  const [updateSeminar] = useUpdateSeminarMutation();
  const [deleteSeminar] = useDeleteSeminarMutation();
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Seminar | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleEdit = (seminar: Seminar) => {
    setEditId(seminar._id);
    setEditForm({ ...seminar, price: seminar.price ?? 0 });
    setShowModal(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => prev ? { ...prev, [name]: value } : prev);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;
    try {
      const payload = { ...editForm, price: editForm.type === "Paid" ? Number(editForm.price) : 0 };
      await updateSeminar({ id: editId, ...payload }).unwrap();
      toast.success("Seminar updated successfully!");
      setShowModal(false);
      setEditId(null);
      setEditForm(null);
      refetch();
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
        toast.error("Failed to update seminar");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this seminar?")) return;
    try {
      await deleteSeminar(id).unwrap();
      toast.success("Seminar deleted successfully!");
      refetch();
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
        toast.error("Failed to delete seminar");
      }
    }
  };

  return (
    <div className="mt-10">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Manage Seminars</h2>
        <a
          href="/dashboard/seminar-schedule"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition duration-200"
        >
          + Create Seminar
        </a>
      </div>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="py-2 px-4">Topic</th>
              <th className="py-2 px-4">Place</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Time</th>
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">Loading...</td>
              </tr>
            ) : data && data.data && data.data.length > 0 ? (
              data.data.map((seminar: Seminar) => (
                <tr key={seminar._id} className="border-b hover:bg-blue-50">
                  <td className="py-2 px-4">{seminar.topic}</td>
                  <td className="py-2 px-4">{seminar.place}</td>
                  <td className="py-2 px-4">{seminar.date}</td>
                  <td className="py-2 px-4">{seminar.time}</td>
                  <td className="py-2 px-4">{seminar.type}</td>
                  <td className="py-2 px-4">{seminar.type === "Paid" ? `৳${seminar.price}` : "Free"}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(seminar)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded font-semibold"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(seminar._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">No seminars found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-blue-700">Update Seminar</h3>
            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="block mb-1 font-semibold">Topic</label>
                <input
                  type="text"
                  name="topic"
                  value={editForm?.topic ?? ""}
                  onChange={handleEditChange}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block mb-1 font-semibold">Place</label>
                  <select
                    name="place"
                    value={editForm?.place ?? ""}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">Offline</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-semibold">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={editForm?.date ?? ""}
                    onChange={handleEditChange}
                    required
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-semibold">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={editForm?.time ?? ""}
                    onChange={handleEditChange}
                    required
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block mb-1 font-semibold">Type</label>
                  <select
                    name="type"
                    value={editForm?.type ?? ""}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                {editForm && editForm.type === "Paid" && (
                  <div className="flex-1">
                    <label className="block mb-1 font-semibold">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={editForm.price ?? 0}
                      onChange={handleEditChange}
                      min={0}
                      required={editForm.type === "Paid"}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-200"
              >
                Update Seminar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeminarManager;
