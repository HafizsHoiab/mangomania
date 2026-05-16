import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice.js'
import cartReducer from './slices/cartSlice.js'
import wishlistReducer from './slices/wishlistSlice.js'
import { authApi } from '../services/authApi.js'
import { productApi } from '../services/productApi.js'
import { orderApi } from '../services/orderApi.js'
import { cartApi } from '../services/cartApi.js'
import { reviewApi } from '../services/reviewApi.js'
import { adminApi } from '../services/adminApi.js'
import { paymentApi } from '../services/paymentApi.js'

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      productApi.middleware,
      orderApi.middleware,
      cartApi.middleware,
      reviewApi.middleware,
      adminApi.middleware,
      paymentApi.middleware,
    ),
})

export default store
