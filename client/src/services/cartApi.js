import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/cart',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken
      if (token) headers.set('authorization', `Bearer ${token}`)
      return headers
    },
  }),
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
