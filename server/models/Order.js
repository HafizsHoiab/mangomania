const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  variant: String,
});

const shippingAddressSchema = new mongoose.Schema({
  name: String,
  phone: String,
  street: String,
  city: String,
  province: String,
  postalCode: String,
  notes: String,
});

const statusHistorySchema = new mongoose.Schema({
  status: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  // Guest order fields (used when user is not logged in)
  guestName: String,
  guestPhone: String,
  guestEmail: String,
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  paymentMethod: {
    type: String,
    enum: ['jazzcash', 'easypaisa', 'card', 'cod'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  orderStatus: {
    type: String,
    enum: ['pre_order', 'pending', 'confirmed', 'packed', 'dispatched', 'delivered', 'cancelled'],
    default: 'pending',
  },
  isPreOrder: { type: Boolean, default: false },
  totalAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  deliveryCharge: { type: Number, default: 0 },
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  couponCode: String,
  trackingId: String,
  rider: {
    name: String,
    phone: String,
  },
  statusHistory: [statusHistorySchema],
  paymentTransactionId: String,
  stripePaymentIntentId: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
