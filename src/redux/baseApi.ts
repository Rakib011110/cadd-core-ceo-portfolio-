import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// aaa
const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    // baseUrl: "https://engrhachnayenahdmed-api.vercel.app/api",
  }),
  tagTypes: ["Course", "Blog", "Seminar", "Video", "User", "Workshop"],
  endpoints: () => ({}),
});

export default baseApi;
