import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: JSON.parse(localStorage.getItem('mangoCart') || '[]'),
  isOpen: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { product, qty = 1, variant } = action.payload
      const existing = state.items.find(i => i.product._id === product._id && i.variant === variant)
      if (existing) {
        existing.qty += qty
      } else {
        state.items.push({ product, qty, variant, price: product.salePrice || product.price })
      }
      localStorage.setItem('mangoCart', JSON.stringify(state.items))
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(
        i => !(i.product._id === action.payload.productId && i.variant === action.payload.variant)
      )
      localStorage.setItem('mangoCart', JSON.stringify(state.items))
    },
    updateQty: (state, action) => {
      const { productId, variant, qty } = action.payload
      const item = state.items.find(i => i.product._id === productId && i.variant === variant)
      if (item) item.qty = qty
      localStorage.setItem('mangoCart', JSON.stringify(state.items))
    },
    clearCart: (state) => {
      state.items = []
      localStorage.removeItem('mangoCart')
    },
    toggleCart: (state) => { state.isOpen = !state.isOpen },
    setCartItems: (state, action) => {
      state.items = action.payload
      localStorage.setItem('mangoCart', JSON.stringify(state.items))
    },
  },
})

export const { addItem, removeItem, updateQty, clearCart, toggleCart, setCartItems } = cartSlice.actions
export default cartSlice.reducer
