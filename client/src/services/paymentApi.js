import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/payments',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken
      if (token) headers.set('authorization', `Bearer ${token}`)
      return headers
    },
  }),
  endpoints: (builder) => ({
    initiateJazzCash: builder.mutation({
      query: (data) => ({ url: '/jazzcash', method: 'POST', body: data }),
    }),
    initiateEasyPaisa: builder.mutation({
      query: (data) => ({ url: '/easypaisa', method: 'POST', body: data }),
    }),
    verifyPayment: builder.mutation({
      query: (data) => ({ url: '/verify', method: 'POST', body: data }),
    }),
  }),
})

export const {
  useInitiateJazzCashMutation,
  useInitiateEasyPaisaMutation,
  useVerifyPaymentMutation,
} = paymentApi
