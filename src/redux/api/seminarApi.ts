import baseApi from "../baseApi";

const seminarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE
    createSeminar: builder.mutation({
      query: (data) => ({
        url: "/seminar",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Seminar"],
    }),

    // READ ALL
    getSeminars: builder.query({
      query: () => ({
        url: "/seminar",
        method: "GET",
      }),
      providesTags: ["Seminar"],
    }),

    // READ ONE
    getSeminar: builder.query({
      query: (id) => ({
        url: `/seminar/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Seminar", id }],
    }),

    // UPDATE
    updateSeminar: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/seminar/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["Seminar", { type: "Seminar", id }],
    }),

    // DELETE
    deleteSeminar: builder.mutation({
      query: (id) => ({
        url: `/seminar/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => ["Seminar", { type: "Seminar", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateSeminarMutation,
  useGetSeminarsQuery,
  useGetSeminarQuery,
  useUpdateSeminarMutation,
  useDeleteSeminarMutation,
} = seminarApi;

export default seminarApi;