import { formatPrice } from '../../utils/formatPrice.js'
import { formatDate } from '../../utils/formatDate.js'
import { getOrderStatusColor, getPaymentStatusColor, generateOrderId } from '../../utils/helpers.js'

export default function OrdersTable({ orders = [], onView }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3 font-mono font-semibold text-dark">{generateOrderId(order._id)}</td>
              <td className="px-4 py-3">
                <p className="font-medium text-dark">{order.user?.name}</p>
                <p className="text-gray-400 text-xs">{order.user?.phone}</p>
              </td>
              <td className="px-4 py-3 text-gray-600">{order.items?.length} item(s)</td>
              <td className="px-4 py-3 font-semibold text-dark">{formatPrice(order.totalAmount)}</td>
              <td className="px-4 py-3">
                <span className={`badge ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentMethod?.toUpperCase()} · {order.paymentStatus}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`badge ${getOrderStatusColor(order.orderStatus)}`}>{order.orderStatus}</span>
              </td>
              <td className="px-4 py-3 text-gray-500">{formatDate(order.createdAt)}</td>
              <td className="px-4 py-3">
                <button onClick={() => onView(order)} className="text-mango hover:underline text-xs font-semibold">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!orders.length && <p className="text-center text-gray-400 py-10">No orders found</p>}
    </div>
  )
}
