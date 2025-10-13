import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin, Star, ArrowRight, BookOpen, Filter, TrendingUp, Mail } from 'lucide-react';
import Link from 'next/link';
import { useGetWorkshopsQuery } from '../../../redux/api/workshopApi';

// Workshop data interface
interface Workshop {
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
}

const WorkshopCard: React.FC<{ workshop: Workshop }> = ({ workshop }) => {
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
    <Link href={`/workshops/${workshop.slug}`}>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-all duration-300 group hover:-translate-y-1 cursor-pointer">
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={workshop.image}
            alt={workshop?.title}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Level Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 ${getLevelColor(workshop.level)}`}>
              {workshop?.level}
            </span>
          </div>

          {/* Price Badge */}
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 rounded-full text-xs font-bold bg-black text-white shadow-lg">
              ${workshop.price}
            </span>
          </div>

          {/* Availability Status */}
          {isAlmostFull && !isFull && (
            <div className="absolute bottom-3 left-3">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500 text-white">
                Almost Full
              </span>
            </div>
          )}

          {isFull && (
            <div className="absolute bottom-3 left-3">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
                Fully Booked
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <div className="mb-2">
            <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
              {workshop.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {workshop.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
            {workshop.description}
          </p>

          {/* Workshop Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <Calendar className="w-3 h-3 mr-2 text-blue-500 flex-shrink-0" />
              <span className="font-medium">{formatDate(workshop.date)}</span>
            </div>
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <Clock className="w-3 h-3 mr-2 text-green-500 flex-shrink-0" />
              <span>{workshop.time} • {workshop.duration}</span>
            </div>
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <MapPin className="w-3 h-3 mr-2 text-purple-500 flex-shrink-0" />
              <span>{workshop.location}</span>
            </div>
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <Users className="w-3 h-3 mr-2 text-orange-500 flex-shrink-0" />
              <span className="font-medium">{workshop.instructor}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {workshop.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-md border border-blue-200 dark:border-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA Button */}
          <button
            disabled={isFull}
            className={`w-full py-2 px-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center group text-sm border-2 ${
              isFull
                ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
                : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-black'
            }`}
            onClick={(e) => e.preventDefault()} // Prevent Link navigation when clicking button
          >
            <span>{isFull ? 'Fully Booked' : 'Register Now'}</span>
            {!isFull && (
              <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
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

  const categories = ['All', ...new Set(workshops.map((w: Workshop) => w.category))];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredWorkshops = workshops.filter((workshop: Workshop) => {
    const categoryMatch = selectedCategory === 'All' || workshop.category === selectedCategory;
    const levelMatch = selectedLevel === 'All' || workshop.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  // Handle loading state
  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading workshops...</p>
          </div>
        </div>
      </section>
    );
  }

  // Handle error state
  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Failed to load workshops</h3>
            <p className="text-gray-600 dark:text-gray-300">Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
      <div className="text-center mb-16">
  <div className="relative inline-block">
    <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-gray-300 dark:border-gray-600"></div>
    <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-gray-300 dark:border-gray-600"></div>
    <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-gray-300 dark:border-gray-600"></div>
    <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-gray-300 dark:border-gray-600"></div>

    <h1 className="px-8 py-4">
      <p className="text-4xl font-bold text-gray-900 dark:text-white uppercase mb-2">
        Featured{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          Workshops
        </span>
      </p>
      <p className="text-lg text-gray-500 dark:text-gray-400 flex items-center justify-center">
        <span className="w-8 h-px bg-gray-300 dark:bg-gray-600 mr-3"></span>
        Master new skills with expert-led training
        <span className="w-8 h-px bg-gray-300 dark:bg-gray-600 ml-3"></span>
      </p>
    </h1>
  </div>
</div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
          
        </div>

        {/* Workshops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredWorkshops.map((workshop: Workshop, index: number) => (
            <WorkshopCard key={workshop._id} workshop={workshop} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Learning Journey?
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of professionals who have transformed their careers through our expert-led workshops.
              Don&apos;t miss out on the opportunity to learn from industry leaders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link href={"/workshops"}>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center group">
                <span>View All Workshops</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
             
             </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center group">
                <span>Contact Us</span>
                <Mail className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>
      </div>
    </section>
  );
}