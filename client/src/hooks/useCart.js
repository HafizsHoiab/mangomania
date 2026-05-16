import { useSelector, useDispatch } from 'react-redux'
import { addItem, removeItem, updateQty, clearCart } from '../store/slices/cartSlice.js'

export const useCart = () => {
  const dispatch = useDispatch()
  const { items } = useSelector((state) => state.cart)

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0)
  const totalItems = items.reduce((acc, item) => acc + item.qty, 0)

  return {
    items,
    subtotal,
    totalItems,
    addToCart: (product, qty, variant) => dispatch(addItem({ product, qty, variant })),
    removeFromCart: (productId, variant) => dispatch(removeItem({ productId, variant })),
    updateQuantity: (productId, variant, qty) => dispatch(updateQty({ productId, variant, qty })),
    clearAllCart: () => dispatch(clearCart()),
  }
}
