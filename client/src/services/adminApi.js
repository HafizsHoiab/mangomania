import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQueryWithReauth } from './baseQuery.js'

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: createBaseQueryWithReauth('/api'),
  tagTypes: ['AdminStats', 'AdminUsers', 'Coupon'],
  endpoints: (builder) => ({
    getDashboard: builder.query({ query: () => '/admin/dashboard', providesTags: ['AdminStats'] }),
    getAnalytics: builder.query({ query: (period = 'weekly') => `/admin/analytics?period=${period}`, providesTags: ['AdminStats'] }),
    getAdminUsers: builder.query({ query: (params = '') => `/admin/users?${params}`, providesTags: ['AdminUsers'] }),
    blockUser: builder.mutation({ query: (id) => ({ url: `/admin/users/${id}/block`, method: 'PUT' }), invalidatesTags: ['AdminUsers'] }),
    getCoupons: builder.query({ query: () => '/coupons', providesTags: ['Coupon'] }),
    createCoupon: builder.mutation({ query: (data) => ({ url: '/coupons', method: 'POST', body: data }), invalidatesTags: ['Coupon'] }),
    updateCoupon: builder.mutation({ query: ({ id, ...data }) => ({ url: `/coupons/${id}`, method: 'PUT', body: data }), invalidatesTags: ['Coupon'] }),
    deleteCoupon: builder.mutation({ query: (id) => ({ url: `/coupons/${id}`, method: 'DELETE' }), invalidatesTags: ['Coupon'] }),
    validateCoupon: builder.mutation({ query: (data) => ({ url: '/coupons/validate', method: 'POST', body: data }) }),
    uploadImage: builder.mutation({ query: (formData) => ({ url: '/upload/image', method: 'POST', body: formData }) }),
    uploadImages: builder.mutation({ query: (formData) => ({ url: '/upload/images', method: 'POST', body: formData }) }),
  }),
})

export const {
  useGetDashboardQuery, useGetAnalyticsQuery, useGetAdminUsersQuery,
  useBlockUserMutation, useGetCouponsQuery, useCreateCouponMutation,
  useUpdateCouponMutation, useDeleteCouponMutation, useValidateCouponMutation,
  useUploadImageMutation, useUploadImagesMutation,
} = adminApi
