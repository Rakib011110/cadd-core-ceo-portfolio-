'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Star,
  ArrowLeft,
  CheckCircle,
  Award,
  BookOpen,
  Target,
  Zap,
  Globe,
  User,
  Mail,
  Phone,
  ChevronRight,
  Download,
  Share2
} from 'lucide-react';
import { useGetWorkshopBySlugQuery } from '../../../../redux/api/workshopApi';

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

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function WorkshopDetailsPage() {
  const params = useParams();
  const [mounted, setMounted] = useState(false);

  const { data: workshopResponse, isLoading, error } = useGetWorkshopBySlugQuery((params?.slug as string) || '') as {
    data: { success: boolean; message: string; data: IWorkshop } | undefined;
    isLoading: boolean;
    error: any;
  };

  const workshop = workshopResponse?.data;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!params || !params.slug) {
    return notFound();
  }


  // Don't render anything until component is mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading workshop details...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800';
      case 'Intermediate': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800';
      case 'Advanced': return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200 border-rose-200 dark:border-rose-800';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading workshop details...</p>
        </div>
      </div>
    );
  }

  if (error || !workshop) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Workshop Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The workshop you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/workshops"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workshops
          </Link>
        </div>
      </div>
    );
  }

  const availabilityPercentage = (workshop.currentParticipants / workshop.maxParticipants) * 100;
  const isAlmostFull = availabilityPercentage > 80;
  const isFull = workshop.currentParticipants >= workshop.maxParticipants;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0">
          <Image
            src={workshop.image}
            alt={workshop.title}
            width={1920}
            height={1080}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-blue-900/85 to-indigo-900/85"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 right-10 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center">
            {/* Back Button */}
            <Link
              href="/workshops"
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-sm font-medium hover:bg-white/20 transition-all duration-300 mb-6 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Workshops
            </Link>

            {/* Category & Level */}
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md border border-cyan-400/30 text-cyan-100 rounded-full text-sm font-semibold">
                <Zap className="w-4 h-4 mr-2" />
                {workshop.category}
              </span>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-md bg-white/10 ${getLevelColor(workshop.level)}`}>
                <Award className="w-4 h-4 mr-2" />
                {workshop.level}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight animate-fade-in">
              {workshop.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed mb-6">
              {workshop.description}
            </p>

            {/* Key Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <Calendar className="w-8 h-8 text-cyan-300 mx-auto mb-2 group-hover:animate-bounce" />
                <div className="text-white font-semibold text-sm">{formatDate(workshop.date)}</div>
                <div className="text-blue-200 text-xs">{workshop.time}</div>
              </div>
              <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <Clock className="w-8 h-8 text-emerald-300 mx-auto mb-2 group-hover:animate-bounce" />
                <div className="text-white font-semibold text-sm">{workshop.duration}</div>
                <div className="text-blue-200 text-xs">Duration</div>
              </div>
              <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <MapPin className="w-8 h-8 text-purple-300 mx-auto mb-2 group-hover:animate-bounce" />
                <div className="text-white font-semibold text-sm">{workshop.location}</div>
                <div className="text-blue-200 text-xs">Location</div>
              </div>
              <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <Users className="w-8 h-8 text-orange-300 mx-auto mb-2 group-hover:animate-bounce" />
                <div className="text-white font-semibold text-sm">${workshop.price}</div>
                <div className="text-blue-200 text-xs">Investment</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                disabled={isFull}
                className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center transform hover:scale-105 ${
                  isFull
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-2xl hover:shadow-cyan-500/25'
                }`}
              >
                <span>{isFull ? 'Fully Booked' : 'Register Now'}</span>
                {!isFull && <ChevronRight className="w-5 h-5 ml-2" />}
              </button>
              <button className="px-8 py-4 border-2 border-white/80 bg-white/10 backdrop-blur-md text-white rounded-2xl font-bold text-lg hover:bg-white/20 hover:border-white transition-all duration-300 flex items-center justify-center hover:scale-105">
                <Download className="w-5 h-5 mr-2" />
                <span>Download Syllabus</span>
              </button>
            </div>

            {/* Excitement Indicator */}
            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-md border border-emerald-400/30 rounded-full">
                <Star className="w-5 h-5 text-yellow-400 mr-2 animate-spin" style={{animationDuration: '3s'}} />
                <span className="text-emerald-100 font-semibold">Limited Seats Available - Don&apos;t Miss Out!</span>
                <Star className="w-5 h-5 text-yellow-400 ml-2 animate-spin" style={{animationDuration: '3s'}} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Detailed Description */}
            <section className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/30 rounded-3xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mr-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About This Workshop</h2>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {workshop.detailedDescription || 'Detailed description not available.'}
              </p>
              <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold">
                <Zap className="w-5 h-5 mr-2" />
                Transform your skills with expert-led training
              </div>
            </section>

            {/* Learning Objectives */}
            <section className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl p-8 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What You will Achieve</h2>
              </div>
              <div className="grid gap-4">
                {(workshop.learningObjectives || []).map((objective: string, index: number) => (
                  <div key={index} className="group flex items-start bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mr-4 mt-1 group-hover:animate-bounce">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{objective}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* What You'll Learn */}
            <section className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-3xl p-8 border border-violet-200 dark:border-violet-800">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Learning Journey</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {(workshop.whatYouWillLearn || []).map((item: string, index: number) => (
                  <div key={index} className="group bg-white dark:bg-gray-800 rounded-xl p-6 border border-violet-100 dark:border-violet-800 hover:border-violet-300 dark:hover:border-violet-600 transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl flex items-center justify-center font-bold mr-4 group-hover:animate-pulse">
                        {index + 1}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{item}</h3>
                    </div>
                    <div className="w-full bg-violet-100 dark:bg-violet-900/30 rounded-full h-2">
                      <div className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all duration-1000 group-hover:w-full" style={{width: '60%'}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Curriculum */}
            <section className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-3xl p-8 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center mr-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Workshop Curriculum</h2>
              </div>
              <div className="space-y-4">
                {(workshop.curriculum || []).map((module: ICurriculum, index: number) => (
                  <div key={index} className="group bg-white dark:bg-gray-800 rounded-xl p-6 border border-amber-100 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl flex items-center justify-center font-bold mr-4 group-hover:animate-bounce">
                            {index + 1}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{module.title}</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 ml-16">{module.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 text-amber-800 dark:text-amber-200 rounded-full text-sm font-bold border border-amber-200 dark:border-amber-700">
                          {module.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Prerequisites */}
            <section className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-3xl p-8 border border-rose-200 dark:border-rose-800">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Prerequisites</h2>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 border border-rose-100 dark:border-rose-800">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 mt-1">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-rose-800 dark:text-rose-200 mb-3">What you should know before joining</h3>
                    <ul className="space-y-3">
                      {(workshop.prerequisites || []).map((prereq: string, index: number) => (
                        <li key={index} className="flex items-start group">
                          <div className="w-6 h-6 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover:animate-pulse">
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                          </div>
                          <span className="text-rose-700 dark:text-rose-300 font-medium">{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Instructor Card */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/30 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="text-center">
                <div className="relative mb-6">
                  <Image
                    src={workshop.instructorImage || '/default-avatar.png'}
                    alt={workshop.instructor}
                    width={112}
                    height={112}
                    className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{workshop.instructor}</h4>
                <div className="flex justify-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 font-medium">5.0 (Expert)</span>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                  {workshop.instructorBio || 'Experienced instructor with deep knowledge in this field.'}
                </p>
              </div>
            </div>

            {/* Workshop Details Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-3xl p-8 border border-indigo-200 dark:border-indigo-800 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Workshop Details</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-4 px-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-indigo-100 dark:border-indigo-800">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-indigo-500 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300 font-medium">Date</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">{formatDate(workshop.date)}</span>
                </div>
                <div className="flex items-center justify-between py-4 px-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-indigo-100 dark:border-indigo-800">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300 font-medium">Time</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">{workshop.time}</span>
                </div>
                <div className="flex items-center justify-between py-4 px-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-indigo-100 dark:border-indigo-800">
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-cyan-500 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300 font-medium">Duration</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">{workshop.duration}</span>
                </div>
                <div className="flex items-center justify-between py-4 px-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-indigo-100 dark:border-indigo-800">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-purple-500 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300 font-medium">Location</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">{workshop.location}</span>
                </div>
                <div className="flex items-center justify-between py-4 px-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300 font-medium">Investment</span>
                  </div>
                  <span className="font-bold text-green-700 dark:text-green-300 text-lg">${workshop.price}</span>
                </div>
              </div>
            </div>

            {/* Availability Card */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-3xl p-8 border border-orange-200 dark:border-orange-800 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Availability</h3>
              </div>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {workshop.maxParticipants - workshop.currentParticipants}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Seats Left</div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 shadow-sm ${
                      isFull ? 'bg-gradient-to-r from-red-500 to-red-600' : isAlmostFull ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'
                    }`}
                    style={{ width: `${availabilityPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{workshop.currentParticipants} enrolled</span>
                  <span className="text-gray-500 dark:text-gray-400">{workshop.maxParticipants} total</span>
                </div>
                {isAlmostFull && !isFull && (
                  <div className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                    <div className="flex items-center justify-center">
                      <Star className="w-5 h-5 text-orange-500 mr-2 animate-pulse" />
                      <span className="text-orange-800 dark:text-orange-200 font-bold text-center">Almost Full - Limited Seats!</span>
                      <Star className="w-5 h-5 text-orange-500 ml-2 animate-pulse" />
                    </div>
                  </div>
                )}
                {isFull && (
                  <div className="bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-900/50 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <span className="text-red-800 dark:text-red-200 font-bold text-center">Workshop Full</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-3xl p-8 border border-cyan-200 dark:border-cyan-800 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Skills You will Master</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {(workshop.tags || []).map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="group px-4 py-2 bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 text-cyan-700 dark:text-cyan-300 text-sm font-semibold rounded-full border border-cyan-200 dark:border-cyan-800 hover:border-cyan-300 dark:hover:border-cyan-600 transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer"
                  >
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2 group-hover:animate-pulse"></span>
                      {tag}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl p-8 border border-green-200 dark:border-green-800 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Share This Workshop</h3>
              </div>
              <button className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold">
                <Share2 className="w-5 h-5 mr-3" />
                <span>Share Workshop</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-md border border-emerald-400/30 rounded-full mb-6">
              <Star className="w-5 h-5 text-yellow-400 mr-2 animate-spin" />
              <span className="text-emerald-100 font-semibold">Don&apos;t Miss This Opportunity!</span>
              <Star className="w-5 h-5 text-yellow-400 ml-2 animate-spin" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Skills?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join this exclusive workshop and gain the expertise you need to advance your career in {workshop.category?.toLowerCase() || 'this field'}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              disabled={isFull}
              className={`px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 flex items-center justify-center transform hover:scale-105 ${
                isFull
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-900 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-2xl hover:shadow-cyan-500/25'
              }`}
            >
              <span>{isFull ? 'Fully Booked' : 'Register Now'}</span>
              {!isFull && <ChevronRight className="w-6 h-6 ml-3" />}
            </button>
            <Link
              href="/workshops"
              className="px-10 py-5 border-2 border-white/80 bg-white/10 backdrop-blur-md text-white rounded-2xl font-bold text-xl hover:bg-white/20 hover:border-white transition-all duration-300 flex items-center justify-center hover:scale-105"
            >
              <ArrowLeft className="w-6 h-6 mr-3" />
              <span>View All Workshops</span>
            </Link>
          </div>
          <div className="text-center">
            <p className="text-blue-200 text-sm">
              Limited seats available • Expert instructor • Hands-on learning • Certificate included
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}