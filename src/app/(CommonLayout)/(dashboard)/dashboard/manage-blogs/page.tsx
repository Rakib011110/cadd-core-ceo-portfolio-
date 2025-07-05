/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useGetBlogsQuery, useDeleteBlogMutation } from "@/redux/api/blogApi";

const ManageBlogsPage = () => {
  const { data: blogs, isLoading, isError } = useGetBlogsQuery({});
  const [deleteBlog] = useDeleteBlogMutation();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      await deleteBlog(id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Failed to load blogs.</div>;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Manage Blogs</h1>
      <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
              Title
            </th>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
              Category
            </th>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
              Date
            </th>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {blogs?.data?.map((blog: any) => (
            <tr
              key={blog._id}
              className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                {blog.title}
              </td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                {blog.category}
              </td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                {blog.date}
              </td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 mr-2">
                  Delete
                </button>
                <button
                  onClick={() =>
                    alert("Update functionality not implemented yet.")
                  }
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBlogsPage;
