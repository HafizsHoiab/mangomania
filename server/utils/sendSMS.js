const twilio = require('twilio');

let client;
if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN) {
  client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
}

const sendSMS = async (to, message) => {
  if (!client) {
    console.log('Twilio not configured, SMS skipped:', message);
    return;
  }
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to,
    });
  } catch (error) {
    console.error('SMS send error:', error.message);
  }
};

const sendWhatsApp = async (to, message) => {
  if (!client) {
    console.log('Twilio not configured, WhatsApp skipped:', message);
    return;
  }
  try {
    await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_PHONE}`,
      to: `whatsapp:${to}`,
    });
  } catch (error) {
    console.error('WhatsApp send error:', error.message);
  }
};

module.exports = { sendSMS, sendWhatsApp };
