// Test script for Resend email integration
import dotenv from 'dotenv';
import { Resend } from 'resend';

// Load environment variables
dotenv.config();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

console.log(`\n${colors.blue}╔════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.blue}║   RESEND EMAIL INTEGRATION TEST        ║${colors.reset}`);
console.log(`${colors.blue}╚════════════════════════════════════════╝${colors.reset}\n`);

// Check environment variables
console.log(`${colors.yellow}Checking environment variables...${colors.reset}`);

if (!process.env.RESEND_API_KEY) {
  console.error(`${colors.red}❌ ERROR: RESEND_API_KEY is not set in .env file${colors.reset}`);
  console.log(`\nPlease add to your .env file:`);
  console.log(`RESEND_API_KEY=your_api_key_here\n`);
  process.exit(1);
}

console.log(`${colors.green}✓ RESEND_API_KEY is set${colors.reset}`);

if (!process.env.EMAIL_FROM) {
  console.warn(`${colors.yellow}⚠️  WARNING: EMAIL_FROM is not set, using default${colors.reset}`);
} else {
  console.log(`${colors.green}✓ EMAIL_FROM is set: ${process.env.EMAIL_FROM}${colors.reset}`);
}

// Initialize Resend
console.log(`\n${colors.yellow}Initializing Resend...${colors.reset}`);
const resend = new Resend(process.env.RESEND_API_KEY);
console.log(`${colors.green}✓ Resend initialized${colors.reset}`);

// Test email sending
(async function testEmailSending() {
  try {
    console.log(`\n${colors.yellow}Sending test email...${colors.reset}`);
    console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    
    // ⚠️ IMPORTANT: Change this to your email address!
    const testEmailAddress = '211400117@students.au.edu.pk'; // ← CHANGE THIS!
    
    if (testEmailAddress === 'YOUR_EMAIL@example.com') {
      console.error(`\n${colors.red}❌ ERROR: Please update the testEmailAddress in this script${colors.reset}`);
      console.log(`${colors.yellow}Edit test-resend.js and change line 49 to your email address${colors.reset}\n`);
      process.exit(1);
    }

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Elevate <onboarding@resend.dev>',
      to: [testEmailAddress],
      subject: 'Resend Integration Test - Elevate',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f7;">
          <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 12px;">
            <h1 style="color: white; margin: 0;">ELEVATE</h1>
            <p style="color: white; margin: 5px 0;">by Frequency Tuning</p>
          </div>
          <div style="max-width: 600px; margin: 20px auto; background-color: white; padding: 40px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1a1a1a; margin-top: 0;">✅ Resend Integration Successful!</h2>
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
              Congratulations! Your Resend email service is configured correctly and working perfectly.
            </p>
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
              You can now use Resend to send:
            </p>
            <ul style="color: #4a4a4a; font-size: 14px; line-height: 1.8;">
              <li>Password reset emails</li>
              <li>Password reset confirmations</li>
              <li>User notifications</li>
              <li>Subscription reminders</li>
            </ul>
            <div style="background-color: #eff6ff; padding: 16px; border-left: 4px solid #3b82f6; border-radius: 4px; margin-top: 20px;">
              <p style="color: #1e40af; margin: 0; font-size: 14px;">
                <strong>🎉 Next Steps:</strong> Your forgot password feature is ready to use!
              </p>
            </div>
          </div>
          <div style="max-width: 600px; margin: 0 auto; text-align: center; padding: 20px;">
            <p style="color: #9ca3af; font-size: 12px;">
              Test email sent at ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
      text: `
ELEVATE - Resend Integration Test
by Frequency Tuning

✅ Resend Integration Successful!

Congratulations! Your Resend email service is configured correctly and working perfectly.

You can now use Resend to send:
• Password reset emails
• Password reset confirmations
• User notifications
• Subscription reminders

🎉 Next Steps: Your forgot password feature is ready to use!

Test email sent at ${new Date().toLocaleString()}
      `.trim(),
    });

    if (error) {
      console.error(`\n${colors.red}❌ FAILED: Email could not be sent${colors.reset}`);
      console.error(`${colors.red}Error details:${colors.reset}`, error);
      console.log(`\n${colors.yellow}Common Issues:${colors.reset}`);
      console.log(`1. Invalid API key - regenerate at https://resend.com/api-keys`);
      console.log(`2. Domain not verified - check https://resend.com/domains`);
      console.log(`3. API key doesn't have permission to send emails\n`);
      process.exit(1);
    }

    console.log(`${colors.green}✅ SUCCESS: Test email sent!${colors.reset}`);
    console.log(`\n${colors.blue}Email Details:${colors.reset}`);
    console.log(`  • Email ID: ${data.id}`);
    console.log(`  • To: ${testEmailAddress}`);
    console.log(`  • From: ${process.env.EMAIL_FROM || 'Elevate <onboarding@resend.dev>'}`);
    console.log(`  • Subject: Resend Integration Test - Elevate`);
    
    console.log(`\n${colors.green}╔════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.green}║   ✓ RESEND IS WORKING CORRECTLY!      ║${colors.reset}`);
    console.log(`${colors.green}╚════════════════════════════════════════╝${colors.reset}`);
    console.log(`\n${colors.yellow}Next Steps:${colors.reset}`);
    console.log(`1. Check your email inbox for the test email`);
    console.log(`2. If not in inbox, check your spam/junk folder`);
    console.log(`3. Restart your backend server to apply changes`);
    console.log(`4. Test the forgot password flow in your Flutter app\n`);
    
  } catch (error) {
    console.error(`\n${colors.red}❌ UNEXPECTED ERROR:${colors.reset}`, error.message);
    console.error(`\n${colors.red}Stack trace:${colors.reset}`, error.stack);
    process.exit(1);
  }
})();

