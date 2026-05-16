import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/reviews',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken
      if (token) headers.set('authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Review'],
  endpoints: (builder) => ({
    getProductReviews: builder.query({ query: (productId) => `/${productId}`, providesTags: ['Review'] }),
    createReview: builder.mutation({ query: ({ productId, ...data }) => ({ url: `/${productId}`, method: 'POST', body: data }), invalidatesTags: ['Review'] }),
    getPendingReviews: builder.query({ query: () => '/pending', providesTags: ['Review'] }),
    approveReview: builder.mutation({ query: (id) => ({ url: `/${id}/approve`, method: 'PUT' }), invalidatesTags: ['Review'] }),
    deleteReview: builder.mutation({ query: (id) => ({ url: `/${id}`, method: 'DELETE' }), invalidatesTags: ['Review'] }),
  }),
})

export const {
  useGetProductReviewsQuery, useCreateReviewMutation,
  useGetPendingReviewsQuery, useApproveReviewMutation, useDeleteReviewMutation,
} = reviewApi
