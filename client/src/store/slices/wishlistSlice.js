import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: JSON.parse(localStorage.getItem('mangoWishlist') || '[]'),
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload
      const exists = state.items.find(i => i._id === product._id)
      if (exists) {
        state.items = state.items.filter(i => i._id !== product._id)
      } else {
        state.items.push(product)
      }
      localStorage.setItem('mangoWishlist', JSON.stringify(state.items))
    },
    clearWishlist: (state) => {
      state.items = []
      localStorage.removeItem('mangoWishlist')
    },
  },
})

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
