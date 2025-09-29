"use client";
import React, { useState } from "react";
import {
  useGetSeminarsQuery,
  useUpdateSeminarMutation,
  useDeleteSeminarMutation,
} from "@/redux/api/seminarApi";
import { toast } from "sonner";


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
    <div className="mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Manage Seminars</h2>
          <p className="text-xs text-gray-600 mt-1">
            View and manage all scheduled seminars
          </p>
        </div>
        <a
          href="/dashboard/seminar-schedule"
          className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
        >
          + Create Seminar
        </a>
      </div>

      <div className="bg-white border border-gray-200 rounded">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="py-2 px-3 text-left text-xs font-medium">Topic</th>
                <th className="py-2 px-3 text-center text-xs font-medium">Place</th>
                <th className="py-2 px-3 text-center text-xs font-medium">Date</th>
                <th className="py-2 px-3 text-center text-xs font-medium">Time</th>
                <th className="py-2 px-3 text-center text-xs font-medium">Type</th>
                <th className="py-2 px-3 text-center text-xs font-medium">Price</th>
                <th className="py-2 px-3 text-center text-xs font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 px-3 text-center text-xs text-gray-500">
                    Loading seminars...
                  </td>
                </tr>
              ) : data && data.data && data.data.length > 0 ? (
                data.data.map((seminar: Seminar) => (
                  <tr
                    key={seminar._id}
                    className="border-b border-gray-100 transition-all hover:bg-gray-50"
                  >
                    <td className="py-2 px-3">
                      <span className="text-sm font-medium text-gray-900">{seminar.topic}</span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="text-xs text-gray-700">{seminar.place}</span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="text-xs text-gray-700">{seminar.date}</span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="text-xs text-gray-700">{seminar.time}</span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className={`px-2 py-1 text-xs rounded ${
                        seminar.type === "Free"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {seminar.type}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="text-xs text-gray-700">
                        {seminar.type === "Paid" ? `৳${seminar.price}` : "Free"}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(seminar)}
                          className="px-3 py-1 bg-gray-600 text-white text-xs font-medium rounded hover:bg-gray-700 transition-colors"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(seminar._id)}
                          className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 px-3 text-center text-xs text-gray-500">
                    No seminars found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Update Seminar</h3>
              <button
                className="text-gray-400 hover:text-gray-600 text-xl"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Topic</label>
                <input
                  type="text"
                  name="topic"
                  value={editForm?.topic ?? ""}
                  onChange={handleEditChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Place</label>
                  <select
                    name="place"
                    value={editForm?.place ?? ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                  >
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">Offline</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={editForm?.date ?? ""}
                    onChange={handleEditChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={editForm?.time ?? ""}
                    onChange={handleEditChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Type</label>
                  <select
                    name="type"
                    value={editForm?.type ?? ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                  >
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                {editForm && editForm.type === "Paid" && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={editForm.price ?? 0}
                      onChange={handleEditChange}
                      min={0}
                      required={editForm.type === "Paid"}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
                >
                  Update Seminar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeminarManager;
