import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/orders',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken
      if (token) headers.set('authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    placeOrder: builder.mutation({ query: (data) => ({ url: '/', method: 'POST', body: data }), invalidatesTags: ['Order'] }),
    getMyOrders: builder.query({ query: (params = '') => `/my-orders?${params}`, providesTags: ['Order'] }),
    getOrderById: builder.query({ query: (id) => `/${id}`, providesTags: ['Order'] }),
    cancelOrder: builder.mutation({ query: (id) => ({ url: `/${id}/cancel`, method: 'PUT' }), invalidatesTags: ['Order'] }),
    getAllOrders: builder.query({ query: (params = '') => `/?${params}`, providesTags: ['Order'] }),
    updateOrderStatus: builder.mutation({ query: ({ id, ...data }) => ({ url: `/${id}/status`, method: 'PUT', body: data }), invalidatesTags: ['Order'] }),
    assignRider: builder.mutation({ query: ({ id, ...data }) => ({ url: `/${id}/rider`, method: 'PUT', body: data }), invalidatesTags: ['Order'] }),
  }),
})

export const {
  usePlaceOrderMutation, useGetMyOrdersQuery, useGetOrderByIdQuery,
  useCancelOrderMutation, useGetAllOrdersQuery,
  useUpdateOrderStatusMutation, useAssignRiderMutation,
} = orderApi
