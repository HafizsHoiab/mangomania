import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken
      if (token) headers.set('authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Product', 'Category'],
  endpoints: (builder) => ({
    getProducts: builder.query({ query: (params = '') => `/products?${params}`, providesTags: ['Product'] }),
    getProductBySlug: builder.query({ query: (slug) => `/products/${slug}`, providesTags: ['Product'] }),
    getFeaturedProducts: builder.query({ query: () => '/products/featured', providesTags: ['Product'] }),
    getProductsByCategory: builder.query({ query: (slug) => `/products/category/${slug}`, providesTags: ['Product'] }),
    getCategories: builder.query({ query: () => '/categories', providesTags: ['Category'] }),
    createProduct: builder.mutation({ query: (data) => ({ url: '/products', method: 'POST', body: data }), invalidatesTags: ['Product'] }),
    updateProduct: builder.mutation({ query: ({ id, ...data }) => ({ url: `/products/${id}`, method: 'PUT', body: data }), invalidatesTags: ['Product'] }),
    deleteProduct: builder.mutation({ query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }), invalidatesTags: ['Product'] }),
  }),
})

export const {
  useGetProductsQuery, useGetProductBySlugQuery, useGetFeaturedProductsQuery,
  useGetProductsByCategoryQuery, useGetCategoriesQuery,
  useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation,
} = productApi
