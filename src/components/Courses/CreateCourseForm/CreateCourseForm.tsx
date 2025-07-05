/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useCreateCourseMutation } from "@/redux/api/courseApi";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";

interface ISoftware {
  softwareTitle: string;
  photoUrl: string;
}

export interface ICourseFormInput {
  title: string;
  duration: string;
  lessons: string;
  projects: string;
  slug: string;
  photoUrl: string;
  category: string;
  softwaresTaught: ISoftware[];
}

const CreateCourseForm = () => {
  const { register, control, handleSubmit, reset } = useForm<ICourseFormInput>({
    defaultValues: {
      softwaresTaught: [{ softwareTitle: "", photoUrl: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "softwaresTaught",
  });

  const [createCourse, { isLoading }] = useCreateCourseMutation();

  const onSubmit = async (data: ICourseFormInput) => {
    try {
      const courseData = {
        ...data,
        category: data.category.split(",").map((c) => c.trim()),
      };
      await createCourse(courseData).unwrap();
      toast.success("Course Created!");
      reset();
    } catch (error) {
      toast.error("Failed to create course");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-2xl shadow-xl bg-white dark:bg-neutral-900 text-gray-800 dark:text-white">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-700 dark:text-blue-400">
        Create New Course
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("title", { required: true })}
          placeholder="Title"
          className="w-full p-3 rounded-xl bg-gray-100 dark:bg-neutral-800 focus:outline-blue-500"
        />

        <input
          {...register("duration")}
          placeholder="Duration"
          className="w-full p-3 rounded-xl bg-gray-100 dark:bg-neutral-800"
        />

        <input
          {...register("lessons")}
          placeholder="Lessons"
          className="w-full p-3 rounded-xl bg-gray-100 dark:bg-neutral-800"
        />

        <input
          {...register("projects")}
          placeholder="Projects"
          className="w-full p-3 rounded-xl bg-gray-100 dark:bg-neutral-800"
        />

        <input
          {...register("slug", { required: true })}
          placeholder="Slug"
          className="w-full p-3 rounded-xl bg-gray-100 dark:bg-neutral-800"
        />

        <input
          {...register("photoUrl")}
          placeholder="Course Image URL"
          className="w-full p-3 rounded-xl bg-gray-100 dark:bg-neutral-800"
        />

        <input
          {...register("category")}
          placeholder="Category (comma-separated)"
          className="w-full p-3 rounded-xl bg-gray-100 dark:bg-neutral-800"
        />

        <div>
          <h3 className="text-lg font-semibold mb-2">Softwares Taught</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="mb-4 space-y-2">
              <input
                {...register(`softwaresTaught.${index}.softwareTitle` as const)}
                placeholder="Software Title"
                className="w-full p-2 rounded-xl bg-gray-100 dark:bg-neutral-800"
              />
              <input
                {...register(`softwaresTaught.${index}.photoUrl` as const)}
                placeholder="Software Image URL"
                className="w-full p-2 rounded-xl bg-gray-100 dark:bg-neutral-800"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 text-sm">
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ softwareTitle: "", photoUrl: "" })}
            className="text-blue-600 hover:text-blue-800">
            + Add Software
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-3 rounded-xl bg-gradient-to-r from-blue-600 to-black text-white hover:opacity-90 transition font-semibold">
          {isLoading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default CreateCourseForm;
