import React from "react";
import { motion } from "framer-motion";
import type { VideoItem } from "./constants";
import { parseDuration } from "./helpers";

const PlaylistSidebar: React.FC<{
  videos: VideoItem[];
  currentVideoId?: string;
  onSelectVideo?: (v: VideoItem) => void;
  title?: string;
}> = ({ videos = [], currentVideoId, onSelectVideo, title = "Playlist" }) => {
  const handleVideoClick = (video: VideoItem) => {
    onSelectVideo?.(video);
  };

  return (
    <aside className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">📚</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{videos.length} videos</p>
          </div>
        </div>
      </div>

      {/* Video List */}
      <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`group relative flex items-center gap-3 p-4 cursor-pointer transition-all duration-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
              currentVideoId === video.videoId
                ? "bg-blue-50 dark:bg-blue-900/20"
                : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
            }`}
            onClick={() => handleVideoClick(video)}
          >
            {/* Video Number */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              currentVideoId === video.videoId
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50"
            }`}>
              {index + 1}
            </div>

            {/* Thumbnail */}
            <div className="flex-shrink-0 relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-20 h-12 object-cover rounded-lg shadow-sm"
              />
              {currentVideoId === video.videoId && (
                <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-medium line-clamp-2 mb-1 transition-colors ${
                currentVideoId === video.videoId
                  ? "text-blue-900 dark:text-blue-100"
                  : "text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"
              }`}>
                {video.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{video.views} views</span>
                <span>•</span>
                <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Duration Badge */}
            <div className="flex-shrink-0 text-xs font-medium bg-black/70 text-white px-2 py-1 rounded">
            {typeof video.duration === 'string' && video.duration.startsWith('PT') ? parseDuration(video.duration) : (video.duration || 'N/A')}
            </div>
          </motion.div>
        ))}

        {videos.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-3">🎥</div>
            <p className="font-medium">No videos available</p>
            <p className="text-sm mt-1">Check back later for new content</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default PlaylistSidebar;
