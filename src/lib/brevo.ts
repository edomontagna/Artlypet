const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
const BREVO_BASE_URL = 'https://api.brevo.com/v3';
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'noreply@artlypet.com';
const SENDER_NAME = process.env.BREVO_SENDER_NAME || 'ArtlyPet';

interface EmailRecipient {
  email: string;
  name?: string;
}

interface SendEmailParams {
  to: EmailRecipient[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  tags?: string[];
}

export async function sendTransactionalEmail(params: SendEmailParams) {
  const response = await fetch(`${BREVO_BASE_URL}/smtp/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { email: SENDER_EMAIL, name: SENDER_NAME },
      to: params.to,
      subject: params.subject,
      htmlContent: params.htmlContent,
      textContent: params.textContent,
      tags: params.tags,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Brevo email failed: ${error}`);
  }

  return response.json();
}

export async function addContactToList(email: string, listId: number, attributes?: Record<string, string>) {
  const response = await fetch(`${BREVO_BASE_URL}/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify({
      email,
      listIds: [listId],
      attributes,
      updateEnabled: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Brevo contact creation failed: ${error}`);
  }

  return response.json();
}

export function buildWelcomeEmail(name: string): { subject: string; html: string } {
  return {
    subject: 'Welcome to ArtlyPet! 🎨',
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 40px 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Welcome to ArtlyPet</h1>
          <p style="margin: 8px 0 0; opacity: 0.9; font-size: 16px;">Transform your photos into masterpieces</p>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px; line-height: 1.6;">Hi ${name},</p>
          <p style="font-size: 16px; line-height: 1.6;">Welcome to ArtlyPet! You have <strong>3 free credits</strong> to start creating stunning art portraits of your pets, yourself, or mix them together.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px;">Start Creating</a>
          </div>
          <p style="font-size: 14px; color: #888; line-height: 1.6;">Share your referral link with friends and earn 2 extra credits for each friend who signs up!</p>
        </div>
      </div>
    `,
  };
}

export function buildOrderConfirmationEmail(orderId: string, items: string[]): { subject: string; html: string } {
  return {
    subject: `Order Confirmed #${orderId} - ArtlyPet`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 40px 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Order Confirmed!</h1>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px; line-height: 1.6;">Your order <strong>#${orderId}</strong> has been confirmed.</p>
          <ul style="font-size: 16px; line-height: 1.8;">${items.map((i) => `<li>${i}</li>`).join('')}</ul>
          <p style="font-size: 14px; color: #888; line-height: 1.6;">We'll send you tracking info once your order ships.</p>
        </div>
      </div>
    `,
  };
}
