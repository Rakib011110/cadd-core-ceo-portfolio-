import React from 'react';
import { Clock, Sparkles, Zap, Users, BookOpen, Award } from 'lucide-react';

export default function WorkshopsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icon Section */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-full p-6 shadow-2xl">
            <div className="flex items-center justify-center space-x-2">
              <BookOpen className="w-8 h-8 text-green-500 animate-bounce" />
              <Users className="w-6 h-6 text-emerald-500 animate-pulse" />
              <Award className="w-8 h-8 text-teal-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            Workshops Coming Soon
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
            We're preparing an amazing collection of interactive workshops to enhance your skills. Get ready for hands-on learning experiences!
          </p>

          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Interactive</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Hands-on learning experiences</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Collaborative</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Learn together with peers</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Award className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Certified</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Earn certificates upon completion</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Want to be the first to know when workshops launch?
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              <Sparkles className="w-4 h-4 mr-2" />
              Get Notified
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}