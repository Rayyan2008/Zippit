/**
 * WhatsApp Service
 * Handles WhatsApp message sending via WhatsApp Business API
 * To use this in production, set up WhatsApp Business Account and add credentials
 */

export const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    // In development/MVP, log to console
    console.log(`[WhatsApp] Sending to ${phoneNumber}:`, message);

    // TODO: Replace with actual WhatsApp Business API call
    // Example using Meta WhatsApp Business API:
    /*
    const response = await fetch('https://graph.instagram.com/v18.0/YOUR_PHONE_NUMBER_ID/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_BUSINESS_ACCOUNT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: {
          preview_url: true,
          body: message,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send WhatsApp message');
    }

    return await response.json();
    */

    // For MVP, simulate success
    return { success: true, message: 'Message queued for sending' };
  } catch (error) {
    console.error('WhatsApp error:', error);
    return { success: false, error: error.message };
  }
};

export const sendOrderStatusNotification = (customerPhone, orderId, status) => {
  const message = `Hi! Your Zippit order #${orderId} status is now: ${status}. Thank you for shopping with us!`;
  return sendWhatsAppMessage(customerPhone, message);
};

export const sendInquiryReplyNotification = (customerPhone, inquiry, reply) => {
  const message = `Hi ${inquiry.name}! We received your inquiry. Here's our response: ${reply}. Feel free to reach out if you have any questions!`;
  return sendWhatsAppMessage(customerPhone, message);
};
