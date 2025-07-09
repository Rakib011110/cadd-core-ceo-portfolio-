/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const MyCoursesPageManage = () => {
  const { data: courses, isLoading } = useGetCoursesQuery(undefined);
  const [deleteCourse] = useDeleteCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [editId, setEditId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<ICourse>();

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
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Course Management
            </h1>
            <p className="text-muted-foreground">
              Manage all your courses in one place
            </p>
          </div>
          <Link href="/dashboard/create-course">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Course
            </Button>
          </Link>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          {isLoading ? (
            <div className="space-y-4 p-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[200px]">Title</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Lessons</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses?.data?.map((course: ICourse) => (
                  <TableRow key={course._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-md border">
                          <img
                            src={course.photoUrl}
                            alt={course.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span>{course.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {course.duration}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        {course.lessons}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        {course.projects}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(course.category)
                          ? course.category.map((cat, i) => (
                              <Badge key={i} variant="secondary">
                                {cat}
                              </Badge>
                            ))
                          : course.category.split(",").map((cat, i) => (
                              <Badge key={i} variant="secondary">
                                {cat.trim()}
                              </Badge>
                            ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={() => openEditModal(course)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(course._id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editId} onOpenChange={(open) => !open && setEditId(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input {...register("title")} placeholder="Course title" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration</label>
                <Input
                  {...register("duration")}
                  placeholder="Course duration"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Lessons</label>
                <Input
                  {...register("lessons")}
                  placeholder="Number of lessons"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Projects</label>
                <Input
                  {...register("projects")}
                  placeholder="Number of projects"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <Input {...register("slug")} placeholder="Course slug" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image URL</label>
                <Input {...register("photoUrl")} placeholder="Image URL" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Categories</label>
                <Input
                  {...register("category")}
                  placeholder="Comma separated categories"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setEditId(null)}>
                Cancel
              </Button>
              <Button type="submit">
                <Check className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyCoursesPageManage;
