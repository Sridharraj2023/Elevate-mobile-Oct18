# 📧 Required Environment Variables for Email Service

## ✅ **Essential Variables for Password Reset Email:**

### **1. EMAIL_USER**
```
EMAIL_USER = your-email@gmail.com
```
- Your Gmail email address
- Must be the same email used for generating app password

### **2. EMAIL_PASS**
```
EMAIL_PASS = your-16-character-app-password
```
- Gmail App Password (NOT your regular Gmail password)
- 16 characters, no spaces (e.g., `abcdefghijklmnop`)

### **3. EMAIL_FROM**
```
EMAIL_FROM = noreply@elevate.com
```
- Display name for sender
- Can be any email address (doesn't need to be real)

## 🔍 **How to Check Your Current Variables:**

### **Check Render.com Dashboard:**
1. Go to your Render.com service
2. Click "Environment" tab
3. Look for these variables:
   - `EMAIL_USER`
   - `EMAIL_PASS` 
   - `EMAIL_FROM`

### **Check Backend Logs:**
After deploying, check your Render service logs for:
```
Email config check: {
  user: 'Set' or 'Not set',
  pass: 'Set' or 'Not set', 
  from: 'Set' or 'Using default'
}
```

## 🚨 **Common Issues:**

### **If EMAIL_USER is missing:**
- Add: `EMAIL_USER = your-email@gmail.com`

### **If EMAIL_PASS is missing or wrong:**
- Generate new Gmail App Password
- Add: `EMAIL_PASS = your-16-character-password`

### **If EMAIL_FROM is missing:**
- Add: `EMAIL_FROM = noreply@elevate.com`

## 📧 **Gmail App Password Setup:**

If you need to generate a new app password:

1. **Go to:** https://myaccount.google.com/
2. **Security** → **2-Step Verification** (enable if not already)
3. **Security** → **App passwords**
4. **Select:** Mail → Other (custom name)
5. **Enter:** "Elevate App"
6. **Copy:** The 16-character password
7. **Add to Render:** `EMAIL_PASS = abcd efgh ijkl mnop`

## ✅ **Test After Setup:**

1. **Deploy changes** (if any environment variables were added)
2. **Try forgot password flow**
3. **Check Render logs** for email sending status
4. **Check Gmail inbox** for reset email

## 🎯 **Quick Check:**

**Do you have these 3 variables set on Render.com?**
- ✅ `EMAIL_USER`
- ✅ `EMAIL_PASS` 
- ✅ `EMAIL_FROM`

**If yes, the email service should work!** 🚀
