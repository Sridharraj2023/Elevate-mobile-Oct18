# Forgot Password Feature - Backend Setup Guide

## 📋 Overview

This guide covers the complete setup for the forgot password feature in your Elevate backend. The implementation includes secure token generation, email notifications, and password reset functionality.

---

## 🎯 Features Implemented

✅ Secure password reset token generation  
✅ Token expiration (1 hour)  
✅ Professional HTML email templates  
✅ Password reset request endpoint  
✅ Password reset confirmation endpoint  
✅ Email confirmation after successful reset  
✅ Security best practices implemented  

---

## 📁 Files Modified/Created

### **1. User Model** (`models/userModel.js`)
**Added fields:**
- `resetPasswordToken` - Hashed token for password reset
- `resetPasswordExpires` - Token expiration timestamp

**Added methods:**
- `createPasswordResetToken()` - Generates secure random token
- `clearPasswordResetToken()` - Clears reset fields after use

### **2. Email Service** (`services/emailService.js`)
**Added methods:**
- `sendPasswordResetEmail()` - Sends password reset link
- `sendPasswordResetConfirmationEmail()` - Confirms successful reset
- Professional HTML and text email templates

### **3. User Controller** (`controllers/userController.js`)
**Enhanced methods:**
- `forgotUserPassword()` - Improved with secure token generation
- `resetPassword()` - Enhanced with token validation and security

### **4. Routes** (`routes/userRoutes.js`)
**Existing routes (verified):**
- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/reset-password/:token` - Reset password with token

---

## ⚙️ Environment Variables Setup

### **Required Environment Variables**

Add these to your `.env` file:

```bash
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=noreply@elevateintune.com

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:3000

# JWT Secret (already exists)
JWT_SECRET=your_jwt_secret_key
```

### **Email Configuration Options**

#### **Option 1: Gmail (Recommended for Development)**

1. Enable 2-Factor Authentication on your Google Account
2. Generate App-Specific Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated password
   - Use it as `EMAIL_PASS` in your `.env`

```bash
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your-16-character-app-password
```

#### **Option 2: SendGrid (Recommended for Production)**

```bash
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key
```

#### **Option 3: Mailgun**

```bash
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=your_mailgun_username
EMAIL_PASS=your_mailgun_password
```

#### **Option 4: AWS SES**

```bash
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your_aws_access_key_id
EMAIL_PASS=your_aws_secret_access_key
```

---

## 🧪 Testing the Implementation

### **1. Test Forgot Password Request**

```bash
# Using cURL
curl -X POST http://localhost:5000/api/users/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'

# Expected Response:
{
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

### **2. Check Email**

The user should receive an email with:
- Password reset link
- 1-hour expiration notice
- Security information

### **3. Test Password Reset**

```bash
# Using cURL (replace TOKEN with actual token from email)
curl -X POST http://localhost:5000/api/users/reset-password/TOKEN_HERE \
  -H "Content-Type: application/json" \
  -d '{"password": "newPassword123"}'

# Expected Response:
{
  "message": "Password reset successful. You can now log in with your new password."
}
```

### **4. Test Invalid/Expired Token**

```bash
curl -X POST http://localhost:5000/api/users/reset-password/invalid_token \
  -H "Content-Type: application/json" \
  -d '{"password": "newPassword123"}'

# Expected Response (400 Bad Request):
{
  "message": "Invalid or expired password reset token"
}
```

---

## 🔒 Security Features

### **1. Token Security**
- ✅ Cryptographically secure random tokens (32 bytes)
- ✅ Tokens are hashed before storing in database
- ✅ 1-hour expiration time
- ✅ One-time use (tokens cleared after use)

### **2. Email Security**
- ✅ Never reveals if email exists in database
- ✅ Reset link contains plain token (hashed in DB)
- ✅ Security warnings in email templates

### **3. Password Validation**
- ✅ Minimum 6 characters
- ✅ Automatically hashed using bcrypt
- ✅ Pre-save hook ensures consistency

### **4. Rate Limiting (Recommended Addition)**

Add rate limiting to prevent abuse:

```javascript
// Install: npm install express-rate-limit
import rateLimit from 'express-rate-limit';

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 requests per windowMs
  message: 'Too many password reset requests. Please try again later.'
});

// Apply to route
router.post('/forgot-password', forgotPasswordLimiter, forgotUserPassword);
```

---

## 📧 Email Templates

The system includes professional HTML and plain text email templates:

### **Password Reset Request Email**
- Clean, branded design
- Clear call-to-action button
- Expiration warning
- Security notice
- Fallback plain text version

### **Password Reset Confirmation Email**
- Success confirmation
- Login button
- Security reminder
- Fallback plain text version

---

## 🐛 Troubleshooting

### **Email Not Sending**

1. **Check environment variables:**
   ```bash
   echo $EMAIL_USER
   echo $EMAIL_PASS
   ```

2. **Verify email service credentials:**
   - Gmail: Ensure app-specific password is correct
   - Other services: Check SMTP settings

3. **Check server logs:**
   ```bash
   npm start
   # Look for "Password reset email sent successfully" message
   ```

4. **Test email service directly:**
   ```javascript
   // In a test file
   import emailService from './services/emailService.js';
   const testUser = { name: 'Test', email: 'test@example.com' };
   await emailService.sendPasswordResetEmail(testUser, 'test-token');
   ```

### **Token Issues**

1. **"Invalid or expired token" error:**
   - Token expired (>1 hour old)
   - Token already used
   - Token doesn't match (check URL encoding)

2. **Token not being saved:**
   - Check MongoDB connection
   - Verify User model has resetPasswordToken field
   - Check server logs for errors

### **Frontend Integration Issues**

1. **CORS errors:**
   ```javascript
   // In server.js
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true
   }));
   ```

2. **Reset link not working:**
   - Verify `FRONTEND_URL` in `.env`
   - Check frontend route matches: `/reset-password/:token`

---

## 📊 Database Schema

After running the updated code, your User documents will have:

```javascript
{
  _id: ObjectId("..."),
  name: "John Doe",
  email: "john@example.com",
  password: "$2a$10$...", // Hashed
  role: "user",
  
  // New fields for password reset
  resetPasswordToken: null, // or hashed token string
  resetPasswordExpires: null, // or Date object
  
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

---

## 🚀 Production Deployment Checklist

- [ ] Use production SMTP service (SendGrid, Mailgun, AWS SES)
- [ ] Set `FRONTEND_URL` to production domain
- [ ] Enable HTTPS for all endpoints
- [ ] Add rate limiting to forgot-password endpoint
- [ ] Set up email monitoring/logging
- [ ] Configure email delivery tracking
- [ ] Set up alerts for failed emails
- [ ] Use environment-specific email templates
- [ ] Add CAPTCHA to forgot-password form (frontend)
- [ ] Monitor for abuse patterns
- [ ] Set up email bounce handling
- [ ] Configure SPF, DKIM, DMARC for email domain

---

## 📝 API Endpoints Summary

### **POST /api/users/forgot-password**
Request password reset email

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

---

### **POST /api/users/reset-password/:token**
Reset password with token

**Request:**
```json
{
  "password": "newPassword123"
}
```

**Response (200):**
```json
{
  "message": "Password reset successful. You can now log in with your new password."
}
```

**Error Responses:**
- `400` - Invalid or expired token
- `400` - Password validation failed
- `500` - Server error

---

## 🎨 Customization

### **Change Token Expiration**

Edit `models/userModel.js`:
```javascript
// Change from 1 hour to 30 minutes
this.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
```

### **Customize Email Templates**

Edit `services/emailService.js`:
- Update `getPasswordResetHTML()` for custom styling
- Modify `getPasswordResetText()` for plain text version

### **Change Frontend URL Pattern**

Edit `services/emailService.js`:
```javascript
// Change URL pattern
const resetLink = `${process.env.FRONTEND_URL}/auth/reset/${resetToken}`;
```

---

## 📚 Additional Resources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [OWASP Password Reset Guidelines](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)

---

## ✅ Verification Checklist

- [x] User model updated with reset fields
- [x] Email service configured
- [x] Controller methods implemented
- [x] Routes configured
- [x] Environment variables documented
- [x] Security measures implemented
- [x] Email templates created
- [ ] Testing completed
- [ ] Frontend integration ready

---

## 💡 Next Steps

1. **Backend:**
   - ✅ Setup complete
   - Add rate limiting (optional)
   - Configure production email service

2. **Frontend (Flutter):**
   - Create Forgot Password screen
   - Create Reset Password screen
   - Add "Forgot Password?" link to Login screen
   - Implement API calls
   - Handle deep links for reset tokens

3. **Testing:**
   - Test with real email addresses
   - Test token expiration
   - Test invalid tokens
   - Test with various email services

---

**Setup completed successfully! 🎉**

For frontend implementation, refer to the Flutter integration guide.

