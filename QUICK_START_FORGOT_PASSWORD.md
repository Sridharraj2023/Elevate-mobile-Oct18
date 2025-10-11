# Quick Start Guide - Forgot Password Feature

## 🚀 Quick Setup (5 Minutes)

### **Step 1: Add Environment Variables**

Add these to your `.env` file:

```bash
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM=noreply@elevateintune.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Get Gmail App Password:**
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" → "Other" → "Elevate Backend"
3. Copy the 16-character password
4. Use it as `EMAIL_PASS`

---

### **Step 2: Restart Server**

```bash
npm start
```

---

### **Step 3: Test It!**

**Request Password Reset:**
```bash
curl -X POST http://localhost:5000/api/users/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**Check Email** → Click reset link → Reset password!

---

## 📋 What Was Changed

✅ **User Model** - Added reset token fields  
✅ **Email Service** - Added password reset emails  
✅ **Controller** - Enhanced security & validation  
✅ **Routes** - Already configured (no changes needed)  

---

## 🔗 API Endpoints

### Request Reset:
```
POST /api/users/forgot-password
Body: { "email": "user@example.com" }
```

### Reset Password:
```
POST /api/users/reset-password/:token
Body: { "password": "newPassword123" }
```

---

## 📱 Next: Flutter Frontend

1. Create `ForgotPassword_Screen.dart`
2. Create `ResetPassword_Screen.dart`  
3. Add "Forgot Password?" link to Login screen
4. Connect to API endpoints

**Detailed guide:** `FORGOT_PASSWORD_SETUP.md`

---

## 🐛 Troubleshooting

**Emails not sending?**
- Check `EMAIL_USER` and `EMAIL_PASS` in `.env`
- Verify Gmail app password (not regular password)
- Check server logs for errors

**Token errors?**
- Token expires in 1 hour
- Can only be used once
- Check MongoDB has `resetPasswordToken` field

---

## 📞 Testing Checklist

- [ ] Environment variables set
- [ ] Server restarted
- [ ] Test forgot-password endpoint
- [ ] Receive email with reset link
- [ ] Test reset-password endpoint
- [ ] Receive confirmation email
- [ ] Can log in with new password

---

**Backend setup complete! Ready for frontend integration.** 🎉

