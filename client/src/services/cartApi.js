import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQueryWithReauth } from './baseQuery.js'

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: createBaseQueryWithReauth('/api/cart'),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    getCart: builder.query({ query: () => '/', providesTags: ['Cart'] }),
    addToCart: builder.mutation({ query: (data) => ({ url: '/add', method: 'POST', body: data }), invalidatesTags: ['Cart'] }),
    updateCart: builder.mutation({ query: (data) => ({ url: '/update', method: 'PUT', body: data }), invalidatesTags: ['Cart'] }),
    removeFromCart: builder.mutation({ query: (productId) => ({ url: `/remove/${productId}`, method: 'DELETE' }), invalidatesTags: ['Cart'] }),
    clearCart: builder.mutation({ query: () => ({ url: '/clear', method: 'DELETE' }), invalidatesTags: ['Cart'] }),
  }),
})

export const {
  useGetCartQuery, useAddToCartMutation, useUpdateCartMutation,
  useRemoveFromCartMutation, useClearCartMutation,
} = cartApi
