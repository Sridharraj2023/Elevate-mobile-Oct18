# Gmail SMTP Quick Fix for Render.com

## 🚨 **Immediate Solution**

The connection timeout issue is common with Gmail SMTP on cloud platforms. Here's a quick fix:

### **Option 1: Alternative Gmail Ports**
Try different Gmail SMTP configurations:

```javascript
// Port 465 (SSL)
{
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
}

// Port 587 (TLS) - Current
{
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
}
```

### **Option 2: Simplified Configuration**
Remove advanced options that might cause issues:

```javascript
{
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
  // Remove: host, port, secure, tls, pool, timeouts
}
```

### **Option 3: Use SendGrid (Recommended)**
Set up SendGrid as primary email service:

1. **Create SendGrid account** (free: 100 emails/day)
2. **Generate API key**
3. **Add to Render.com environment variables:**
   ```bash
   SENDGRID_API_KEY=SG.your_api_key_here
   ```

## 🔧 **Quick Test**

### **Test Gmail Connection:**
```bash
# Add to your backend for testing
const testGmail = async () => {
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });
  
  try {
    await transporter.verify();
    console.log('✅ Gmail connection successful');
  } catch (error) {
    console.log('❌ Gmail connection failed:', error.message);
  }
};
```

## 🎯 **Recommended Action**

1. **Set up SendGrid** (5 minutes)
2. **Add API key to Render.com**
3. **Deploy updated backend**
4. **Test forgot password flow**

**SendGrid will resolve the connection timeout issues on Render.com!** 🚀
