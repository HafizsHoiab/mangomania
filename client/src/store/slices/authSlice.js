import { createSlice } from '@reduxjs/toolkit'

const userFromStorage = localStorage.getItem('mangoUser')
  ? JSON.parse(localStorage.getItem('mangoUser'))
  : null

const initialState = {
  user: userFromStorage,
  accessToken: localStorage.getItem('mangoAccessToken') || null,
  refreshToken: localStorage.getItem('mangoRefreshToken') || null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload
      state.user = user
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      localStorage.setItem('mangoUser', JSON.stringify(user))
      localStorage.setItem('mangoAccessToken', accessToken)
      if (refreshToken) localStorage.setItem('mangoRefreshToken', refreshToken)
    },
    logout: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      localStorage.removeItem('mangoUser')
      localStorage.removeItem('mangoAccessToken')
      localStorage.removeItem('mangoRefreshToken')
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem('mangoUser', JSON.stringify(state.user))
    },
  },
})

export const { setCredentials, logout, updateUser } = authSlice.actions
export default authSlice.reducer
