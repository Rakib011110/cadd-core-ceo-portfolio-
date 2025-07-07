/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  PlayCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Video,
  ChevronDown,
} from "lucide-react";

// --- TYPE DEFINITIONS ---
interface VideoItem {
  id: string;
  title: string;
  videoId: string;
  uploadDate: string;
  views: string;
  duration: string;
  thumbnail: string;
}

interface VideosByPlaylistState {
  [key: string]: VideoItem[];
}

interface CurrentPagesState {
  [key: string]: number;
}

// --- YouTube API Response Types ---
interface YouTubePlaylistItem {
  id: string;
  snippet: {
    publishedAt: string;
    title: string;
    thumbnails: {
      medium: { url: string };
      high?: { url: string };
    };
    resourceId: {
      videoId: string;
    };
  };
}

interface YouTubeVideoDetail {
  id: string;
  statistics?: {
    viewCount?: string;
  };
  contentDetails?: {
    duration?: string;
  };
}

// --- MOCK DATA & CONSTANTS ---
const playlists = [
  {
    id: "PL7l9ZWmCGDbSfiAKmZblMOX7aaFyJCWJR",
    title: "RCC Building Structural Analysis & Design Master Course",
    icon: "🏗️",
  },
  {
    id: "PL7l9ZWmCGDbSb-YMyMzHk5pvz0nk9jddV",
    title: "Concrete Materials A to Z",
    icon: "🧱",
  },
  {
    id: "PL7l9ZWmCGDbRcqpXUojx_CLmf_zK6-s6m",
    title: "BNBC-2020 Online Training Full Course",
    icon: "📏",
  },
];

const API_KEY = "AIzaSyBB2kiCQoB4fEt7ZPFxR0xUlRQAcIONrCk";
const VIDEOS_PER_PAGE = 3;

// --- HELPER FUNCTIONS ---
const parseDuration = (isoDuration: string): string => {
  const matches = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) return "N/A";

  const hours = parseInt(matches[1] || "0");
  const minutes = parseInt(matches[2] || "0");
  const seconds = parseInt(matches[3] || "0");

  let result = "";
  if (hours > 0) result += `${hours}:`;
  result += `${minutes < 10 && hours > 0 ? "0" : ""}${minutes}:`;
  result += `${seconds < 10 ? "0" : ""}${seconds}`;
  return result;
};

const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString();

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const playlistVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

// --- MAIN COMPONENT ---
export default function VideoTrainingLibrary() {
  const [expandedPlaylist, setExpandedPlaylist] = useState<string | null>(
    playlists[0]?.id || null
  );
  const [videosByPlaylist, setVideosByPlaylist] =
    useState<VideosByPlaylistState>({});
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentPages, setCurrentPages] = useState<CurrentPagesState>({});
  const [selectedVideo, setSelectedVideo] = useState<{
    videoId: string;
    title: string;
  } | null>(null);

  const fetchPlaylistVideos = useCallback(
    async (playlistId: string) => {
      if (videosByPlaylist[playlistId]) return;

      setLoadingStates((prev) => ({ ...prev, [playlistId]: true }));
      try {
        const playlistItemsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`
        );
        const playlistItemsData = await playlistItemsRes.json();

        if (!playlistItemsData.items || playlistItemsData.items.length === 0) {
          setVideosByPlaylist((prev) => ({ ...prev, [playlistId]: [] }));
          return;
        }

        const videoIds = playlistItemsData.items
          .map((item: YouTubePlaylistItem) => item.snippet?.resourceId?.videoId)
          .filter(Boolean);

        if (videoIds.length === 0) {
          setVideosByPlaylist((prev) => ({ ...prev, [playlistId]: [] }));
          return;
        }
        const videoDetailsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds.join(
            ","
          )}&key=${API_KEY}`
        );
        const videoDetailsData = await videoDetailsRes.json();
        const videoDetailsMap = new Map<string, YouTubeVideoDetail>(
          videoDetailsData.items.map((item: YouTubeVideoDetail) => [
            item.id,
            item,
          ])
        );

        const videos: VideoItem[] = playlistItemsData.items.map(
          (item: YouTubePlaylistItem) => {
            const detail = videoDetailsMap.get(item.snippet.resourceId.videoId);
            return {
              id: item.id,
              title: item.snippet.title,
              videoId: item.snippet.resourceId.videoId,
              uploadDate: item.snippet.publishedAt,
              views: detail?.statistics?.viewCount
                ? parseInt(detail.statistics.viewCount).toLocaleString()
                : "N/A",
              duration: detail?.contentDetails?.duration
                ? parseDuration(detail.contentDetails.duration)
                : "N/A",
              thumbnail:
                item.snippet.thumbnails.high?.url ||
                item.snippet.thumbnails.medium.url,
            };
          }
        );

        setVideosByPlaylist((prev) => ({ ...prev, [playlistId]: videos }));
        setCurrentPages((prev) => ({ ...prev, [playlistId]: 1 }));
      } catch (error) {
        console.error(
          `Error fetching videos for playlist ${playlistId}:`,
          error
        );
        setVideosByPlaylist((prev) => ({ ...prev, [playlistId]: [] }));
      } finally {
        setLoadingStates((prev) => ({ ...prev, [playlistId]: false }));
      }
    },
    [videosByPlaylist]
  );

  useEffect(() => {
    if (expandedPlaylist) {
      fetchPlaylistVideos(expandedPlaylist);
    }
  }, [expandedPlaylist, fetchPlaylistVideos]);

  const togglePlaylist = (id: string) => {
    setExpandedPlaylist((prevId) => (prevId === id ? null : id));
    if (!videosByPlaylist[id]) {
      fetchPlaylistVideos(id);
    }
  };

  const handleNextPage = (playlistId: string) => {
    setCurrentPages((prev) => ({
      ...prev,
      [playlistId]: (prev[playlistId] || 1) + 1,
    }));
  };

  const handlePrevPage = (playlistId: string) => {
    setCurrentPages((prev) => ({
      ...prev,
      [playlistId]: Math.max(1, (prev[playlistId] || 1) - 1),
    }));
  };

  const handleVideoClick = (videoId: string, title: string) => {
    setSelectedVideo({ videoId, title });
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedVideo(null);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 px-4">
          <div className="relative inline-block max-w-5xl mx-auto">
            {/* Decorative Corners */}
            <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-gray-300 dark:border-gray-600"></div>
            <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-gray-300 dark:border-gray-600"></div>
            <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-gray-300 dark:border-gray-600"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-gray-300 dark:border-gray-600"></div>

            {/* Title + Subtitle */}
            <div className="px-8 py-4">
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent mb-4 leading-tight uppercase">
                Video{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                  Training
                </span>{" "}
                Library
              </h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
                Learn key engineering skills from free expert-led training
                videos.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Training Playlists Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6">
          {playlists.map((pl) => {
            const isExpanded = expandedPlaylist === pl.id;
            const isLoading = loadingStates[pl.id];
            const videos = videosByPlaylist[pl.id] || [];
            const currentPage = currentPages[pl.id] || 1;
            const totalPages = Math.ceil(videos.length / VIDEOS_PER_PAGE);
            const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
            const currentVideos = videos.slice(
              startIndex,
              startIndex + VIDEOS_PER_PAGE
            );

            return (
              <motion.div
                key={pl.id}
                variants={itemVariants as any}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-800/20 border border-gray-200/80 dark:border-gray-700 overflow-hidden transition-all duration-300">
                {/* Playlist Header (Button) */}
                <button
                  onClick={() => togglePlaylist(pl.id)}
                  className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-3xl mr-4">{pl.icon}</span>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                        {pl.title}
                      </h2>
                    </div>
                    <div className="flex items-center">
                      {videos.length > 0 && (
                        <div className="hidden sm:flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-200/70 dark:bg-gray-700 px-3 py-1 rounded-full mr-4">
                          <Video
                            size={16}
                            className="mr-2 text-gray-600 dark:text-gray-300"
                          />
                          {videos.length} Videos
                        </div>
                      )}
                      <ChevronDown
                        size={28}
                        className={`text-gray-500 dark:text-gray-400 transform transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                </button>

                {/* Collapsible Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      variants={playlistVariants as any}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="px-6 pb-6">
                      {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {[...Array(VIDEOS_PER_PAGE)].map((_, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: idx * 0.1 }}
                              className="animate-pulse">
                              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-video mb-4" />
                              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                            </motion.div>
                          ))}
                        </div>
                      ) : currentVideos.length > 0 ? (
                        <div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentVideos.map((video) => (
                              <motion.div
                                key={video.id}
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl dark:hover:shadow-gray-800/50 transition-all duration-300 cursor-pointer"
                                onClick={() =>
                                  handleVideoClick(video.videoId, video.title)
                                }>
                                <div className="relative">
                                  <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full aspect-video object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src = `https://placehold.co/480x270/e0e0e0/ffffff?text=Thumbnail`;
                                    }}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <PlayCircle
                                      className="text-white"
                                      size={60}
                                    />
                                  </div>
                                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md font-medium">
                                    {video.duration}
                                  </div>
                                </div>
                                <div className="p-4">
                                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 text-base">
                                    {video.title}
                                  </h4>
                                  <div className="flex items-center mt-3 text-sm text-gray-600 dark:text-gray-300">
                                    <Calendar
                                      className="mr-1.5 text-blue-500 dark:text-blue-400"
                                      size={16}
                                    />
                                    <span>{formatDate(video.uploadDate)}</span>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                          {/* Pagination */}
                          {totalPages > 1 && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="flex justify-center items-center pt-8">
                              <button
                                onClick={() => handlePrevPage(pl.id)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label="Previous Page">
                                <ChevronLeft
                                  size={24}
                                  className="text-gray-700 dark:text-gray-300"
                                />
                              </button>
                              <span className="text-gray-700 dark:text-gray-300 font-medium mx-4 text-sm">
                                Page {currentPage} of {totalPages}
                              </span>
                              <button
                                onClick={() => handleNextPage(pl.id)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label="Next Page">
                                <ChevronRight
                                  size={24}
                                  className="text-gray-700 dark:text-gray-300"
                                />
                              </button>
                            </motion.div>
                          )}
                        </div>
                      ) : (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center text-gray-500 dark:text-gray-400 py-8">
                          No videos found for this playlist.
                        </motion.p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative bg-black rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-4 bg-gray-900/50">
                <h3 className="text-lg font-semibold text-white pr-10 line-clamp-1">
                  {selectedVideo.title}
                </h3>
                <motion.button
                  onClick={closeModal}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-600/50 rounded-full p-2 transition-colors duration-200 z-10"
                  aria-label="Close video player">
                  <X size={20} />
                </motion.button>
              </div>
              <div className="relative pb-[56.25%] h-0 bg-black">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
