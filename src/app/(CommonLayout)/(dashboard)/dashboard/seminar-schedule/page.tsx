"use client";
import React, { useState } from "react";
import { useCreateSeminarMutation } from "@/redux/api/seminarApi";
import { toast, Toaster } from "react-hot-toast";
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
    <div className="md:max-w-3xl mx-auto mt-8 p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">Seminar Schedule</h1>
      <p className="text-gray-600 mb-6 text-center">
        Here you can create and view upcoming seminars.
      </p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-semibold">Topic</label>
          <input
            type="text"
            name="topic"
            value={form.topic}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter seminar topic"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Place</label>
            <select
              name="place"
              value={form.place}
              onChange={handleChange}
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
              value={form.date}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Free">Free</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          {form.type === "Paid" && (
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min={0}
                required={form.type === "Paid"}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter price"
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-200 disabled:opacity-60"
        >
          {isLoading ? "Creating..." : "Create Seminar"}
        </button>
      </form>

      <div className="mt-8">
        <SeminarManager />
      </div>
    </div>
  );
};

export default SeminarSchedule;
