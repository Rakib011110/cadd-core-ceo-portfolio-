/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Clock, SortAsc, X } from "lucide-react";
import MainVideoPlayer from "@/components/VideoLibrary/MainVideoPlayer";
import PlaylistSidebar from "@/components/VideoLibrary/PlaylistSidebar";
import { playlists, API_KEY, type VideoItem, type Playlist } from "@/components/VideoLibrary/constants";
import { parseDuration } from "@/components/VideoLibrary/helpers";

const VideoLibraryPage = () => {
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null);
  const [sidebarVideos, setSidebarVideos] = useState<VideoItem[]>([]);
  const [allVideos, setAllVideos] = useState<VideoItem[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [durationFilter, setDurationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const fetchPlaylistVideos = async (playlistId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const videoIds = data.items.map((it: any) => it.snippet.resourceId.videoId).filter(Boolean);
      let detailsMap = new Map();
      if (videoIds.length) {
        const detRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds.join(",")}&key=${API_KEY}`);
        const detJson = await detRes.json();
        detailsMap = new Map(detJson.items.map((it: any) => [it.id, it]));
      }
      const videos: VideoItem[] = data.items.map((it: any) => {
        const vid = it.snippet.resourceId.videoId;
        const det: any = detailsMap.get(vid);
        return {
          id: it.id,
          title: it.snippet.title,
          videoId: vid,
          uploadDate: it.snippet.publishedAt,
          views: det?.statistics?.viewCount ? parseInt(det.statistics.viewCount).toLocaleString() : "N/A",
          duration: det?.contentDetails?.duration || "N/A",
          thumbnail: it.snippet.thumbnails?.high?.url || it.snippet.thumbnails?.medium?.url,
        };
      });
      setSidebarVideos(videos);
      setAllVideos(videos);
      if (videos.length > 0) setCurrentVideo(videos[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllVideos = async () => {
    setLoading(true);
    try {
      const allItems: any[] = [];
      for (const pl of playlists) {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${pl.id}&key=${API_KEY}`);
        const json = await res.json();
        if (json.error) throw new Error(json.error.message);
        allItems.push(...(json.items || []));
      }
      const ids = allItems.map((i) => i.snippet.resourceId.videoId).filter(Boolean);
      const detailsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${ids.join(",")}&key=${API_KEY}`);
      const detailsJson = await detailsRes.json();
      const detailsMap = new Map(detailsJson.items.map((it: any) => [it.id, it]));
      const formatted = allItems.map((it) => {
        const vid = it.snippet.resourceId.videoId;
        const det: any = detailsMap.get(vid);
        return {
          id: it.id,
          title: it.snippet.title,
          videoId: vid,
          uploadDate: it.snippet.publishedAt,
          views: det?.statistics?.viewCount ? parseInt(det.statistics.viewCount).toLocaleString() : "N/A",
          duration: det?.contentDetails?.duration || "N/A",
          thumbnail: it.snippet.thumbnails?.high?.url || it.snippet.thumbnails?.medium?.url,
        } as VideoItem;
      });
      setSidebarVideos(formatted);
      setAllVideos(formatted);
      if (formatted.length > 0) setCurrentVideo(formatted[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaylistSelect = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    fetchPlaylistVideos(playlist.id);
  };

  const handleAllVideosSelect = () => {
    setSelectedPlaylist(null);
    fetchAllVideos();
  };

  const handleVideoSelect = (video: VideoItem) => {
    setCurrentVideo(video);
  };

  // Filter and search functionality
  const getDurationInSeconds = (duration: string): number => {
    if (!duration || duration === "N/A") return 0;
    if (duration.startsWith("PT")) {
      const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (!matches) return 0;
      const hours = parseInt(matches[1] || "0");
      const minutes = parseInt(matches[2] || "0");
      const seconds = parseInt(matches[3] || "0");
      return hours * 3600 + minutes * 60 + seconds;
    }
    return 0;
  };

  const filteredVideos = useMemo(() => {
    let filtered = [...allVideos];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Duration filter
    if (durationFilter !== "all") {
      filtered = filtered.filter(video => {
        const seconds = getDurationInSeconds(video.duration);
        switch (durationFilter) {
          case "short": return seconds <= 300; // 5 minutes
          case "medium": return seconds > 300 && seconds <= 1200; // 5-20 minutes
          case "long": return seconds > 1200; // 20+ minutes
          default: return true;
        }
      });
    }

    // Sort videos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case "oldest":
          return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
        case "views":
          const aViews = parseInt(a.views.replace(/,/g, '')) || 0;
          const bViews = parseInt(b.views.replace(/,/g, '')) || 0;
          return bViews - aViews;
        case "duration":
          return getDurationInSeconds(b.duration) - getDurationInSeconds(a.duration);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allVideos, searchQuery, durationFilter, sortBy]);

  // Update sidebar videos when filters change
  useEffect(() => {
    setSidebarVideos(filteredVideos);
    if (filteredVideos.length > 0 && !filteredVideos.find(v => v.videoId === currentVideo?.videoId)) {
      setCurrentVideo(filteredVideos[0]);
    }
  }, [filteredVideos, currentVideo?.videoId]);

  const clearFilters = () => {
    setSearchQuery("");
    setDurationFilter("all");
    setSortBy("newest");
  };

  useEffect(() => {
    // Default to first playlist on load
    if (playlists.length > 0) {
      handlePlaylistSelect(playlists[0]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
     
     {/* top banner part */}
      <div className="relative bg-gradient-to-r from-slate-700 via-blue-600 to-slate-800 dark:from-black dark:via-blue-800 dark:to-black rounded-2xl p-6 md:p-8 mb-6 shadow-2xl overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

        <div className="relative z-10">
          {/* Breadcrumb Navigation */}
          <nav className="mb-4">
            <div className="flex items-center space-x-2 text-sm text-white/80">
              <span>Home</span>
              <span>/</span>
              <span>Videos</span>
              {selectedPlaylist && (
                <>
                  <span>/</span>
                  <span className="text-white font-medium cursor-pointer">{selectedPlaylist.title}</span>
                </>
              )}
            </div>
          </nav>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Professional Video Training Library
            </h1>
            <p className="text-white/90 max-w-2xl mx-auto text-base leading-relaxed">
              Master specialized engineering topics with our comprehensive collection of expert-led training videos.
            </p>
          </motion.div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center border border-white/20">
              <div className="text-xl font-bold text-white">{playlists.length}</div>
              <div className="text-xs text-white/80">Courses</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center border border-white/20">
              <div className="text-xl font-bold text-white">{sidebarVideos.length}</div>
              <div className="text-xs text-white/80">Videos</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center border border-white/20">
              <div className="text-xl font-bold text-white">
                {sidebarVideos.reduce((acc, video) => acc + (parseInt(video.views.replace(/,/g, '')) || 0), 0).toLocaleString()}
              </div>
              <div className="text-xs text-white/80">Total Views</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center border border-white/20">
              <div className="text-xl font-bold text-white">24/7</div>
              <div className="text-xs text-white/80">Access</div>
            </div>
          </div>
        </div>
      </div>

        {/* Playlist Selection */}
        {/* <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Choose Your Learning Path</h2>
          <p className="text-gray-600 dark:text-gray-300">Select a specialized course or browse all videos</p>
        </div> */}

     
   <div className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto mb-8">
          {playlists.map((pl) => (
            <motion.button
              key={pl.id}
              onClick={() => handlePlaylistSelect(pl)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 min-w-[280px] ${
                selectedPlaylist?.id === pl.id
                  ? "bg-gradient-to-br cursor-pointer from-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/25"
                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`text-4xl ${selectedPlaylist?.id === pl.id ? 'text-white' : 'text-blue-500'}`}>
                  {pl.icon}
                </div>
                <div className="text-left flex-1">
                  <h3 className={`font-bold text-lg mb-1 ${selectedPlaylist?.id === pl.id ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {pl.title}
                  </h3>
                  <p className={`text-sm ${selectedPlaylist?.id === pl.id ? 'text-blue-100' : 'text-gray-600 dark:text-gray-300'}`}>
                    Specialized engineering course
                  </p>
                </div>
              </div>

              {selectedPlaylist?.id === pl.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                >
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </motion.div>
              )}
            </motion.button>
          ))}

          <motion.button
            onClick={handleAllVideosSelect}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`group  relative overflow-hidden rounded-xl p-6 transition-all duration-300 min-w-[280px] ${
              !selectedPlaylist
                ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl shadow-green-500/25"
                : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-500"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`text-4xl ${!selectedPlaylist ? 'text-white' : 'text-green-500'}`}>
                📚
              </div>
              <div className="text-left flex-1">
                <h3 className={`font-bold text-lg mb-1 ${!selectedPlaylist ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  All Videos
                </h3>
                <p className={`text-sm ${!selectedPlaylist ? 'text-green-100' : 'text-gray-600 dark:text-gray-300'}`}>
                  Complete video collection
                </p>
              </div>
            </div>

            {!selectedPlaylist && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
              >
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </motion.div>
            )}
          </motion.button> 
        </div> 




        {/* Main Layout */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[600px]">
            {/* Main Player */}
            <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-900 p-6 lg:p-8">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl">
                    {selectedPlaylist ? selectedPlaylist.icon : "📚"}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedPlaylist ? selectedPlaylist.title : "All Videos"}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {sidebarVideos.length} videos • Professional training content
                    </p>
                  </div>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
              </div>

              {loading ? (
                <div className="space-y-4">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-video animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ) : (
                <MainVideoPlayer video={currentVideo} />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6 lg:p-8">
              <div className="sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Playlist
                  </h4>
                  <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    {sidebarVideos.length} videos
                  </div>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg animate-pulse">
                        <div className="w-16 h-9 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <PlaylistSidebar
                    videos={sidebarVideos}
                    currentVideoId={currentVideo?.videoId}
                    onSelectVideo={handleVideoSelect}
                    title=""
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLibraryPage;
