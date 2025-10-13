"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Users, MapPin, Star, ArrowRight, BookOpen, Filter, TrendingUp, Mail } from 'lucide-react';
import { useGetWorkshopsQuery } from '../../../redux/api/workshopApi';

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

const WorkshopCard: React.FC<{ workshop: IWorkshop }> = ({ workshop }) => {
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

  const availabilityPercentage = (workshop.currentParticipants / workshop.maxParticipants) * 100;
  const isAlmostFull = availabilityPercentage > 80;
  const isFull = workshop.currentParticipants >= workshop.maxParticipants;

  return (
    <Link href={`/workshops/${workshop.slug}`} className="block">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-all duration-500 group hover:-translate-y-2">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={workshop.image}
          alt={workshop.title}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Level Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 ${getLevelColor(workshop.level)}`}>
            {workshop.level}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-black text-white shadow-lg">
            ${workshop.price}
          </span>
        </div>

        {/* Availability Status */}
        {isAlmostFull && !isFull && (
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500 text-white">
              Almost Full
            </span>
          </div>
        )}

        {isFull && (
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
              Fully Booked
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
            {workshop.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {workshop.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-5 line-clamp-3 leading-relaxed">
          {workshop.description}
        </p>

        {/* Workshop Details */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" />
            <span className="font-medium">{formatDate(workshop.date)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-3 text-green-500 flex-shrink-0" />
            <span>{workshop.time} • {workshop.duration}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-3 text-purple-500 flex-shrink-0" />
            <span>{workshop.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4 mr-3 text-orange-500 flex-shrink-0" />
            <span className="font-medium">{workshop.instructor}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {(workshop.tags || []).map((tag: string, index: number) => (
            <span
              key={index}
              className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-lg border border-blue-200 dark:border-blue-800"
            >
              {tag}
            </span>
          ))}
        </div>

      

        {/* CTA Button */}
        <button
          disabled={isFull}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center group ${
            isFull
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
          }`}
        >
          <span>{isFull ? 'Fully Booked' : 'Register Now'}</span>
          {!isFull && (
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          )}
        </button>
      </div>
    </div>
    </Link>
  );
};

export default function Workshop() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  // Fetch workshops data from API
  const { data: workshopsData, isLoading, error } = useGetWorkshopsQuery({});

  // Extract workshops array from API response
  const workshops = workshopsData?.data || [];
  const categories: string[] = ['All', ...(Array.from(new Set(workshops.map((w: IWorkshop) => w.category))) as string[])];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredWorkshops = workshops.filter((workshop: IWorkshop) => {
    const categoryMatch = selectedCategory === 'All' || workshop.category === selectedCategory;
    const levelMatch = selectedLevel === 'All' || workshop.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  // Get upcoming workshops (next 3)
  const upcomingWorkshops = workshops
    .filter((w: IWorkshop) => new Date(w.date) > new Date())
    .sort((a: IWorkshop, b: IWorkshop) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Handle loading state
  if (isLoading) {
    return (
      <section className="relative min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading workshops...</p>
        </div>
      </section>
    );
  }

  // Handle error state
  if (error) {
    return (
      <section className="relative min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Failed to load workshops</h3>
          <p className="text-gray-600 dark:text-gray-300">Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-white dark:bg-gray-900">
      {/* Deep Blue Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-900 dark:via-gray-900 dark:to-blue-800"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-900/10 dark:bg-blue-400/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-black/5 dark:bg-blue-600/3 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-800/8 dark:bg-blue-500/4 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-blue-700/12 dark:bg-blue-300/6 rounded-full blur-3xl animate-float-reverse"></div>
      </div>
      {/* Compact Banner with Upcoming Workshops */}
      <div className="relative z-20 overflow-hidden bg-gradient-to-r from-blue-900 via-black to-blue-800 backdrop-blur-sm bg-opacity-95">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-20 h-20 bg-blue-300/5 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Main Banner Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Upcoming Workshops */}
            <div className="animate-fade-in-left">
              {upcomingWorkshops.length > 0 && (
                <div>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center px-4 py-2 bg-white/15 backdrop-blur-md border border-white/30 text-white rounded-full text-sm font-medium shadow-lg">
                      <Calendar className="w-4 h-4 mr-2" />
                      Upcoming Workshops
                    </div>
                  </div>

                  <div className="space-y-3">
                    {upcomingWorkshops.map((workshop: IWorkshop, index: number) => (
                      <div
                        key={workshop._id}
                        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 hover:bg-white/20 hover:border-white/30 transition-all duration-500 animate-fade-in-up shadow-2xl hover:shadow-white/10 hover:scale-105"
                        style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <img
                              src={workshop.image}
                              alt={workshop.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-semibold text-base line-clamp-2 mb-2">
                              {workshop.title}
                            </h4>
                            <div className="flex items-center text-sm text-blue-100 mb-1">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(workshop.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="flex items-center text-sm text-blue-100 mb-2">
                              <Clock className="w-4 h-4 mr-2" />
                              {workshop.time} • {workshop.duration}
                            </div>
                            <div className="flex items-center text-sm text-blue-100">
                              <Users className="w-4 h-4 mr-2" />
                              {workshop.instructor}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Main Content */}
            <div className="text-center lg:text-left animate-fade-in-right">
              {/* Badge */}
              <div className="inline-flex items-center px-6 py-3 bg-white/15 backdrop-blur-md border border-white/30 text-white rounded-full text-sm font-medium mb-4 shadow-xl">
                <BookOpen className="w-5 h-5 mr-2" />
                🚀 Transform Your Career with Expert Workshops
              </div>

              {/* Main Heading */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                Master New Skills &
                <span className="block bg-gradient-to-r from-blue-200 to-blue-300 bg-clip-text text-transparent">
                  Advance Your Career
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-xl text-blue-100 mb-6 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Join industry-leading workshops designed by experts. Learn cutting-edge technologies,
                build real-world projects, and get certified in high-demand skills.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="group bg-white/90 backdrop-blur-sm text-blue-600 px-6 py-3 rounded-xl font-bold text-lg hover:bg-white hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/25 border border-white/20">
                  <span>Explore Workshops</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
                <button className="group border-2 border-white/80 backdrop-blur-sm bg-white/10 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-white/20 hover:border-white hover:scale-105 transition-all duration-300 shadow-xl">
                  <span>Download Brochure</span>
                  <Star className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

       
      </div>

      {/* Main Content */}
      <div className="relative bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-lg text-blue-700 rounded-full text-sm font-medium mb-6 border border-white/50 shadow-lg">
            <BookOpen className="w-4 h-4 mr-2" />
            Professional Workshops
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Master New Skills with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500">
              {' '}Expert-Led Workshops
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Join our comprehensive workshops designed by industry experts. Learn cutting-edge technologies,
            advance your career, and build real-world projects with hands-on guidance.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white/70 backdrop-blur-md border border-white/50 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer shadow-lg hover:shadow-xl hover:bg-white/80"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white/70 backdrop-blur-md border border-white/50 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer shadow-lg hover:shadow-xl hover:bg-white/80"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Workshops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredWorkshops.map((workshop: IWorkshop, index: number) => (
            <WorkshopCard key={index} workshop={workshop} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden backdrop-blur-sm bg-opacity-90 border border-white/20 shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Ready to Start Your Learning Journey?
            </h3>
            <p className="text-lg mb-6 opacity-90 max-w-xl mx-auto">
              Join thousands of professionals who have transformed their careers through our expert-led workshops.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
             
              <button className="border-2 flex  border-white/80 backdrop-blur-sm bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 hover:border-white hover:scale-105 transition-all duration-300 shadow-lg">
                <span>Contact Us</span>
                <Mail className="w-5 h-5 ml-2  mt-1 group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        </div>
        </div>
        <div className="pb-12"></div>
      </div>
    </section>
  );
}