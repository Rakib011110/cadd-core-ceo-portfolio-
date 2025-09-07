import React from "react";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import type { VideoItem } from "./constants";

const VideoCard: React.FC<{ video: VideoItem; onPlay: (v: VideoItem) => void }> = ({ video, onPlay }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md cursor-pointer"
      onClick={() => onPlay(video)}>
      <div className="relative">
        <img src={video.thumbnail} alt={video.title} className="w-full aspect-video object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
          <PlayCircle className="text-white" size={48} />
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{video.duration}</div>
      </div>
      <div className="p-3">
        <div className="font-semibold text-sm line-clamp-2">{video.title}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">{new Date(video.uploadDate).toLocaleDateString()} • {video.views}</div>
      </div>
    </motion.div>
  );
};

export default VideoCard;
