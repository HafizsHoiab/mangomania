export const getOrderStatusColor = (status) => {
  const colors = {
    pre_order: 'bg-amber-100 text-amber-800',
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    packed: 'bg-purple-100 text-purple-800',
    dispatched: 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const getPaymentStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-blue-100 text-blue-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const truncate = (str, n = 80) => str && str.length > n ? str.slice(0, n) + '...' : str
export const generateOrderId = (id) => id ? `#${id.toString().slice(-8).toUpperCase()}` : ''

export const DELIVERY_CHARGE = 200
export const FREE_DELIVERY_THRESHOLD = 3000
export const calcDelivery = (subtotal) => subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE
