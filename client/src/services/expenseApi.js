import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQueryWithReauth } from './baseQuery.js'

export const expenseApi = createApi({
  reducerPath: 'expenseApi',
  baseQuery: createBaseQueryWithReauth('/api/expenses'),
  tagTypes: ['Expense'],
  endpoints: (builder) => ({
    getExpenses: builder.query({ query: (params = '') => `/?${params}`, providesTags: ['Expense'] }),
    getExpenseSummary: builder.query({ query: () => '/summary', providesTags: ['Expense'] }),
    addExpense: builder.mutation({ query: (data) => ({ url: '/', method: 'POST', body: data }), invalidatesTags: ['Expense'] }),
    deleteExpense: builder.mutation({ query: (id) => ({ url: `/${id}`, method: 'DELETE' }), invalidatesTags: ['Expense'] }),
  }),
})

export const { useGetExpensesQuery, useGetExpenseSummaryQuery, useAddExpenseMutation, useDeleteExpenseMutation } = expenseApi
