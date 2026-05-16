import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQueryWithReauth } from './baseQuery.js'

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: createBaseQueryWithReauth('/api/orders'),
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
