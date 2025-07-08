import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// aaa
const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5000/api",
    baseUrl: "https://engrhachnayenahdmed-c6pbsk0ek-rakib011110s-projects.vercel.app/api",
  }),
  tagTypes: ["Course", "Blog", "Seminar"],
  endpoints: () => ({}),
});

export default baseApi;
