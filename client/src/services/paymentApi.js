import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQueryWithReauth } from './baseQuery.js'

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: createBaseQueryWithReauth('/api/payments'),
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
