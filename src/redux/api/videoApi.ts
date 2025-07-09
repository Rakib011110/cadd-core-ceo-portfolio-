import baseApi from "../baseApi";

const videoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE
    createVideo: builder.mutation({
      query: (data) => ({
        url: "/videos/upload-video",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Video"],
    }),

    // READ ALL
    getVideos: builder.query({
      query: () => ({
        url: "/videos",
        method: "GET",
      }),
      providesTags: ["Video"],
    }),

    // READ ONE
    getVideo: builder.query({
      query: (id) => ({
        url: `/videos/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Video", id }],
    }),

    // UPDATE
    updateVideo: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/videos/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["Video", { type: "Video", id }],
    }),

    // DELETE
    deleteVideo: builder.mutation({
      query: (id) => ({
        url: `/videos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => ["Video", { type: "Video", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateVideoMutation,
  useGetVideosQuery,
  useGetVideoQuery,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
} = videoApi;

export default videoApi;
