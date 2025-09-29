import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import type { VideoItem } from "./constants";
import { playlists, API_KEY, VIDEOS_PER_PAGE_ALL } from "./constants";
import LoadingSkeleton from "./LoadingSkeleton";
import VideoCard from "./VideoCard";

interface YouTubePlaylistItem {
  snippet: {
    title: string;
    publishedAt: string;
    thumbnails: {
      high?: { url: string };
      medium?: { url: string };
    };
    resourceId: {
      videoId: string;
    };
  };
  id: string;
}

interface YouTubeVideoDetails {
  id: string;
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
  };
}

const AllVideosView: React.FC<{ onVideoSelect: (v: VideoItem) => void }> = ({ onVideoSelect }) => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const allItems: YouTubePlaylistItem[] = [];
        for (const pl of playlists) {
          const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${pl.id}&key=${API_KEY}`);
          const json = await res.json();
          if (json.error) throw new Error(json.error.message);
          allItems.push(...(json.items || []));
        }

        const ids = allItems.map((i) => i.snippet.resourceId.videoId).filter(Boolean);
        const detailsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${ids.join(",")}&key=${API_KEY}`);
        const detailsJson = await detailsRes.json();
        const detailsMap = new Map<string, YouTubeVideoDetails>(detailsJson.items.map((it: YouTubeVideoDetails) => [it.id, it]));

        const formatted = allItems.map((it) => {
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
          } as VideoItem;
        });
        setVideos(formatted);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load videos");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const totalPages = Math.max(1, Math.ceil(videos.length / VIDEOS_PER_PAGE_ALL));
  const pageVideos = videos.slice((page - 1) * VIDEOS_PER_PAGE_ALL, page * VIDEOS_PER_PAGE_ALL);

  if (loading) return <LoadingSkeleton count={VIDEOS_PER_PAGE_ALL} />;
  if (error) return <div className="text-center py-8 text-red-500"><AlertCircle className="mx-auto mb-2" />{error}</div>;

  return (
    <div>
      {pageVideos.length ? (
        <>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageVideos.map((v) => <VideoCard key={v.id} video={v} onPlay={onVideoSelect} />)}
          </motion.div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-full"><ChevronLeft /></button>
              <div>Page {page} of {totalPages}</div>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-full"><ChevronRight /></button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">No videos available.</div>
      )}
    </div>
  );
};

export default AllVideosView;
