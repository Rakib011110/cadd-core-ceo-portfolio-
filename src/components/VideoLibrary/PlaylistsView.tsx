import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, AlertCircle, Video } from "lucide-react";
import type { Playlist, VideoItem } from "./constants";
import { playlists, API_KEY, VIDEOS_PER_PAGE_PLAYLIST } from "./constants";
import LoadingSkeleton from "./LoadingSkeleton";
import VideoCard from "./VideoCard";

interface YouTubePlaylistItem {
  id: string;
  snippet: {
    title: string;
    publishedAt: string;
    resourceId: {
      videoId: string;
    };
    thumbnails: {
      high?: { url: string };
      medium?: { url: string };
    };
  };
}

interface YouTubeVideoDetail {
  id: string;
  statistics?: { viewCount?: string };
  contentDetails?: { duration?: string };
}

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } };

const PlaylistsView: React.FC<{ onVideoSelect: (v: VideoItem) => void }> = ({ onVideoSelect }) => {
  const [expandedPlaylist, setExpandedPlaylist] = useState<string | null>(playlists[0]?.id || null);
  const [videosByPlaylist, setVideosByPlaylist] = useState<Record<string, VideoItem[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string | null>>({});
  const [pages, setPages] = useState<Record<string, number>>({});

  const fetchPlaylist = useCallback(async (plId: string) => {
    if (videosByPlaylist[plId]) return;
    setLoading((s) => ({ ...s, [plId]: true }));
    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${plId}&key=${API_KEY}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const videoIds = data.items.map((it: YouTubePlaylistItem) => it.snippet.resourceId.videoId).filter(Boolean);
      let detailsMap = new Map<string, YouTubeVideoDetail>();
      if (videoIds.length) {
        const detRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds.join(",")}&key=${API_KEY}`);
        const detJson = await detRes.json();
        detailsMap = new Map(detJson.items.map((it: YouTubeVideoDetail) => [it.id, it]));
      }
      const videos: VideoItem[] = data.items.map((it: YouTubePlaylistItem) => {
        const vid = it.snippet.resourceId.videoId;
        const det = detailsMap.get(vid);
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
      setVideosByPlaylist((p) => ({ ...p, [plId]: videos }));
      setPages((p) => ({ ...p, [plId]: 1 }));
    } catch (err: unknown) {
      setError((e) => ({ ...e, [plId]: err instanceof Error ? err.message : "Failed" }));
    } finally {
      setLoading((s) => ({ ...s, [plId]: false }));
    }
  }, [videosByPlaylist]);

  useEffect(() => {
    if (expandedPlaylist) fetchPlaylist(expandedPlaylist);
  }, [expandedPlaylist, fetchPlaylist]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {playlists.map((pl: Playlist) => {
        const isExpanded = expandedPlaylist === pl.id;
        const vids = videosByPlaylist[pl.id] || [];
        const isLoading = loading[pl.id];
        const err = error[pl.id];
        const currentPage = pages[pl.id] || 1;
        const total = Math.max(1, Math.ceil(vids.length / VIDEOS_PER_PAGE_PLAYLIST));
        const start = (currentPage - 1) * VIDEOS_PER_PAGE_PLAYLIST;
        const pageVideos = vids.slice(start, start + VIDEOS_PER_PAGE_PLAYLIST);

        return (
          <motion.div key={pl.id} variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-0 overflow-hidden">
            <button onClick={() => setExpandedPlaylist((s) => (s === pl.id ? null : pl.id))} className="w-full text-left p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{pl.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{pl.title}</h3>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {vids.length > 0 && <div className="hidden sm:flex items-center text-sm text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"><Video className="mr-2" />{vids.length} Videos</div>}
                <ChevronDown className={`transform ${isExpanded ? "rotate-180" : ""}`} />
              </div>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-5 pb-5">
                  {isLoading ? (
                    <LoadingSkeleton count={VIDEOS_PER_PAGE_PLAYLIST} />
                  ) : err ? (
                    <div className="py-8 text-center text-red-500"><AlertCircle className="mx-auto mb-2" />{err}</div>
                  ) : pageVideos.length ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pageVideos.map((v) => <VideoCard key={v.id} video={v} onPlay={onVideoSelect} />)}
                      </div>
                      {total > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-6">
                          <button onClick={() => setPages((p) => ({ ...p, [pl.id]: Math.max(1, (p[pl.id] || 1) - 1) }))} disabled={currentPage === 1} className="p-2 rounded-full"> <ChevronLeft /> </button>
                          <div>Page {currentPage} of {total}</div>
                          <button onClick={() => setPages((p) => ({ ...p, [pl.id]: Math.min(total, (p[pl.id] || 1) + 1) }))} disabled={currentPage === total} className="p-2 rounded-full"> <ChevronRight /> </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="py-8 text-center text-gray-500">No videos found.</div>
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

export default PlaylistsView;
