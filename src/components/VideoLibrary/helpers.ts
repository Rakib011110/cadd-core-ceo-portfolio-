// Helper functions for VideoLibrary

export const parseDuration = (isoDuration: string): string => {
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

export const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
