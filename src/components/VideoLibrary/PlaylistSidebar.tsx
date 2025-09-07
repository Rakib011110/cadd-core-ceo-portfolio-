import React from "react";
import type { VideoItem } from "./constants";
import {motion} from 'framer-motion'
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
    <aside className="bg-white dark:bg-gray-800 rounded-lg shadow-lg ">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {/* {videos.length} videos */}
        </div>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`group relative flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
              currentVideoId === video.videoId
                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-md"
                : "bg-gray-50 dark:bg-gray-700/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
            }`}
            onClick={() => handleVideoClick(video)}
          >
            {/* Video Number */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
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
                className="w-18 h-10 object-cover rounded-lg shadow-sm"
              />
              {currentVideoId === video.videoId && (
                <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-medium line-clamp-2 mb-1 ${
                currentVideoId === video.videoId
                  ? "text-blue-900 dark:text-blue-100"
                  : "text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"
              }`}>
                {video.title}
              </h4>
              
            </div>

            {/* Duration Badge */}
            {/* <div className="flex-shrink-0 text-xs font-medium bg-black/70 text-white px-2 py-1 rounded">
               {typeof video.duration === 'string' && video.duration.startsWith('PT') ? parseDuration(video.duration) : (video.duration || 'N/A')}
            </div> */}
          </motion.div>
        ))}

        {videos.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">🎥</div>
            <p>No videos available</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default PlaylistSidebar;
