# EmailJS Templates Guide

This guide provides the exact templates and variable mappings for your portfolio email system.

## Template 1: Main Contact Email (for you)

**Template Name**: `Contact Form Message`
**Template ID**: Use this in `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`

### Template Content:
```
Subject: New Contact Form Message: {{subject}}

From: {{from_name}} ({{from_email}})

Message:
{{message}}

---
This message was sent from your portfolio contact form.
Reply directly to this email to respond to {{from_name}}.
```

### Variables Used:
- `{{from_name}}` - User's full name (First + Last)
- `{{from_email}}` - User's email address
- `{{subject}}` - Subject line from the form
- `{{message}}` - Message content from the form

---

## Template 2: Auto-Reply Email (for users)

**Template Name**: `Auto-Reply Confirmation`
**Template ID**: Use this in `NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE_ID`

### Template Content:
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

### Variables Used:
- `{{to_name}}` - User's full name (First + Last)
- `{{to_email}}` - User's email address (CRITICAL: Set this in template settings)
- `{{from_name}}` - Your name (Shubham)
- `{{original_subject}}` - Original subject from the form
- `{{original_message}}` - Original message from the form

---

## Template Settings Configuration

### For Main Contact Email:
- **To Email**: Your email address (set manually)
- **From Email**: `{{from_email}}`
- **Reply To**: `{{from_email}}`

### For Auto-Reply Email:
- **To Email**: `{{to_email}}` (CRITICAL - this must be set correctly)
- **From Email**: Your email address (set manually)
- **Reply To**: Your email address (set manually)

---

## Complete Variable Mapping

Here's how the variables map from the form to the templates:

### Form Data → Template Variables

| Form Field | Main Template | Auto-Reply Template | Description |
|------------|---------------|-------------------|-------------|
| `firstName + lastName` | `{{from_name}}` | `{{to_name}}` | User's full name |
| `email` | `{{from_email}}` | `{{to_email}}` | User's email address |
| `subject` | `{{subject}}` | `{{original_subject}}` | Message subject |
| `message` | `{{message}}` | `{{original_message}}` | Message content |
| N/A | N/A | `{{from_name}}` | Your name (Shubham) |

### Additional Variables (Auto-Reply Only):
- `{{user_email}}` - Alternative for user's email
- `{{user_name}}` - Alternative for user's name
- `{{reply_to}}` - Your email for replies

---

## Step-by-Step Setup

### 1. Create Main Template
1. Go to EmailJS → Email Templates
2. Click "Create New Template"
3. Name: "Contact Form Message"
4. Copy the main template content above
5. Set "To Email" to your email address
6. Set "From Email" to `{{from_email}}`
7. Save and note the Template ID

### 2. Create Auto-Reply Template
1. Go to EmailJS → Email Templates
2. Click "Create New Template"
3. Name: "Auto-Reply Confirmation"
4. Copy the auto-reply template content above
5. **CRITICAL**: Set "To Email" to `{{to_email}}`
6. Set "From Email" to your email address
7. Save and note the Template ID

### 3. Update Environment Variables
```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_main_template_id
NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE_ID=your_autoreply_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
NEXT_PUBLIC_CONTACT_EMAIL=your-email@example.com
```

---

## Testing Checklist

- [ ] Main template sends email to you
- [ ] Auto-reply template sends email to user
- [ ] Both emails have correct content
- [ ] Variables are populated correctly
- [ ] No "recipients address is empty" errors

---

## Troubleshooting

### "Recipients address is empty"
- Check that auto-reply template has "To Email" set to `{{to_email}}`
- Try alternative: `{{user_email}}`

### Variables not showing
- Ensure variable names match exactly (case-sensitive)
- Check for typos in template content
- Test template in EmailJS dashboard first

### Emails not sending
- Verify all environment variables are set
- Check EmailJS service is active
- Look for errors in browser console
