/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  PlayCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Video,
  ChevronDown,
  AlertCircle,
  LayoutGrid,
  List,
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

interface Playlist {
  id: string;
  title: string;
  icon: string;
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

// --- CONSTANTS & MOCK DATA ---
// IMPORTANT: In a real application, this API key should be stored in environment variables
// (e.g., .env.local) and not be hardcoded.
const API_KEY = "AIzaSyBB2kiCQoB4fEt7ZPFxR0xUlRQAcIONrCk";

const playlists: Playlist[] = [
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

const VIDEOS_PER_PAGE_PLAYLIST = 3;
const VIDEOS_PER_PAGE_ALL = 9;

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
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

// --- REUSABLE COMPONENTS ---

// Video Modal Component
const VideoModal: React.FC<{
  video: { videoId: string; title: string };
  onClose: () => void;
}> = ({ video, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative bg-black rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 bg-gray-900/50">
          <h3 className="text-lg font-semibold text-white pr-10 line-clamp-1">
            {video.title}
          </h3>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-600/50 rounded-full p-2 transition-colors duration-200 z-10"
            aria-label="Close video player">
            <X size={20} />
          </motion.button>
        </div>
        <div className="relative pb-[56.25%] h-0 bg-black">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen></iframe>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Video Card Component
const VideoCard: React.FC<{ video: VideoItem; onPlay: () => void }> = ({
  video,
  onPlay,
}) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -5, scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl dark:hover:shadow-gray-800/50 transition-all duration-300 cursor-pointer group"
    onClick={onPlay}>
    <div className="relative">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
        onError={(e) => {
          e.currentTarget.src = `https://placehold.co/480x270/e0e0e0/ffffff?text=Thumbnail+Error`;
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <PlayCircle className="text-white" size={60} />
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
);

// Loading Skeleton Component
const LoadingSkeleton: React.FC<{ count: number }> = ({ count }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(count)].map((_, idx) => (
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
);

// --- PAGE COMPONENTS ---

// Playlists Page Component
const PlaylistsView: React.FC<{
  onVideoSelect: (video: { videoId: string; title: string }) => void;
}> = ({ onVideoSelect }) => {
  const [expandedPlaylist, setExpandedPlaylist] = useState<string | null>(
    playlists[0]?.id || null
  );
  const [videosByPlaylist, setVideosByPlaylist] =
    useState<VideosByPlaylistState>({});
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [errorStates, setErrorStates] = useState<{
    [key: string]: string | null;
  }>({});
  const [currentPages, setCurrentPages] = useState<CurrentPagesState>({});

  const fetchPlaylistVideos = useCallback(
    async (playlistId: string) => {
      if (videosByPlaylist[playlistId]) return;

      setLoadingStates((prev) => ({ ...prev, [playlistId]: true }));
      setErrorStates((prev) => ({ ...prev, [playlistId]: null }));
      try {
        const playlistItemsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`
        );
        const playlistItemsData = await playlistItemsRes.json();

        if (playlistItemsData.error)
          throw new Error(playlistItemsData.error.message);
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
      } catch (error: any) {
        console.error(
          `Error fetching videos for playlist ${playlistId}:`,
          error
        );
        setErrorStates((prev) => ({
          ...prev,
          [playlistId]: error.message || "Failed to fetch videos.",
        }));
        setVideosByPlaylist((prev) => ({ ...prev, [playlistId]: [] }));
      } finally {
        setLoadingStates((prev) => ({ ...prev, [playlistId]: false }));
      }
    },
    [videosByPlaylist]
  );

  useEffect(() => {
    if (expandedPlaylist && !videosByPlaylist[expandedPlaylist]) {
      fetchPlaylistVideos(expandedPlaylist);
    }
  }, [expandedPlaylist, fetchPlaylistVideos, videosByPlaylist]);

  const togglePlaylist = (id: string) => {
    setExpandedPlaylist((prevId) => (prevId === id ? null : id));
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6">
      {playlists.map((pl) => {
        const isExpanded = expandedPlaylist === pl.id;
        const isLoading = loadingStates[pl.id];
        const error = errorStates[pl.id];
        const videos = videosByPlaylist[pl.id] || [];
        const currentPage = currentPages[pl.id] || 1;
        const totalPages = Math.ceil(videos.length / VIDEOS_PER_PAGE_PLAYLIST);
        const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE_PLAYLIST;
        const currentVideos = videos.slice(
          startIndex,
          startIndex + VIDEOS_PER_PAGE_PLAYLIST
        );

        return (
          <motion.div
            key={pl.id}
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-800/20 border border-gray-200/80 dark:border-gray-700 overflow-hidden transition-all duration-300">
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

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="px-6 pb-6">
                  {isLoading ? (
                    <LoadingSkeleton count={VIDEOS_PER_PAGE_PLAYLIST} />
                  ) : error ? (
                    <div className="text-center py-8 text-red-500 dark:text-red-400 flex flex-col items-center">
                      <AlertCircle className="w-12 h-12 mb-2" />
                      <p className="font-semibold">Could not load videos.</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  ) : currentVideos.length > 0 ? (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentVideos.map((video) => (
                          <VideoCard
                            key={video.id}
                            video={video}
                            onPlay={() => onVideoSelect(video)}
                          />
                        ))}
                      </motion.div>
                      {totalPages > 1 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex justify-center items-center pt-8">
                          <button
                            onClick={() =>
                              setCurrentPages((p) => ({
                                ...p,
                                [pl.id]: p[pl.id] - 1,
                              }))
                            }
                            disabled={currentPage === 1}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <ChevronLeft
                              size={24}
                              className="text-gray-700 dark:text-gray-300"
                            />
                          </button>
                          <span className="text-gray-700 dark:text-gray-300 font-medium mx-4 text-sm">
                            Page {currentPage} of {totalPages}
                          </span>
                          <button
                            onClick={() =>
                              setCurrentPages((p) => ({
                                ...p,
                                [pl.id]: p[pl.id] + 1,
                              }))
                            }
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <ChevronRight
                              size={24}
                              className="text-gray-700 dark:text-gray-300"
                            />
                          </button>
                        </motion.div>
                      )}
                    </>
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
  );
};

// All Videos Page Component
const AllVideosView: React.FC<{
  onVideoSelect: (video: { videoId: string; title: string }) => void;
}> = ({ onVideoSelect }) => {
  const [allVideos, setAllVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAllVideos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const videoPromises = playlists.map(async (pl) => {
          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${pl.id}&key=${API_KEY}`
          );
          const data = await res.json();
          if (data.error)
            throw new Error(`Playlist ${pl.title}: ${data.error.message}`);
          return data.items || [];
        });

        const results = await Promise.all(videoPromises);
        const allItems: YouTubePlaylistItem[] = results.flat();

        const videoIds = allItems
          .map((item) => item.snippet.resourceId.videoId)
          .filter(Boolean);
        if (videoIds.length === 0) {
          setAllVideos([]);
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

        const formattedVideos: VideoItem[] = allItems.map((item) => {
          const detail = videoDetailsMap.get(item.snippet.resourceId.videoId);
          return {
            id: item.id,
            videoId: item.snippet.resourceId.videoId,
            title: item.snippet.title,
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
        });

        setAllVideos(formattedVideos);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllVideos();
  }, []);

  const filteredVideos = useMemo(() => {
    if (filter === "All") return allVideos;
    // This filtering logic is a bit tricky since playlist info isn't on the video item
    // For this example, we'll keep it simple. A better approach would be to tag videos with their playlist title during fetch.
    // Since we can't do that easily here, we'll just show all videos regardless of filter.
    // In a real app, you'd fetch per playlist and combine with playlist titles.
    return allVideos;
  }, [allVideos, filter]);

  const totalPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE_ALL);
  const currentVideos = filteredVideos.slice(
    (currentPage - 1) * VIDEOS_PER_PAGE_ALL,
    currentPage * VIDEOS_PER_PAGE_ALL
  );

  return (
    <div>
      {/* Filter buttons can be added here if the data structure supports it */}
      {isLoading ? (
        <LoadingSkeleton count={VIDEOS_PER_PAGE_ALL} />
      ) : error ? (
        <div className="text-center py-8 text-red-500 dark:text-red-400 flex flex-col items-center">
          <AlertCircle className="w-12 h-12 mb-2" />
          <p className="font-semibold">Could not load videos.</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : currentVideos.length > 0 ? (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={() => onVideoSelect(video)}
              />
            ))}
          </motion.div>
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center items-center pt-8">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft
                  size={24}
                  className="text-gray-700 dark:text-gray-300"
                />
              </button>
              <span className="text-gray-700 dark:text-gray-300 font-medium mx-4 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <ChevronRight
                  size={24}
                  className="text-gray-700 dark:text-gray-300"
                />
              </button>
            </motion.div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No videos available.
        </p>
      )}
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function VideoTrainingLibrary() {
  const [selectedVideo, setSelectedVideo] = useState<{
    videoId: string;
    title: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"playlists" | "all-videos">(
    "playlists"
  );

  const handleVideoClick = (video: { videoId: string; title: string }) => {
    setSelectedVideo(video);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  const tabs = [
    { id: "playlists", label: "Browse Playlists", icon: List },
    { id: "all-videos", label: "All Videos", icon: LayoutGrid },
  ];

  return (
    <div className="font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-300 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent mb-4 leading-tight">
            Professional Video Training Library
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
            Master specialized engineering topics with our comprehensive
            collection of free training videos.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-2 bg-gray-200 dark:bg-gray-700 p-1 rounded-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as "playlists" | "all-videos")
                }
                className={`${
                  activeTab === tab.id
                    ? ""
                    : "hover:bg-white/60 dark:hover:bg-white/10"
                } relative rounded-full px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 transition focus-visible:outline-2`}
                style={{ WebkitTapHighlightColor: "transparent" }}>
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="bubble"
                    className="absolute inset-0 z-10 bg-white dark:bg-gray-900 shadow-md"
                    style={{ borderRadius: 9999 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-20 flex items-center">
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Page Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}>
            {activeTab === "playlists" ? (
              <PlaylistsView onVideoSelect={handleVideoClick} />
            ) : (
              <AllVideosView onVideoSelect={handleVideoClick} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <VideoModal video={selectedVideo} onClose={closeModal} />
        )}
      </AnimatePresence>
    </div>
  );
}
