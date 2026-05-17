const crypto = require('crypto');
const Order = require('../models/Order');
let stripe;
try { stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); } catch(e) {}

const generateJazzCashHash = (params, integrityKey) => {
  const sortedKeys = Object.keys(params).sort();
  const hashString = integrityKey + '&' + sortedKeys.map((k) => params[k]).join('&');
  return crypto.createHmac('sha256', integrityKey).update(hashString).digest('hex').toUpperCase();
};

exports.initiateJazzCash = async (req, res, next) => {
  try {
    const { orderId, amount, mobileNumber } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Format datetime as YYYYMMDDHHmmss (local PKT = UTC+5)
    const now = new Date(Date.now() + 5 * 60 * 60 * 1000); // shift to PKT
    const pad = (n) => String(n).padStart(2, '0');
    const dateTime =
      now.getUTCFullYear().toString() +
      pad(now.getUTCMonth() + 1) +
      pad(now.getUTCDate()) +
      pad(now.getUTCHours()) +
      pad(now.getUTCMinutes()) +
      pad(now.getUTCSeconds());

    const expiry = new Date(Date.now() + 5 * 60 * 60 * 1000 + 3600000);
    const expiryDate =
      expiry.getUTCFullYear().toString() +
      pad(expiry.getUTCMonth() + 1) +
      pad(expiry.getUTCDate()) +
      pad(expiry.getUTCHours()) +
      pad(expiry.getUTCMinutes()) +
      pad(expiry.getUTCSeconds());

    const txnRefNo = `T${dateTime}`;
    const amountInPaisa = Math.round(amount * 100).toString();

    const isSandbox = process.env.JAZZCASH_ENV !== 'live';
    const postURL = isSandbox
      ? 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/'
      : 'https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/';

    const clientURL = process.env.CLIENT_URL || 'https://mangomania.co';

    const serverURL = process.env.SERVER_URL || 'https://mangomania-production.up.railway.app';

    // MWALLET params — do NOT include pp_BankID or pp_ProductID (those are for bank txns only)
    const params = {
      pp_Version: '1.1',
      pp_TxnType: 'MWALLET',
      pp_Language: 'EN',
      pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID,
      pp_SubMerchantID: '',
      pp_Password: process.env.JAZZCASH_PASSWORD,
      pp_TxnRefNo: txnRefNo,
      pp_Amount: amountInPaisa,
      pp_TxnCurrency: 'PKR',
      pp_TxnDateTime: dateTime,
      pp_BillReference: `ORD-${orderId.toString().slice(-8)}`,
      pp_Description: 'Mango Mania Order',
      pp_TxnExpiryDateTime: expiryDate,
      pp_ReturnURL: `${serverURL}/api/payments/jazzcash/return`,
      pp_MobileNumber: mobileNumber,
    };

    params.pp_SecureHash = generateJazzCashHash(params, process.env.JAZZCASH_INTEGRITY_SALT);

    order.paymentTransactionId = txnRefNo;
    await order.save();

    console.log('JazzCash params:', JSON.stringify(params, null, 2));
    console.log('JazzCash postURL:', postURL);

    res.json({
      success: true,
      data: { params, postURL },
    });
  } catch (error) {
    next(error);
  }
};

exports.initiateEasyPaisa = async (req, res, next) => {
  try {
    const { orderId, amount, accountNumber } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const transactionId = `EP${Date.now()}`;
    order.paymentTransactionId = transactionId;
    order.paymentStatus = 'pending';
    await order.save();

    res.json({
      success: true,
      data: {
        transactionId,
        storeId: process.env.EASYPAISA_STORE_ID,
        amount,
        accountNumber,
        message: 'EasyPaisa payment initiated. Enter OTP sent to your mobile.',
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createStripeIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (!stripe) return res.status(500).json({ success: false, message: 'Stripe not configured' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100),
      currency: 'pkr',
      metadata: { orderId: orderId.toString() },
    });

    order.stripePaymentIntentId = paymentIntent.id;
    await order.save();

    res.json({ success: true, data: { clientSecret: paymentIntent.client_secret } });
  } catch (error) {
    next(error);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { orderId, transactionId, status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (status === 'success') {
      order.paymentStatus = 'paid';
      order.paymentTransactionId = transactionId;
      order.orderStatus = 'confirmed';
      order.statusHistory.push({ status: 'confirmed', message: 'Payment verified, order confirmed' });
    } else {
      order.paymentStatus = 'failed';
    }
    await order.save();
    res.json({ success: true, data: order, message: 'Payment verified' });
  } catch (error) {
    next(error);
  }
};

// JazzCash redirects the browser here after payment (POST)
exports.jazzCashReturn = async (req, res, next) => {
  try {
    const data = req.body;
    const clientURL = process.env.CLIENT_URL || 'https://mangomania.co';
    const responseCode = data.pp_ResponseCode;
    const txnRefNo = data.pp_TxnRefNo;

    const order = await Order.findOne({ paymentTransactionId: txnRefNo });

    if (order && responseCode === '000') {
      order.paymentStatus = 'paid';
      order.orderStatus = order.isPreOrder ? 'pre_order' : 'confirmed';
      order.statusHistory.push({
        status: order.isPreOrder ? 'pre_order' : 'confirmed',
        message: `Payment received via JazzCash (Txn: ${txnRefNo})`,
      });
      await order.save();
      return res.redirect(`${clientURL}/order-success?orderId=${order._id}&status=paid`);
    }

    // Payment failed or cancelled
    const orderId = order ? order._id : '';
    return res.redirect(`${clientURL}/order-success?orderId=${orderId}&status=failed`);
  } catch (error) {
    const clientURL = process.env.CLIENT_URL || 'https://mangomania.co';
    return res.redirect(`${clientURL}/order-success?status=error`);
  }
};

exports.jazzCashIPN = async (req, res, next) => {
  try {
    const data = req.body;
    const receivedHash = data.pp_SecureHash;

    // Verify the hash to make sure request is genuinely from JazzCash
    const params = { ...data };
    delete params.pp_SecureHash;
    const expectedHash = generateJazzCashHash(params, process.env.JAZZCASH_INTEGRITY_SALT);

    if (receivedHash !== expectedHash) {
      console.error('JazzCash IPN: Hash mismatch — possible fraud attempt');
      return res.status(400).json({ success: false, message: 'Invalid hash' });
    }

    const responseCode = data.pp_ResponseCode;
    const txnRefNo = data.pp_TxnRefNo;

    // Find the order by transaction reference
    const order = await Order.findOne({ paymentTransactionId: txnRefNo });
    if (!order) {
      console.error(`JazzCash IPN: Order not found for txn ${txnRefNo}`);
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (responseCode === '000') {
      // 000 = Success
      order.paymentStatus = 'paid';
      order.orderStatus = order.isPreOrder ? 'pre_order' : 'confirmed';
      order.statusHistory.push({
        status: order.isPreOrder ? 'pre_order' : 'confirmed',
        message: `Payment received via JazzCash (Txn: ${txnRefNo})`,
      });
    } else {
      // Any other code = failed
      order.paymentStatus = 'failed';
      console.log(`JazzCash IPN: Payment failed — code ${responseCode} for txn ${txnRefNo}`);
    }

    await order.save();
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

exports.stripeWebhook = async (req, res, next) => {
  try {
    if (!stripe) return res.status(400).json({ success: false, message: 'Stripe not configured' });
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody || req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).json({ success: false, message: `Webhook Error: ${err.message}` });
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });
      if (order) {
        order.paymentStatus = 'paid';
        order.orderStatus = 'confirmed';
        order.statusHistory.push({ status: 'confirmed', message: 'Payment received via Stripe' });
        await order.save();
      }
    }
    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};
