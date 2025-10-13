"use client";
import React from "react";
import { useGetWorkshopsQuery } from "@/redux/api/workshopApi";
import { useGetVideosQuery } from "@/redux/api/videoApi";
import { useGetBlogsQuery } from "@/redux/api/blogApi";
import { useGetAllUsersQuery } from "@/redux/api/userApi";
import { useGetSeminarsQuery } from "@/redux/api/seminarApi";
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import {
  BookOpen,
  Video,
  FileText,
  Users,
  Presentation,
  GraduationCap,
  TrendingUp,
  Activity,
} from "lucide-react";

const Dashboard = () => {
  const { data: workshopsData, isLoading: workshopsLoading } = useGetWorkshopsQuery({});
  const { data: videosData, isLoading: videosLoading } = useGetVideosQuery({});
  const { data: blogsData, isLoading: blogsLoading } = useGetBlogsQuery({});
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery({});
  const { data: seminarsData, isLoading: seminarsLoading } = useGetSeminarsQuery({});
  const { data: coursesData, isLoading: coursesLoading } = useGetCoursesQuery({});

  const workshops = workshopsData?.data || [];
  const videos = videosData?.data || [];
  const blogs = blogsData?.data || [];
  const users = usersData?.data || [];
  const seminars = seminarsData?.data || [];
  const courses = coursesData?.data || [];

  const analyticsCards = [
    {
      title: "Total Workshops",
      value: workshops.length,
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      loading: workshopsLoading,
    },
    {
      title: "Total Playlists",
      value: videos.length,
      icon: Video,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      loading: videosLoading,
    },
    {
      title: "Total Blogs",
      value: blogs.length,
      icon: FileText,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      loading: blogsLoading,
    },
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      loading: usersLoading,
    },
    {
      title: "Total Seminars",
      value: seminars.length,
      icon: Presentation,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      loading: seminarsLoading,
    },
    {
      title: "Total Courses",
      value: courses.length,
      icon: GraduationCap,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
      loading: coursesLoading,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of your platform&apos;s performance and content
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {analyticsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`${card.bgColor} rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {card.title}
                  </p>
                  {card.loading ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                    </div>
                  ) : (
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {card.value}
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-900 dark:text-white">Manage Workshops</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <Video className="w-5 h-5 mr-3 text-red-600 dark:text-red-400" />
                <span className="text-gray-900 dark:text-white">Manage Videos</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-3 text-green-600 dark:text-green-400" />
                <span className="text-gray-900 dark:text-white">Manage Blogs</span>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">New workshop created</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">Video uploaded</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">New user registered</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
