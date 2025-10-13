"use client";
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';
import Image from 'next/image';
import {
  useGetWorkshopsQuery,
  useUpdateWorkshopMutation,
  useDeleteWorkshopMutation
} from '@/redux/api/workshopApi';
import {
  Upload,
  X,
  Plus,
  Calendar,
  Clock,
  MapPin,
  User,
  DollarSign,
  Users,
  Tag,
  BookOpen,
  Target,
  CheckCircle,
  Award,
  Edit,
  Trash2,
  Eye,
  Search
} from 'lucide-react';

interface ICurriculum {
  title: string;
  description: string;
  duration: string;
}

interface IWorkshop {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  instructor: string;
  image: string;
  price: number;
  maxParticipants: number;
  currentParticipants: number;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  slug: string;
  detailedDescription?: string;
  learningObjectives?: string[];
  prerequisites?: string[];
  whatYouWillLearn?: string[];
  instructorBio?: string;
  instructorImage?: string;
  curriculum?: ICurriculum[];
}


interface IWorkshopFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  instructor: string;
  image: string;
  price: number;
  maxParticipants: number;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  detailedDescription?: string;
  learningObjectives?: string[];
  prerequisites?: string[];
  whatYouWillLearn?: string[];
  instructorBio?: string;
  instructorImage?: string;
  curriculum?: ICurriculum[];
}

const uploadToCloudinary = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "CADDCOREWEB");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dbkwiwoll/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    if (response.ok) {
      toast.success("Image uploaded successfully!");
      return data.secure_url;
    } else {
      toast.error(`Image upload failed: ${data.error?.message || "Unknown error"}`);
      return null;
    }
  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);
    toast.error("Image upload failed due to network or server error.");
    return null;
  }
};

export default function ManageWorkshopsPage() {
  const { data: workshopsData, isLoading: workshopsLoading, refetch } = useGetWorkshopsQuery({});
  const workshops = workshopsData?.data || [];

  console.log('Workshops data:', workshopsData);
  console.log('Workshops array:', workshops);
  console.log('Workshops type:', typeof workshops, Array.isArray(workshops));
  const [updateWorkshop, { isLoading: updateLoading }] = useUpdateWorkshopMutation();
  const [deleteWorkshop, { isLoading: deleteLoading }] = useDeleteWorkshopMutation();

  const [editingWorkshop, setEditingWorkshop] = useState<IWorkshop | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workshopToDelete, setWorkshopToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [instructorImageUploading, setInstructorImageUploading] = useState(false);

  const { register, control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<IWorkshopFormData>({
    defaultValues: {
      tags: [''],
      learningObjectives: [''],
      prerequisites: [''],
      whatYouWillLearn: [''],
      curriculum: [{ title: '', description: '', duration: '' }],
    },
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control,
    name: "tags" as any,
  });

  const {
    fields: objectiveFields,
    append: appendObjective,
    remove: removeObjective,
  } = useFieldArray({
    control,
    name: "learningObjectives" as any,
  });

  const {
    fields: prerequisiteFields,
    append: appendPrerequisite,
    remove: removePrerequisite,
  } = useFieldArray({
    control,
    name: "prerequisites" as any,
  });

  const {
    fields: learnFields,
    append: appendLearn,
    remove: removeLearn,
  } = useFieldArray({
    control,
    name: "whatYouWillLearn" as any,
  });

  const {
    fields: curriculumFields,
    append: appendCurriculum,
    remove: removeCurriculum,
  } = useFieldArray({
    control,
    name: "curriculum",
  });

  const handleEdit = (workshop: any) => {
    setEditingWorkshop(workshop);
    reset({
      title: workshop.title,
      description: workshop.description,
      date: workshop.date,
      time: workshop.time,
      duration: workshop.duration,
      location: workshop.location,
      instructor: workshop.instructor,
      image: workshop.image,
      price: workshop.price,
      maxParticipants: workshop.maxParticipants,
      category: workshop.category,
      level: workshop.level,
      tags: workshop.tags || [''],
      detailedDescription: workshop.detailedDescription,
      learningObjectives: workshop.learningObjectives || [''],
      prerequisites: workshop.prerequisites || [''],
      whatYouWillLearn: workshop.whatYouWillLearn || [''],
      instructorBio: workshop.instructorBio,
      instructorImage: workshop.instructorImage,
      curriculum: workshop.curriculum || [{ title: '', description: '', duration: '' }],
    });
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    setWorkshopToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!workshopToDelete) return;

    try {
      await deleteWorkshop(workshopToDelete).unwrap();
      toast.success("Workshop deleted successfully!");
      setShowDeleteModal(false);
      setWorkshopToDelete(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete workshop");
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'instructorImage') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const setUploading = field === 'image' ? setImageUploading : setInstructorImageUploading;
    setUploading(true);

    try {
      const imageUrl = await uploadToCloudinary(file);
      if (imageUrl) {
        setValue(field, imageUrl);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: IWorkshopFormData) => {
    if (!editingWorkshop) return;

    try {
      const cleanedData = {
        ...data,
        tags: data.tags?.filter(tag => tag.trim() !== '') || [],
        learningObjectives: data.learningObjectives?.filter(obj => obj.trim() !== '') || [],
        prerequisites: data.prerequisites?.filter(pre => pre.trim() !== '') || [],
        whatYouWillLearn: data.whatYouWillLearn?.filter(learn => learn.trim() !== '') || [],
        curriculum: data.curriculum?.filter(curr => curr.title.trim() !== '' && curr.description.trim() !== '') || [],
      };

      await updateWorkshop({ id: editingWorkshop._id, ...cleanedData }).unwrap();
      toast.success("Workshop updated successfully!");
      setShowEditModal(false);
      setEditingWorkshop(null);
      reset();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update workshop");
    }
  };

  const filteredWorkshops = workshops?.filter((workshop: IWorkshop) =>
    workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workshop.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workshop.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (workshopsLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Manage Workshops
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View, edit, and delete your workshops
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search workshops by title, category, or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Workshops Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Workshop
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filteredWorkshops.map((workshop: IWorkshop) => (
                <tr key={workshop._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Image
                          className="h-10 w-10 rounded-lg object-cover"
                          src={workshop.image || '/placeholder-workshop.jpg'}
                          alt={workshop.title}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {workshop.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          by {workshop.instructor}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {workshop.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-900 dark:text-white">
                    <div>{new Date(workshop.date).toLocaleDateString()}</div>
                    <div className="text-gray-500 dark:text-gray-400">{workshop.time}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-900 dark:text-white">
                    {workshop.currentParticipants}/{workshop.maxParticipants}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-900 dark:text-white">
                    ${workshop.price}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(workshop)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(workshop._id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredWorkshops.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No workshops found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new workshop.'}
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Workshop
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingWorkshop(null);
                    reset();
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
              {/* Basic Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Workshop Title *
                    </label>
                    <input
                      {...register("title", { required: "Title is required" })}
                      type="text"
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter workshop title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <input
                      {...register("category", { required: "Category is required" })}
                      type="text"
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., BIM, AutoCAD, Structural Analysis"
                    />
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Level *
                    </label>
                    <select
                      {...register("level", { required: "Level is required" })}
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price (USD) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        {...register("price", {
                          required: "Price is required",
                          min: { value: 0, message: "Price must be positive" },
                          valueAsNumber: true
                        })}
                        type="number"
                        step="0.01"
                        className="w-full pl-10 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    {...register("description", { required: "Description is required" })}
                    rows={4}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the workshop"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Detailed Description
                  </label>
                  <textarea
                    {...register("detailedDescription")}
                    rows={6}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Detailed description with more information about the workshop"
                  />
                </div>
              </div>

              {/* Schedule & Location */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                  Schedule & Location
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        {...register("date", { required: "Date is required" })}
                        type="date"
                        className="w-full pl-10 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Time *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        {...register("time", { required: "Time is required" })}
                        type="time"
                        className="w-full pl-10 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duration *
                    </label>
                    <input
                      {...register("duration", { required: "Duration is required" })}
                      type="text"
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 2 hours, 1 day"
                    />
                    {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        {...register("location", { required: "Location is required" })}
                        type="text"
                        className="w-full pl-10 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Workshop location or online platform"
                      />
                    </div>
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
                  </div>
                </div>
              </div>

              {/* Instructor Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                  Instructor Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Instructor Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        {...register("instructor", { required: "Instructor name is required" })}
                        type="text"
                        className="w-full pl-10 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Instructor full name"
                      />
                    </div>
                    {errors.instructor && <p className="text-red-500 text-sm mt-1">{errors.instructor.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Max Participants *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        {...register("maxParticipants", {
                          required: "Max participants is required",
                          min: { value: 1, message: "Must allow at least 1 participant" },
                          valueAsNumber: true
                        })}
                        type="number"
                        className="w-full pl-10 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Maximum number of participants"
                      />
                    </div>
                    {errors.maxParticipants && <p className="text-red-500 text-sm mt-1">{errors.maxParticipants.message}</p>}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Instructor Bio
                  </label>
                  <textarea
                    {...register("instructorBio")}
                    rows={4}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Brief biography of the instructor"
                  />
                </div>
              </div>

              {/* Images */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
                  Images
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Workshop Image *
                    </label>
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'image')}
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        disabled={imageUploading}
                      />
                      {imageUploading && <p className="text-sm text-blue-600 dark:text-blue-400">Uploading...</p>}
                      {watch('image') && (
                        <div className="relative">
                          <Image
                            src={watch('image') as string}
                            alt="Workshop"
                            className="w-full h-32 object-cover rounded-lg"
                            width={400}
                            height={128}
                          />
                        </div>
                      )}
                    </div>
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Instructor Image
                    </label>
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'instructorImage')}
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        disabled={instructorImageUploading}
                      />
                      {instructorImageUploading && <p className="text-sm text-blue-600 dark:text-blue-400">Uploading...</p>}
                      {watch('instructorImage') && (
                        <div className="relative">
                          <Image
                            src={watch('instructorImage') as string}
                            alt="Instructor"
                            className="w-full h-32 object-cover rounded-lg"
                            width={400}
                            height={128}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-pink-600 dark:text-pink-400" />
                  Tags
                </h3>

                <div className="space-y-3">
                  {tagFields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <input
                        {...register(`tags.${index}` as const)}
                        type="text"
                        className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter a tag"
                      />
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="p-3 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => appendTag('')}
                    className="flex items-center px-4 py-2 text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tag
                  </button>
                </div>
              </div>

              {/* Learning Objectives */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Learning Objectives
                </h3>

                <div className="space-y-3">
                  {objectiveFields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <input
                        {...register(`learningObjectives.${index}` as const)}
                        type="text"
                        className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="What will participants learn?"
                      />
                      <button
                        type="button"
                        onClick={() => removeObjective(index)}
                        className="p-3 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => appendObjective('')}
                    className="flex items-center px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Learning Objective
                  </button>
                </div>
              </div>

              {/* Prerequisites */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
                  Prerequisites
                </h3>

                <div className="space-y-3">
                  {prerequisiteFields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <input
                        {...register(`prerequisites.${index}` as const)}
                        type="text"
                        className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Required knowledge or skills"
                      />
                      <button
                        type="button"
                        onClick={() => removePrerequisite(index)}
                        className="p-3 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => appendPrerequisite('')}
                    className="flex items-center px-4 py-2 text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Prerequisite
                  </button>
                </div>
              </div>

              {/* What You'll Learn */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-cyan-600 dark:text-cyan-400" />
                  What You&apos;ll Learn
                </h3>

                <div className="space-y-3">
                  {learnFields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <input
                        {...register(`whatYouWillLearn.${index}` as const)}
                        type="text"
                        className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="Specific skills or knowledge gained"
                      />
                      <button
                        type="button"
                        onClick={() => removeLearn(index)}
                        className="p-3 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => appendLearn('')}
                    className="flex items-center px-4 py-2 text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Learning Outcome
                  </button>
                </div>
              </div>

              {/* Curriculum */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                  Curriculum
                </h3>

                <div className="space-y-4">
                  {curriculumFields.map((field, index) => (
                    <div key={field.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Module {index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeCurriculum(index)}
                          className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          {...register(`curriculum.${index}.title` as const)}
                          type="text"
                          className="p-3 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-500 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Module title"
                        />
                        <input
                          {...register(`curriculum.${index}.duration` as const)}
                          type="text"
                          className="p-3 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-500 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Duration"
                        />
                        <textarea
                          {...register(`curriculum.${index}.description` as const)}
                          rows={2}
                          className="p-3 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-500 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Module description"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => appendCurriculum({ title: '', description: '', duration: '' })}
                    className="flex items-center px-4 py-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Module
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingWorkshop(null);
                    reset();
                  }}
                  className="px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading || imageUploading || instructorImageUploading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {updateLoading ? 'Updating...' : 'Update Workshop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Delete Workshop
                  </h3>
                </div>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Are you sure you want to delete this workshop? This action cannot be undone.
              </p>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setWorkshopToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
