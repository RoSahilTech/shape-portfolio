# How to Check Email Sending in Render Logs

## Step-by-Step: Find Email Sending Logs

### Step 1: Open Render Logs

1. Go to: https://dashboard.render.com
2. Click on your backend service: `shape-portfolio-api`
3. Click **"Logs"** tab (left sidebar)

### Step 2: Send a Test Email

1. Go to your admin dashboard
2. Try replying to a message
3. **Immediately go back to Render logs**

### Step 3: Look for These Messages

**Scroll down in the logs** and look for messages with these patterns:

#### ✅ If Gmail Credentials ARE Set:
You should see:
```
================================================================================
📧 EMAIL SEND REQUEST RECEIVED
   To: [email address]
   Subject: [subject]
   GMAIL_USER: sahilkumarsharmaprofessional@gmail.com
   GMAIL_PASS: SET (16 chars)
================================================================================
✅ Returning success response immediately, email sending in background thread
================================================================================
🔄 BACKGROUND THREAD STARTED
   Attempting to send email to: [email]
   Using Gmail account: sahilkumarsharmaprofessional@gmail.com
   Gmail password is: SET (16 chars)
================================================================================
Attempting to send email to [email]...
Connecting to Gmail SMTP server...
Starting TLS...
Logging in...
Sending email...
Email sent successfully to [email]
================================================================================
✅ SUCCESS: Email sent successfully to [email]
✅ The recipient should check their inbox AND spam folder
================================================================================
```

#### ❌ If Gmail Credentials are NOT Set:
You should see:
```
================================================================================
📧 EMAIL SEND REQUEST RECEIVED
   GMAIL_USER: sahilkumarsharmaprofessional@gmail.com
   GMAIL_PASS: NOT SET
================================================================================
```

OR

```
GMAIL_PASS: NOT SET - THIS IS THE PROBLEM!
❌ ERROR: Gmail credentials are NOT configured!
❌ Please set GMAIL_USER and GMAIL_PASS in Render environment variables
```

#### ❌ If Gmail App Password is Wrong:
You should see:
```
SMTP Authentication Error: [error message]
Make sure you're using a Gmail App Password, not your regular password
❌ FAILED: Could not send email to [email]
```

---

## What to Do Based on Logs

### If You See "GMAIL_PASS: NOT SET"

**Solution**: Set Gmail credentials in Render:

1. Go to Render → Your service → **Environment** tab
2. Click **"+ Add"**
3. Add:
   - **Key**: `GMAIL_USER`
   - **Value**: `sahilkumarsharmaprofessional@gmail.com`
   - Click **"Add"**
4. Click **"+ Add"** again
5. Add:
   - **Key**: `GMAIL_PASS`
   - **Value**: `[your-16-char-app-password]` (no spaces)
   - Click **"Add"**
6. Wait 1-2 minutes for service to restart
7. Try sending email again
8. Check logs again

### If You See "SMTP Authentication Error"

**Solution**: 
1. Generate a new Gmail App Password
2. Make sure it's exactly 16 characters (no spaces)
3. Update `GMAIL_PASS` in Render
4. Wait for restart and try again

### If You See "✅ SUCCESS: Email sent successfully"

**But email not received?**
1. Check recipient's **spam/junk folder**
2. Wait a few minutes (Gmail can be slow)
3. Check Gmail "Sent" folder to confirm it was sent
4. Verify recipient email address is correct

---

## Quick Test

1. **Send an email** from admin dashboard
2. **Immediately check Render logs** (scroll to bottom)
3. **Look for the messages above**
4. **Share what you see** - this will tell us exactly what's wrong!

---

## Pro Tip

Use the **search box** in Render logs:
- Search for: `EMAIL SEND REQUEST`
- Search for: `BACKGROUND THREAD`
- Search for: `GMAIL_PASS`
- Search for: `SUCCESS` or `FAILED`

This will quickly find the relevant log entries!
