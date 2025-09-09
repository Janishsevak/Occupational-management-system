// src/redux/requestApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const requestApi = createApi({
  reducerPath: "requestApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api/v1/request`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Request","EditRequest"],
  endpoints: (builder) => ({
    // 🔹 Fetch Requests
    fetchRequests: builder.query({
      query: (origin) => ({
        url: `/fetchrequest`,
        headers:{"x-origin":origin}
      }),
      providesTags: ["Request"],
      transformResponse: (response) => response.requests,
    }),
    fetchEditRequests: builder.query({
      query: (origin) => ({
        url: `/fetcheditrequest`,
        headers:{"x-origin":origin}
      }),
      providesTags: ["EditRequest"],
      transformResponse: (response) => response.requests,
    }),

    // 🔹 Raise Request (POST)
    raiseRequest: builder.mutation({
      query: ({ model, recordId, reason, origin}) => ({
        url: `/deleterequest`,
        method: "POST",
        body: { model, recordId, reason},
        headers: { "x-origin": origin },
      }),
      invalidatesTags: ["Request",],

    }),
    editraiseRequest: builder.mutation({
      query: ({ model, recordId, reason, origin,changes }) => ({
        url: `/editrequest`,
        method: "POST",
        body: { model, recordId, reason,changes },
        headers: { "x-origin": origin },
      }),
      invalidatesTags: ["EditRequest"],

    }),

    // 🔹 Process Delete Request (Approve/Reject)
    processDeleteRequest: builder.mutation({
      query: ({ requestIds, action, origin }) => ({
        url: `/actiononrequest`,
        method: "PUT",
        body: { requestIds, action, origin },
      }),
      invalidatesTags: ["Request"],
    }),
    processEditRequest: builder.mutation({
      query:({requestId,action,origin})=>({
        url:`/actiononeditrequest`,
        method:"PUT",
        body:{requestId,action,origin}
      }),
      invalidatesTags:["EditRequest"]

    })
  }),
});

// ✅ Auto-generated hooks
export const {
  useFetchRequestsQuery,
  useFetchEditRequestsQuery,
  useRaiseRequestMutation,
  useProcessDeleteRequestMutation,
  useEditraiseRequestMutation,
  useProcessEditRequestMutation,
} = requestApi;
