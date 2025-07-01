/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useCallback, useEffect } from "react";
import {
  Calendar,
  PlayCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Video,
  ChevronDown,
} from "lucide-react";

// --- TYPE DEFINITIONS for better code quality ---
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

// IMPORTANT: This is a public key, but it's best practice to store keys in environment variables.
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
      if (videosByPlaylist[playlistId]) return; // Data already fetched

      setLoadingStates((prev) => ({ ...prev, [playlistId]: true }));
      try {
        // 1. Fetch playlist items
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

        // 2. Fetch video details
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

        // 3. Combine data
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

  // Fetch videos for the initially expanded playlist
  useEffect(() => {
    if (expandedPlaylist) {
      fetchPlaylistVideos(expandedPlaylist);
    }
  }, [expandedPlaylist, fetchPlaylistVideos]);

  const togglePlaylist = (id: string) => {
    setExpandedPlaylist((prevId) => (prevId === id ? null : id));
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
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4 leading-tight">
            Professional Video Training Library
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Master specialized engineering topics with our comprehensive
            collection of free training videos from industry experts.
          </p>
        </div>

        {/* Training Playlists Section */}
        <div className="space-y-4">
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
              <div
                key={pl.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden transition-all duration-300">
                {/* Playlist Header (Button) */}
                <button
                  onClick={() => togglePlaylist(pl.id)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-3xl mr-4">{pl.icon}</span>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                        {pl.title}
                      </h2>
                    </div>
                    <div className="flex items-center">
                      {videos.length > 0 && (
                        <div className="hidden sm:flex items-center text-sm font-medium text-gray-500 bg-gray-200/70 px-3 py-1 rounded-full mr-4">
                          <Video size={16} className="mr-2 text-gray-600" />
                          {videos.length} Videos
                        </div>
                      )}
                      <ChevronDown
                        size={28}
                        className={`text-gray-500 transform transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                </button>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 animate-fade-in">
                    {isLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(VIDEOS_PER_PAGE)].map((_, idx) => (
                          <div key={idx} className="animate-pulse">
                            <div className="bg-gray-200 rounded-lg aspect-video mb-4" />
                            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                          </div>
                        ))}
                      </div>
                    ) : currentVideos.length > 0 ? (
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {currentVideos.map((video) => (
                            <div
                              key={video.id}
                              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer"
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
                                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-base">
                                  {video.title}
                                </h4>
                                <div className="flex items-center mt-3 text-sm text-gray-600">
                                  <Calendar
                                    className="mr-1.5 text-blue-500"
                                    size={16}
                                  />
                                  <span>{formatDate(video.uploadDate)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="flex justify-center items-center pt-8">
                            <button
                              onClick={() => handlePrevPage(pl.id)}
                              disabled={currentPage === 1}
                              className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              aria-label="Previous Page">
                              <ChevronLeft size={24} />
                            </button>
                            <span className="text-gray-700 font-medium mx-4 text-sm">
                              Page {currentPage} of {totalPages}
                            </span>
                            <button
                              onClick={() => handleNextPage(pl.id)}
                              disabled={currentPage === totalPages}
                              className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              aria-label="Next Page">
                              <ChevronRight size={24} />
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">
                        এই প্লে-লিস্টের জন্য কোনো ভিডিও পাওয়া যায়নি।
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4 animate-fade-in">
          <div className="relative bg-black rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform animate-scale-in">
            <div className="flex justify-between items-center p-4 bg-gray-900/50">
              <h3 className="text-lg font-semibold text-white pr-10 line-clamp-1">
                {selectedVideo.title}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-600/50 rounded-full p-2 transition-colors duration-200 z-10"
                aria-label="Close video player">
                <X size={20} />
              </button>
            </div>
            <div className="relative pb-[56.25%] h-0 bg-black">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
