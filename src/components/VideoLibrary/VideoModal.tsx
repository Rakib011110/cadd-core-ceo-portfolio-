import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import PlaylistSidebar from "./PlaylistSidebar";
import type { VideoItem } from "./constants";

const VideoModal: React.FC<{
  video: VideoItem;
  onClose: () => void;
  playlistVideos?: VideoItem[];
  onSelectVideo?: (v: VideoItem) => void;
}> = ({ video, onClose, playlistVideos = [], onSelectVideo }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-7xl bg-black rounded-lg overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="bg-black">
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            <h3 className="text-sm md:text-base text-white font-semibold line-clamp-1">{video.title}</h3>
            <button onClick={onClose} aria-label="Close" className="p-2 rounded-md hover:bg-white/5">
              <X className="text-white" />
            </button>
          </div>
          <div className="relative pb-[56.25%] h-0">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-4 text-white">
            <p className="text-sm opacity-80">{video.views} • {new Date(video.uploadDate).toLocaleDateString()}</p>
            <h4 className="font-semibold text-lg mt-2">{video.title}</h4>
          </div>
        </div>

        <PlaylistSidebar
          videos={playlistVideos}
          currentVideoId={video.videoId}
          onSelectVideo={onSelectVideo}
        />
      </motion.div>
    </motion.div>
  );
};

export default VideoModal;
