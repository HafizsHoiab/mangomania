const transporter = require('../config/nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  // Skip silently if email credentials are not configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email skipped — EMAIL_USER/EMAIL_PASS not configured');
    return;
  }
  try {
    await transporter.sendMail({
      from: `"Mango Mania 🥭" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Email send error:', error.message);
  }
};

const orderConfirmationEmail = (order, userEmail) => {
  const itemsHtml = order.items.map(item =>
    `<tr><td>${item.name}</td><td>${item.qty}</td><td>Rs. ${item.price.toLocaleString()}</td></tr>`
  ).join('');

  return sendEmail({
    to: userEmail,
    subject: `Order Confirmed — #${order._id.toString().slice(-8).toUpperCase()} | Mango Mania`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px;background:#FDF8F0;">
        <h1 style="color:#D97706;text-align:center;">🥭 Mango Mania</h1>
        <h2>Order Confirmed!</h2>
        <p>Hi! Your order has been placed successfully.</p>
        <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
        <table style="width:100%;border-collapse:collapse;">
          <thead><tr style="background:#F59E0B;color:white;"><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p><strong>Total: Rs. ${order.totalAmount.toLocaleString()}</strong></p>
        <p><strong>Payment:</strong> ${order.paymentMethod.toUpperCase()}</p>
        <p>Track your order at: <a href="${process.env.CLIENT_URL}/track-order">Click here</a></p>
        <p style="color:#6B7280;font-size:12px;">Multan, Pakistan | mangomania.pk</p>
      </div>
    `,
  });
};

const orderStatusEmail = (order, userEmail, newStatus) => {
  const statusMessages = {
    confirmed: 'Your order has been confirmed and is being prepared.',
    packed: 'Your order has been packed and is ready for dispatch.',
    dispatched: `Your order is on the way! Rider: ${order.rider?.name || 'N/A'} (${order.rider?.phone || ''})`,
    delivered: 'Your order has been delivered. Enjoy! 🥭',
    cancelled: 'Your order has been cancelled.',
  };

  return sendEmail({
    to: userEmail,
    subject: `Order ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} — Mango Mania`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px;background:#FDF8F0;">
        <h1 style="color:#D97706;text-align:center;">🥭 Mango Mania</h1>
        <h2>Order Update</h2>
        <p><strong>Order #${order._id.toString().slice(-8).toUpperCase()}</strong></p>
        <p>${statusMessages[newStatus] || `Status updated to: ${newStatus}`}</p>
        <a href="${process.env.CLIENT_URL}/track-order" style="background:#F59E0B;color:white;padding:10px 20px;text-decoration:none;border-radius:8px;">Track Order</a>
      </div>
    `,
  });
};

const passwordResetEmail = (email, otp) => {
  return sendEmail({
    to: email,
    subject: 'Password Reset OTP — Mango Mania',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px;background:#FDF8F0;">
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
