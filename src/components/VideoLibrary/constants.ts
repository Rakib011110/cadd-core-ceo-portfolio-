// VideoLibrary constants and types

export interface VideoItem {
  id: string;
  title: string;
  videoId: string;
  uploadDate: string;
  views: string;
  duration: string;
  thumbnail: string;
}

export interface Playlist {
  id: string;
  title: string;
  icon: string;
}

export const playlists: Playlist[] = [
  {
    id: "PLTUWmhRt6CDvQmcMb_FZX7lcx-9Z3HTVT",
    title: "Structural Detailing BNBC 2020 , ACI 318-19",
    icon: "🏗️",
  },
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

export const API_KEY = "AIzaSyBB2kiCQoB4fEt7ZPFxR0xUlRQAcIONrCk";
export const VIDEOS_PER_PAGE_PLAYLIST = 3;
export const VIDEOS_PER_PAGE_ALL = 9;
