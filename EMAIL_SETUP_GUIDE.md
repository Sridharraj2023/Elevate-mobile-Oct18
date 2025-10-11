# 📧 Email Service Setup Guide

## 🎯 **To Enable Email Sending:**

### **Step 1: Configure Gmail App Password**

1. **Go to Google Account Settings:**
   - Visit: https://myaccount.google.com/
   - Click "Security" → "2-Step Verification" (enable if not already)

2. **Generate App Password:**
   - Go to "Security" → "App passwords"
   - Select "Mail" and "Other (custom name)"
   - Enter "Elevate App" as name
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### **Step 2: Update .env File**

Add these to your `.env` file in `D:\Elevate-Backend\backend\.env`:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
EMAIL_FROM=noreply@elevate.com
```

### **Step 3: Restart Backend**

```bash
cd D:\Elevate-Backend\backend
npm start
```

## 🎯 **Alternative: Test Email Service**

If you don't want to set up Gmail, you can test with a temporary email service:

### **Option 1: Use Ethereal Email (Test)**
```javascript
// This creates a temporary SMTP account for testing
// Emails won't actually be sent, but you can see them in the console
```

### **Option 2: Use Mailtrap (Development)**
```env
# Add to .env file
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your-mailtrap-user
EMAIL_PASS=your-mailtrap-password
```

## 🧪 **Testing Steps:**

### **1. Test Email Service:**
1. Set up email credentials
2. Restart backend server
3. Try forgot password flow
4. Check email inbox

### **2. Check Backend Logs:**
```bash
# Look for these logs:
Password reset token for user@email.com: abc123...
Email sent successfully: <message-id>
```

### **3. Test Reset Flow:**
1. Use the reset token from logs
2. Navigate to: `http://your-frontend-url/reset-password/[token]`
3. Enter new password
4. Try logging in with new password

## 📧 **Email Template Preview:**

The reset email will contain:
- **Subject:** "Password Reset Request - Elevate"
- **Content:** Professional HTML email with reset link
- **Link:** `http://your-frontend-url/reset-password/[token]`

## 🔧 **Troubleshooting:**

### **If emails don't send:**
1. **Check Gmail settings:** Make sure 2FA is enabled
2. **Verify app password:** Use the 16-character app password, not your regular password
3. **Check .env file:** Make sure EMAIL_USER and EMAIL_PASS are correct
4. **Restart server:** Always restart after changing .env

### **If you see errors:**
```bash
# Common errors:
Error: Invalid login: 535-5.7.8 Username and Password not accepted
# Solution: Use app password, not regular password

Error: Connection timeout
# Solution: Check internet connection and Gmail settings
```

## 🎉 **Ready to Test:**

Once you've set up the email credentials:

1. ✅ **Update .env file** with your Gmail app password
2. ✅ **Restart backend server**
3. ✅ **Try forgot password flow**
4. ✅ **Check your Gmail inbox**

**The email service is already implemented - just needs your Gmail credentials!** 🚀
