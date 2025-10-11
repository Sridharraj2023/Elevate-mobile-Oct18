# 📧 Email Service Setup for Render.com

## 🎯 **Since your backend is on Render.com:**

### **Step 1: Configure Environment Variables on Render**

1. **Go to your Render.com dashboard**
2. **Select your backend service**
3. **Go to "Environment" tab**
4. **Add these environment variables:**

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=noreply@elevate.com
NODE_ENV=production
```

### **Step 2: Generate Gmail App Password**

1. **Go to Google Account Settings:**
   - Visit: https://myaccount.google.com/
   - Click "Security" → "2-Step Verification" (enable if not already)

2. **Generate App Password:**
   - Go to "Security" → "App passwords"
   - Select "Mail" and "Other (custom name)"
   - Enter "Elevate App" as name
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

3. **Add to Render Environment:**
   ```
   EMAIL_USER = your-email@gmail.com
   EMAIL_PASS = abcd efgh ijkl mnop
   EMAIL_FROM = noreply@elevate.com
   ```

### **Step 3: Deploy Changes**

After adding environment variables, Render will automatically redeploy your service.

## 🔧 **Update Email Service for Production**

Let me also update the email service to work better with Render.com:
