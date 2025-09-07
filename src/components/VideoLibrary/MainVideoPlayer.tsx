import React from "react";
import { Play, Eye, Calendar } from "lucide-react";
import type { VideoItem } from "./constants";
import { parseDuration } from "./helpers";

const MainVideoPlayer: React.FC<{ video: VideoItem | null }> = ({ video }) => {
  if (!video) {
    return (
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl aspect-video flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mb-6">
          <Play className="w-10 h-10 text-gray-500 dark:text-gray-400 ml-1" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Select a Video to Start Watching</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          Choose a video from the playlist to begin your learning journey
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
        <div className="relative pb-[56.25%] h-0">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {/* Video Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
          {video.title}
        </h2>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span className="font-medium">{video.views} views</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(video.uploadDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
            Duration:   {typeof video.duration === 'string' && video.duration.startsWith('PT') ? parseDuration(video.duration) : (video.duration || 'N/A')}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Professional training video from our comprehensive engineering course collection.
            Master specialized skills with expert-led content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainVideoPlayer;
