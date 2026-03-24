# Email Setup Guide with Auto-Reply

This guide will help you set up email functionality with auto-reply for your portfolio contact form using EmailJS.

## Prerequisites

- A Gmail account (or any email service supported by EmailJS)
- Access to your portfolio's environment variables

## Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Set Up Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail recommended)
4. Follow the setup instructions
5. Note down your **Service ID**

## Step 3: Create Main Email Template (for you)

1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Name it "Contact Form Message"
4. Use this template structure:

```
Subject: New Contact Form Message: {{subject}}

From: {{from_name}} ({{from_email}})

Message:
{{message}}

---
This message was sent from your portfolio contact form.
Reply directly to this email to respond to {{from_name}}.
```

5. Note down your **Template ID**

## Step 4: Create Auto-Reply Template (for users)

1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Name it "Auto-Reply Confirmation"
4. **IMPORTANT**: In the template settings, set the "To Email" field to use `{{to_email}}`
5. Use this template structure:

```
Subject: Re: {{original_subject}} - Message Received

Hi {{to_name}},

Thank you for reaching out through my portfolio contact form! I've received your message about "{{original_subject}}" and I'll get back to you as soon as possible.

Your message:
"{{original_message}}"

I typically respond within 24 hours. If your message is urgent, please feel free to reach out to me directly.

Best regards,
{{from_name}}

---
This is an automated confirmation. Please do not reply to this email.
```

6. **CRITICAL**: Make sure to set the "To Email" field in the template settings to `{{to_email}}`
7. Note down your **Auto-Reply Template ID**

## Step 5: Get Public Key

1. Go to "Account" in your EmailJS dashboard
2. Find your **Public Key** in the API Keys section

## Step 6: Configure Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder values:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_actual_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_actual_template_id
NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE_ID=your_actual_autoreply_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_actual_public_key
NEXT_PUBLIC_CONTACT_EMAIL=your-email@example.com
```

## Step 7: Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to the contact section
3. Fill out and submit the form
4. Check your email for the message
5. Check the user's email for the auto-reply confirmation

## Features

- ✅ Real-time form validation
- ✅ Email sending via EmailJS
- ✅ **Auto-reply confirmation to users**
- ✅ Fallback to mailto link if EmailJS fails
- ✅ Success/error notifications
- ✅ Responsive design
- ✅ TypeScript support

## How Auto-Reply Works

1. **User submits form** → Form validates and sends data
2. **System sends two emails**:
   - Main email to you with the user's message
   - Auto-reply to the user confirming receipt
3. **User receives confirmation** → Professional auto-reply email
4. **You receive the message** → Original message in your inbox

## Troubleshooting

### "The recipients address is empty" error
- **Most common cause**: The auto-reply template doesn't have the "To Email" field set correctly
- **Solution**: In your EmailJS template settings, make sure the "To Email" field is set to `{{to_email}}`
- **Alternative**: Try using `{{user_email}}` instead of `{{to_email}}` in the template settings

### Auto-reply not sending
- Check that `NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE_ID` is set correctly
- Verify the auto-reply template exists in EmailJS dashboard
- Check that template variables match: `{{to_name}}`, `{{original_subject}}`, `{{original_message}}`, `{{from_name}}`
- **Most importantly**: Ensure the "To Email" field in template settings uses `{{to_email}}`

### Main email not sending
- Check that all environment variables are set correctly
- Verify EmailJS service is active
- Check browser console for errors

### Template not working
- Ensure template variables match exactly
- Test templates in EmailJS dashboard
- Check for typos in variable names
- **For auto-reply**: Make sure the recipient email field is properly configured

### CORS errors
- Make sure you're using the correct public key
- Check that your domain is allowed in EmailJS settings

## Security Notes

- Never commit `.env.local` to version control
- EmailJS public key is safe to expose in client-side code
- Consider rate limiting for production use
- Auto-reply helps prevent spam by confirming legitimate submissions

## Support

For issues with EmailJS, check their [documentation](https://www.emailjs.com/docs/) or [support](https://www.emailjs.com/support/).
