import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'your_service_id';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'your_template_id';
const EMAILJS_AUTOREPLY_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE_ID || 'your_autoreply_template_id';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'your_public_key';
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'your-email@example.com';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export interface EmailServiceResponse {
  success: boolean;
  message: string;
}

class EmailService {
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window !== 'undefined' && EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'your_public_key') {
      emailjs.init(EMAILJS_PUBLIC_KEY);
      this.isInitialized = true;
    }
  }

  async sendContactEmail(formData: ContactFormData): Promise<EmailServiceResponse> {
    if (!this.isInitialized) {
      return {
        success: false,
        message: 'Email service not configured. Please set up EmailJS credentials.'
      };
    }

    try {
      // Send email to you (the main contact email)
      const mainEmailParams = {
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_name: 'Shubham', // Your name
        reply_to: formData.email,
      };

      const mainEmailResponse = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        mainEmailParams
      );

      // Send auto-reply to the user
      // Note: EmailJS requires specific field names for recipient
      const autoReplyParams = {
        to_name: `${formData.firstName} ${formData.lastName}`,
        to_email: formData.email,
        from_name: 'Shubham',
        from_email: CONTACT_EMAIL,
        subject: `Re: ${formData.subject}`,
        original_subject: formData.subject,
        original_message: formData.message,
        // Additional fields that EmailJS might expect
        user_email: formData.email,
        user_name: `${formData.firstName} ${formData.lastName}`,
        reply_to: CONTACT_EMAIL,
      };

      const autoReplyResponse = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_AUTOREPLY_TEMPLATE_ID,
        autoReplyParams
      );

      if (mainEmailResponse.status === 200 && autoReplyResponse.status === 200) {
        return {
          success: true,
          message: 'Message sent successfully! You should receive a confirmation email shortly.'
        };
      } else {
        return {
          success: false,
          message: 'Failed to send message. Please try again later.'
        };
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      return {
        success: false,
        message: 'An error occurred while sending the message. Please try again later.'
      };
    }
  }

  // Fallback method using a simple mailto link
  generateMailtoLink(formData: ContactFormData): string {
    const subject = encodeURIComponent(formData.subject);
    const body = encodeURIComponent(
      `Name: ${formData.firstName} ${formData.lastName}\n` +
      `Email: ${formData.email}\n\n` +
      `Message:\n${formData.message}`
    );
    
    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }
}

// Export singleton instance
export const emailService = new EmailService();
