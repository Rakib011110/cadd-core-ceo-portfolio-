import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// aaa
const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://engrhachnayenahdmed-api.vercel.app/api",
  }),
  tagTypes: ["Course", "Blog"],
  endpoints: () => ({}),
});

export default baseApi;
