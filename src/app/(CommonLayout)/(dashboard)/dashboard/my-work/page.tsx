import React from 'react';
import { Clock, Sparkles, Zap } from 'lucide-react';

export default function MyWorkPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icon Section */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-full p-6 shadow-2xl">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-8 h-8 text-blue-500 animate-bounce" />
              <Zap className="w-6 h-6 text-purple-500 animate-pulse" />
              <Clock className="w-8 h-8 text-indigo-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            Feature Coming Soon
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
            We're working hard to bring you an amazing new feature. Stay tuned for updates and exciting announcements!
          </p>

          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Innovative</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cutting-edge technology and modern design</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Powerful</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enhanced performance and capabilities</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Coming Soon</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Exciting updates on the horizon</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Want to be notified when this feature launches?
            </p>
            
          </div>
        </div>
      </div>
    </div>
  );
}