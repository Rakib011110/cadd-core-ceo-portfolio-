import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin, Star, ArrowRight, BookOpen, Filter, TrendingUp, Mail } from 'lucide-react';
import Link from 'next/link';

// Workshop data interface
interface Workshop {
  id: string;
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
}

// Sample workshop data
const workshops: Workshop[] = [
  {
    id: '1',
    title: 'Advanced AutoCAD Techniques',
    description: 'Master advanced AutoCAD features including 3D modeling, parametric design, and automation tools. Learn industry best practices for efficient drafting and design workflows.',
    date: '2025-10-15',
    time: '10:00 AM',
    duration: '4 hours',
    location: 'Online',
    instructor: 'Dr. Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=250&fit=crop&crop=center',
    price: 99,
    maxParticipants: 50,
    currentParticipants: 23,
    category: 'CAD Software',
    level: 'Advanced',
    tags: ['AutoCAD', '3D Modeling', 'Automation']
  },
  {
    id: '2',
    title: 'Revit Architecture Fundamentals',
    description: 'Learn the basics of BIM modeling with Autodesk Revit. Cover building information modeling, parametric components, and collaborative design workflows.',
    date: '2025-10-18',
    time: '2:00 PM',
    duration: '6 hours',
    location: 'Physical Venue',
    instructor: 'Prof. Michael Chen',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=250&fit=crop&crop=center',
    price: 149,
    maxParticipants: 30,
    currentParticipants: 18,
    category: 'BIM Software',
    level: 'Beginner',
    tags: ['Revit', 'BIM', 'Architecture']
  },
  {
    id: '3',
    title: 'Structural Analysis with SAP2000',
    description: 'Comprehensive workshop on structural analysis and design using SAP2000. Learn to model complex structures and perform various analysis types.',
    date: '2025-10-22',
    time: '9:00 AM',
    duration: '8 hours',
    location: 'Online',
    instructor: 'Eng. David Rodriguez',
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=250&fit=crop&crop=center',
    price: 199,
    maxParticipants: 25,
    currentParticipants: 12,
    category: 'Structural Engineering',
    level: 'Intermediate',
    tags: ['SAP2000', 'Structural Analysis', 'Engineering']
  },
  
];

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
          {workshop.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-lg border border-blue-200 dark:border-blue-800"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Availability */}
        <div className="mb-5">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span className="font-medium">Available Seats</span>
            <span className="font-semibold">{workshop.maxParticipants - workshop.currentParticipants} left</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFull ? 'bg-red-500' : isAlmostFull ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${availabilityPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-1">
            <span>{workshop.currentParticipants} enrolled</span>
            <span>{workshop.maxParticipants} total</span>
          </div>
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
  );
};

export default function Workshop() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  const categories = ['All', ...new Set(workshops.map(w => w.category))];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredWorkshops = workshops.filter(workshop => {
    const categoryMatch = selectedCategory === 'All' || workshop.category === selectedCategory;
    const levelMatch = selectedLevel === 'All' || workshop.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6 border border-blue-200 dark:border-blue-800">
            <BookOpen className="w-4 h-4 mr-2" />
            Professional Workshops
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Master New Skills with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {' '}Expert-Led Workshops
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join our comprehensive workshops designed by industry experts. Learn cutting-edge technologies,
            advance your career, and build real-world projects with hands-on guidance.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer shadow-sm hover:shadow-md"
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
                className="pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer shadow-sm hover:shadow-md"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Workshops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredWorkshops.map((workshop, index) => (
            <WorkshopCard key={index} workshop={workshop} />
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
              Don't miss out on the opportunity to learn from industry leaders.
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