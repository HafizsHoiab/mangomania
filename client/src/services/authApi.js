import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQueryWithReauth } from './baseQuery.js'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: createBaseQueryWithReauth('/api/auth'),
  endpoints: (builder) => ({
    register: builder.mutation({ query: (data) => ({ url: '/register', method: 'POST', body: data }) }),
    login: builder.mutation({ query: (data) => ({ url: '/login', method: 'POST', body: data }) }),
    logout: builder.mutation({ query: (data) => ({ url: '/logout', method: 'POST', body: data }) }),
    getMe: builder.query({ query: () => '/me' }),
    updateProfile: builder.mutation({ query: (data) => ({ url: '/update-profile', method: 'PUT', body: data }) }),
    changePassword: builder.mutation({ query: (data) => ({ url: '/change-password', method: 'PUT', body: data }) }),
    forgotPassword: builder.mutation({ query: (data) => ({ url: '/forgot-password', method: 'POST', body: data }) }),
    resetPassword: builder.mutation({ query: (data) => ({ url: '/reset-password', method: 'POST', body: data }) }),
    sendOTP: builder.mutation({ query: (data) => ({ url: '/send-otp', method: 'POST', body: data }) }),
    verifyOTP: builder.mutation({ query: (data) => ({ url: '/verify-otp', method: 'POST', body: data }) }),
  }),
})

export const {
  useRegisterMutation, useLoginMutation, useLogoutMutation,
  useGetMeQuery, useUpdateProfileMutation, useChangePasswordMutation,
  useForgotPasswordMutation, useResetPasswordMutation,
  useSendOTPMutation, useVerifyOTPMutation,
} = authApi
