import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, logout } from '../store/slices/authSlice.js'

/**
 * Creates a fetchBaseQuery with auth header injection.
 */
export const createBaseQuery = (baseUrl) =>
  fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken
      if (token) headers.set('authorization', `Bearer ${token}`)
      return headers
    },
  })

/**
 * Wraps a baseQuery with automatic token refresh on 401.
 * If the original request fails with 401 (token expired), it:
 *   1. Calls /api/auth/refresh-token with the stored refresh token
 *   2. Saves the new access token to Redux + localStorage
 *   3. Retries the original request once
 *   4. If refresh also fails, logs the user out
 */
export const createBaseQueryWithReauth = (baseUrl) => {
  const baseQuery = createBaseQuery(baseUrl)

  return async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.status === 401) {
      const { auth } = api.getState()
      const storedRefreshToken = auth.refreshToken || localStorage.getItem('mangoRefreshToken')

      if (storedRefreshToken) {
        // Try to get a new access token
        const refreshResult = await fetch('/api/auth/refresh-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: storedRefreshToken }),
        })

        if (refreshResult.ok) {
          const refreshData = await refreshResult.json()
          const { accessToken, refreshToken: newRefreshToken, user } = refreshData.data

          // Save the new tokens
          api.dispatch(
            setCredentials({
              user: user || auth.user,
              accessToken,
              refreshToken: newRefreshToken || storedRefreshToken,
            })
          )

          // Retry the original request with the new token
          result = await baseQuery(args, api, extraOptions)
        } else {
          // Refresh failed — log out
          api.dispatch(logout())
        }
      } else {
        // No refresh token available — log out
        api.dispatch(logout())
      }
    }

    return result
  }
}
