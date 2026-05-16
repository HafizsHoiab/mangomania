import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQueryWithReauth } from './baseQuery.js'

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: createBaseQueryWithReauth('/api/reviews'),
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
