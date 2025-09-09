// src/redux/injuryApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const injuryApi = createApi({
  reducerPath: "injuryApi", // unique name for reducer
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api/v1/injurydata`,
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");

      // Example: if your endpoint needs x-origin, pass it as arg
      // and set it here dynamically
      return headers;
    },
  }),
  tagTypes: ["Injury"], // for auto cache invalidation
  endpoints: (builder) => ({
    // GET all injuries
    fetchInjuries: builder.query({
      query: (origin) => ({
        url: `/injurydata`,
        headers: { "x-origin": origin },
      }),
      providesTags: ["Injury"],
      transformResponse: (response) => response.entries, // same as your thunk
    }),

    // ADD new injury
    addInjury: builder.mutation({
      query: ({ formData, origin }) => ({
        url: `/injuryentry`,
        method: "POST",
        body: formData,
        headers: { "x-origin": origin },
      }),
      invalidatesTags: ["Injury"], // refetch injuries list after add
    }),

    // UPDATE injury
    updateInjury: builder.mutation({
      query: ({ idToupdate, formData, origin }) => ({
        url: `/updateinjurydata/${idToupdate}`,
        method: "PUT",
        body: formData,
        headers: { "x-origin": origin },
      }),
      invalidatesTags: ["Injury"], // refresh cache
    }),

    // DELETE injury
    deleteInjury: builder.mutation({
      query: ({ idTodelete, origin }) => ({
        url: `/deleteinjurydata/${idTodelete}`,
        method: "DELETE",
        headers: { "x-origin": origin },
      }),
      invalidatesTags: ["Injury"], // refresh list after delete
    }),
  }),
});

// ✅ Auto-generated hooks
export const {
  useFetchInjuriesQuery,
  useAddInjuryMutation,
  useUpdateInjuryMutation,
  useDeleteInjuryMutation,
} = injuryApi;
