# Deploy Logging Fix - See Email Logs in Render

## Problem
The email sending logs weren't appearing in Render, making it impossible to debug email issues.

## Solution
Updated all `print()` statements to use `log_print()` which:
- Flushes output immediately (ensures logs appear in Render)
- Uses Python's logging module as backup
- Guarantees logs are visible in Render's log viewer

## Step 1: Deploy Updated Code

### Option A: If Using Git (Recommended)

1. **Open terminal/command prompt** in your project folder:
   ```bash
   cd backend
   ```

2. **Check if you have changes:**
   ```bash
   git status
   ```

3. **Add and commit the changes:**
   ```bash
   git add app.py
   git commit -m "Fix logging - ensure email logs appear in Render"
   git push origin main
   ```
   (Replace `main` with your branch name if different)

4. **Wait for Render to auto-deploy:**
   - Go to Render dashboard → Your service → "Events" tab
   - You should see a new deployment starting
   - Wait 2-5 minutes for it to complete

### Option B: Manual Deploy on Render

1. Go to https://dashboard.render.com
2. Select your backend service: `shape-portfolio-api`
3. Click **"Manual Deploy"** → **"Deploy latest commit"**
4. Wait for deployment to complete (2-5 minutes)

## Step 2: Verify Deployment

1. **Check if service is running:**
   - Go to Render → Your service
   - Status should be "Live" (green)

2. **Test the health endpoint:**
   - Open: `https://shape-portfolio-api.onrender.com/api/health`
   - Should show: `{"status":"ok"}`

## Step 3: Test Email and Check Logs

1. **Send a test email:**
   - Go to your admin dashboard
   - Reply to a message
   - You should get an immediate success response

2. **Check Render logs immediately:**
   - Go to Render → Your service → **"Logs"** tab
   - **Scroll down** to see the most recent logs
   - **Look for these messages:**

### ✅ You Should Now See:

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

### ❌ If You See Errors:

**"GMAIL_PASS: NOT SET"**
- Go to Render → Environment tab
- Make sure `GMAIL_PASS` is set correctly (16 characters, no spaces)

**"SMTP Authentication Error"**
- Your Gmail App Password is incorrect
- Generate a new one at: https://myaccount.google.com/apppasswords
- Update `GMAIL_PASS` in Render

**"Connection timed out"**
- Gmail might be blocking the connection
- Check if 2-Step Verification is enabled
- Try generating a new App Password

## Step 4: If Logs Still Don't Appear

1. **Check log filter:**
   - In Render logs, make sure filter shows "All logs" (not just errors)
   - Try searching for "EMAIL" in the log search box

2. **Check deployment:**
   - Go to Render → Events tab
   - Make sure the latest deployment completed successfully
   - If it failed, check the error message

3. **Restart the service:**
   - Go to Render → Your service
   - Click "Manual Deploy" → "Clear build cache & deploy"
   - Wait for restart

4. **Verify code is deployed:**
   - Check if you see "Starting Flask server..." in logs when service starts
   - If you don't see this, the code might not be deployed

## Troubleshooting

### Logs show "GMAIL_PASS: NOT SET" but you set it:
1. Go to Render → Environment tab
2. Check that `GMAIL_PASS` value has **no spaces** (remove any spaces)
3. Click "Save Changes"
4. Service will auto-restart
5. Try sending email again

### Still not seeing logs:
1. Make sure you're looking at the **most recent logs** (scroll down)
2. Try refreshing the logs page
3. Check if there are multiple instances (look at instance ID in logs)
4. Make sure you're checking logs **right after** sending the email

## Next Steps

Once you see the logs:
- If you see "✅ SUCCESS" → Email was sent, check recipient's spam folder
- If you see "❌ FAILED" → Check the error message above it for details
- Share the log output with me if you need help interpreting it
