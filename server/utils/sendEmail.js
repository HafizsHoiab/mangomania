const { Resend } = require('resend');

const getResend = () => {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
};

const sendEmail = async ({ to, subject, html }) => {
  const resend = getResend();
  if (!resend) {
    console.log('Email skipped — RESEND_API_KEY not configured');
    return;
  }
  try {
    const fromName = 'Mango Mania';
    const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    const { error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to,
      subject,
      html,
    });
    if (error) console.error('Resend error:', error);
  } catch (err) {
    console.error('Email send error:', err.message);
  }
};

const orderConfirmationEmail = (order, userEmail, userName = 'Valued Customer') => {
  const clientURL = process.env.CLIENT_URL || 'https://mangomania.co';
  const orderId = order._id.toString().slice(-8).toUpperCase();
  const trackingURL = `${clientURL}/track-order?orderId=${order._id}`;

  const itemsHtml = order.items.map(item =>
    `<tr>
      <td style="padding:8px;border-bottom:1px solid #FEF3C7;">${item.name}</td>
      <td style="padding:8px;border-bottom:1px solid #FEF3C7;text-align:center;">${item.qty}</td>
      <td style="padding:8px;border-bottom:1px solid #FEF3C7;text-align:right;">Rs. ${(item.price * item.qty).toLocaleString()}</td>
    </tr>`
  ).join('');

  return sendEmail({
    to: userEmail,
    subject: `Order Confirmed #${orderId} — Mango Mania 🥭`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#FDF8F0;border-radius:12px;">
        <div style="text-align:center;margin-bottom:24px;">
          <h1 style="color:#D97706;margin:0;">🥭 Mango Mania</h1>
          <p style="color:#6B7280;margin:4px 0;">Fresh from Multan</p>
        </div>
        <div style="background:#FEF3C7;border-radius:8px;padding:16px;margin-bottom:20px;text-align:center;">
          <h2 style="color:#92400E;margin:0 0 4px 0;">Order Confirmed! ✅</h2>
          <p style="color:#78350F;margin:0;">Jazakallah, ${userName}! Your order has been received.</p>
        </div>
        <p style="color:#374151;"><strong>Order ID:</strong> #${orderId}</p>
        <p style="color:#374151;"><strong>Payment:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}</p>
        <p style="color:#374151;"><strong>Delivery to:</strong> ${order.shippingAddress?.city}, ${order.shippingAddress?.province}</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <thead>
            <tr style="background:#F59E0B;">
              <th style="padding:10px;color:white;text-align:left;">Item</th>
              <th style="padding:10px;color:white;text-align:center;">Qty</th>
              <th style="padding:10px;color:white;text-align:right;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:10px;text-align:right;font-weight:bold;">Delivery:</td>
              <td style="padding:10px;text-align:right;">${order.deliveryCharge === 0 ? 'FREE' : `Rs. ${order.deliveryCharge}`}</td>
            </tr>
            <tr style="background:#FEF3C7;">
              <td colspan="2" style="padding:10px;text-align:right;font-weight:bold;font-size:16px;">Total:</td>
              <td style="padding:10px;text-align:right;font-weight:bold;font-size:16px;">Rs. ${order.totalAmount.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
        <div style="text-align:center;margin:24px 0;">
          <a href="${trackingURL}" style="background:#F59E0B;color:white;padding:12px 28px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:15px;">
            📦 Track Your Order
          </a>
        </div>
        <p style="color:#6B7280;font-size:12px;text-align:center;margin-top:24px;">
          Mango Mania — Multan, Pakistan<br/>
          Questions? Visit mangomania.co
        </p>
      </div>
    `,
  });
};

const orderStatusEmail = (order, userEmail, newStatus) => {
  if (!userEmail) return Promise.resolve();
  const statusMessages = {
    confirmed: 'Your order has been confirmed and is being prepared.',
    packed: 'Your order has been packed and is ready for dispatch.',
    dispatched: `Your order is on the way! Rider: ${order.rider?.name || 'N/A'} (${order.rider?.phone || ''})`,
    delivered: 'Your order has been delivered. Enjoy! 🥭',
    cancelled: 'Your order has been cancelled.',
  };
  const clientURL = process.env.CLIENT_URL || 'https://mangomania.co';
  return sendEmail({
    to: userEmail,
    subject: `Order ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} — Mango Mania`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px;background:#FDF8F0;border-radius:12px;">
        <h1 style="color:#D97706;text-align:center;">🥭 Mango Mania</h1>
        <h2>Order Update</h2>
        <p><strong>Order #${order._id.toString().slice(-8).toUpperCase()}</strong></p>
        <p>${statusMessages[newStatus] || `Status updated to: ${newStatus}`}</p>
        <div style="text-align:center;margin:20px 0;">
          <a href="${clientURL}/track-order?orderId=${order._id}" style="background:#F59E0B;color:white;padding:10px 20px;text-decoration:none;border-radius:8px;">Track Order</a>
        </div>
      </div>
    `,
  });
};

const passwordResetEmail = (email, otp) => {
  return sendEmail({
    to: email,
    subject: 'Password Reset OTP — Mango Mania',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px;background:#FDF8F0;border-radius:12px;">
        <h1 style="color:#D97706;text-align:center;">🥭 Mango Mania</h1>
        <h2>Password Reset</h2>
        <p>Your OTP for password reset is:</p>
        <div style="font-size:32px;font-weight:bold;color:#D97706;text-align:center;padding:20px;background:#FEF3C7;border-radius:12px;">${otp}</div>
        <p>This OTP expires in 10 minutes.</p>
        <p style="color:#6B7280;font-size:12px;">If you did not request this, ignore this email.</p>
      </div>
    `,
  });
};

module.exports = { sendEmail, orderConfirmationEmail, orderStatusEmail, passwordResetEmail };
