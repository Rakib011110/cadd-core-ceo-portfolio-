"use client";
import React, { useState } from "react";
import { useCreateSeminarMutation } from "@/redux/api/seminarApi";
import { toast } from "sonner";
import SeminarManager from "../../../../../components/Dashboard/SeminarManage/SeminarManager";

const initialState = {
  topic: "",
  place: "ONLINE",
  date: "",
  time: "",
  type: "Free",
  price: "",
};




const SeminarSchedule = () => {
  const [form, setForm] = useState(initialState);
  const [createSeminar, { isLoading }] = useCreateSeminarMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: form.type === "Paid" ? Number(form.price) : 0 };
      await createSeminar(payload).unwrap();
      toast.success("Seminar created successfully!");
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
        toast.error("Failed to create seminar");
      }
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Seminar Schedule</h1>
          <p className="text-xs text-gray-600 mt-1">
            Create and manage upcoming seminars
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Seminar</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Topic</label>
            <input
              type="text"
              name="topic"
              value={form.topic}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
              placeholder="Enter seminar topic"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Place</label>
              <select
                name="place"
                value={form.place}
                onChange={handleChange}
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
                value={form.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Time</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
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
                value={form.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
              >
                <option value="Free">Free</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            {form.type === "Paid" && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min={0}
                  required={form.type === "Paid"}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                  placeholder="Enter price"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white text-sm font-medium py-2 rounded hover:bg-gray-800 transition-colors disabled:opacity-60"
          >
            {isLoading ? "Creating..." : "Create Seminar"}
          </button>
        </form>
      </div>

      <div className="mt-6">
        <SeminarManager />
      </div>
    </div>
  );
};

export default SeminarSchedule;
