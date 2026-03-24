// Test script to check EmailJS configuration
console.log('=== EmailJS Configuration Test ===');
console.log('Service ID:', process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID);
console.log('Main Template ID:', process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID);
console.log('Auto-Reply Template ID:', process.env.NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE_ID);
console.log('Public Key:', process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
console.log('Contact Email:', process.env.NEXT_PUBLIC_CONTACT_EMAIL);

// Check if credentials are properly set
const isConfigured = 
  process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID !== 'your_service_id_here' &&
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID !== 'your_template_id_here' &&
  process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY !== 'your_public_key_here' &&
  process.env.NEXT_PUBLIC_CONTACT_EMAIL !== 'your-email@example.com';

console.log('\n=== Configuration Status ===');
console.log('EmailJS is properly configured:', isConfigured);

if (!isConfigured) {
  console.log('\n❌ Missing credentials:');
  if (process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID === 'your_service_id_here') {
    console.log('- Service ID needs to be set');
  }
  if (process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID === 'your_template_id_here') {
    console.log('- Main Template ID needs to be set');
  }
  if (process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY === 'your_public_key_here') {
    console.log('- Public Key needs to be set');
  }
  if (process.env.NEXT_PUBLIC_CONTACT_EMAIL === 'your-email@example.com') {
    console.log('- Contact Email needs to be set');
  }
}
