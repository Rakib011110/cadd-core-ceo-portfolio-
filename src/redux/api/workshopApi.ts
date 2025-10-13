import baseApi from "../baseApi";

const workshopApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE - Create a new workshop
    createWorkshop: builder.mutation({
      query: (newWorkshop) => ({
        url: "/workshops",
        method: "POST",
        body: newWorkshop,
      }),
      invalidatesTags: ["Workshop"],
    }),

    // READ ALL - Get all workshops
    getWorkshops: builder.query({
      query: () => ({
        url: "/workshops",
        method: "GET",
      }),
      providesTags: ["Workshop"],
    }),

    // READ ONE - Get workshop by ID
    getWorkshop: builder.query({
      query: (id) => ({
        url: `/workshops/${id}`,
        method: "GET",
      }),
      providesTags: ["Workshop"],
    }),

    // READ ONE BY SLUG - Get workshop by slug
    getWorkshopBySlug: builder.query({
      query: (slug) => ({
        url: `/workshops/slug/${slug}`,
        method: "GET",
      }),
      providesTags: ["Workshop"],
    }),

    // GET AVAILABLE WORKSHOPS
    getAvailableWorkshops: builder.query({
      query: () => ({
        url: "/workshops/available",
        method: "GET",
      }),
      providesTags: ["Workshop"],
    }),

    // GET WORKSHOPS BY CATEGORY
    getWorkshopsByCategory: builder.query({
      query: (category) => ({
        url: `/workshops/category/${category}`,
        method: "GET",
      }),
      providesTags: ["Workshop"],
    }),

    // GET WORKSHOPS BY LEVEL
    getWorkshopsByLevel: builder.query({
      query: (level) => ({
        url: `/workshops/level/${level}`,
        method: "GET",
      }),
      providesTags: ["Workshop"],
    }),

    // UPDATE - Update workshop by ID
    updateWorkshop: builder.mutation({
      query: ({ id, ...workshop }) => ({
        url: `/workshops/${id}`,
        method: "PATCH",
        body: workshop,
      }),
      invalidatesTags: ["Workshop"],
    }),

    // UPDATE BY SLUG - Update workshop by slug
    updateWorkshopBySlug: builder.mutation({
      query: ({ slug, ...workshop }) => ({
        url: `/workshops/slug/${slug}`,
        method: "PATCH",
        body: workshop,
      }),
      invalidatesTags: ["Workshop"],
    }),

    // DELETE - Delete workshop by ID
    deleteWorkshop: builder.mutation({
      query: (id) => ({
        url: `/workshops/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Workshop"],
    }),

    // DELETE BY SLUG - Delete workshop by slug
    deleteWorkshopBySlug: builder.mutation({
      query: (slug) => ({
        url: `/workshops/slug/${slug}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Workshop"],
    }),

    // INCREMENT PARTICIPANTS - Add a participant
    incrementParticipants: builder.mutation({
      query: (id) => ({
        url: `/workshops/${id}/participants/increment`,
        method: "PATCH",
      }),
      invalidatesTags: ["Workshop"],
    }),

    // DECREMENT PARTICIPANTS - Remove a participant
    decrementParticipants: builder.mutation({
      query: (id) => ({
        url: `/workshops/${id}/participants/decrement`,
        method: "PATCH",
      }),
      invalidatesTags: ["Workshop"],
    }),
  }),
});

export const {
  // Mutations
  useCreateWorkshopMutation,
  useUpdateWorkshopMutation,
  useUpdateWorkshopBySlugMutation,
  useDeleteWorkshopMutation,
  useDeleteWorkshopBySlugMutation,
  useIncrementParticipantsMutation,
  useDecrementParticipantsMutation,

  // Queries
  useGetWorkshopsQuery,
  useGetWorkshopQuery,
  useGetWorkshopBySlugQuery,
  useGetAvailableWorkshopsQuery,
  useGetWorkshopsByCategoryQuery,
  useGetWorkshopsByLevelQuery,
} = workshopApi;

export default workshopApi;
   