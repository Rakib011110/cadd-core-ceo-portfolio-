/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ICourse } from "@/lib/types";
import {
  useDeleteCourseMutation,
  useGetCoursesQuery,
  useUpdateCourseMutation,
} from "@/redux/api/courseApi";
import {
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  Check,
  Clock,
  BookOpen,
  Layers,
} from "lucide-react";

const MyCoursesPageManage = () => {
  const { data: courses, isLoading } = useGetCoursesQuery(undefined);
  const [deleteCourse] = useDeleteCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [editId, setEditId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<ICourse>();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[id^="dropdown-"]') && !target.closest('button')) {
        document.querySelectorAll('[id^="dropdown-"]').forEach(dropdown => {
          dropdown.classList.add('hidden');
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this course?"
    );
    if (confirmDelete) {
      try {
        await deleteCourse(id).unwrap();
        toast.success("Course deleted successfully");
      } catch (error) {
        toast.error("Failed to delete course");
      }
    }
  };

  const openEditModal = (course: ICourse) => {
    setEditId(course._id);
    Object.entries(course).forEach(([key, val]) => {
      setValue(key as keyof ICourse, val);
    });
  };

  const handleUpdate = async (formData: ICourse) => {
    try {
      const payload = {
        id: editId,
        ...formData,
        category: formData.category.split(",").map((c: string) => c.trim()),
      };
      await updateCourse(payload).unwrap();
      toast.success("Course updated successfully");
      setEditId(null);
      reset();
    } catch (error) {
      toast.error("Failed to update course");
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Course Management</h1>
          <p className="text-xs text-gray-600 mt-1">
            Manage all your courses in one place
          </p>
        </div>
        <Link href="/dashboard/create-course">
          <button className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            New Course
          </button>
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="py-2 px-3 text-left text-xs font-medium">Title</th>
                  <th className="py-2 px-3 text-center text-xs font-medium">Duration</th>
                  <th className="py-2 px-3 text-center text-xs font-medium">Lessons</th>
                  <th className="py-2 px-3 text-center text-xs font-medium">Projects</th>
                  <th className="py-2 px-3 text-center text-xs font-medium">Categories</th>
                  <th className="py-2 px-3 text-center text-xs font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses?.data?.map((course: ICourse) => (
                  <tr
                    key={course._id}
                    className="border-b border-gray-100 transition-all hover:bg-gray-50"
                  >
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 overflow-hidden rounded border border-gray-200">
                          <img
                            src={course.photoUrl}
                            alt={course.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{course.title}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-700">{course.duration}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <BookOpen className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-700">{course.lessons}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Layers className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-700">{course.projects}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex flex-wrap justify-center gap-1">
                        {Array.isArray(course.category)
                          ? course.category.map((cat, i) => (
                              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {cat}
                              </span>
                            ))
                          : course.category.split(",").map((cat, i) => (
                              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {cat.trim()}
                              </span>
                            ))}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="relative">
                        <button
                          onClick={() => {
                            const dropdown = document.getElementById(`dropdown-${course._id}`);
                            if (dropdown) {
                              dropdown.classList.toggle('hidden');
                            }
                          }}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        <div
                          id={`dropdown-${course._id}`}
                          className="hidden absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                        >
                          <button
                            onClick={() => {
                              openEditModal(course);
                              document.getElementById(`dropdown-${course._id}`)?.classList.add('hidden');
                            }}
                            className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex items-center transition-colors duration-200"
                          >
                            <Edit className="mr-2 h-3 w-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              handleDelete(course._id);
                              document.getElementById(`dropdown-${course._id}`)?.classList.add('hidden');
                            }}
                            className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center transition-colors duration-200"
                          >
                            <Trash2 className="mr-2 h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      {editId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Edit Course</h2>
            </div>
            <form onSubmit={handleSubmit(handleUpdate)} className="p-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Title</label>
                  <input
                    {...register("title")}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                    placeholder="Course title"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Duration</label>
                  <input
                    {...register("duration")}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                    placeholder="Course duration"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Lessons</label>
                  <input
                    {...register("lessons")}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                    placeholder="Number of lessons"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Projects</label>
                  <input
                    {...register("projects")}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                    placeholder="Number of projects"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Slug</label>
                  <input
                    {...register("slug")}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                    placeholder="Course slug"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Image URL</label>
                  <input
                    {...register("photoUrl")}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                    placeholder="Image URL"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-medium text-gray-700">Categories</label>
                  <input
                    {...register("category")}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                    placeholder="Comma separated categories"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditId(null)}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors">
                  <Check className="inline h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCoursesPageManage;
