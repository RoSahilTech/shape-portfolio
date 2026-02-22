# Email Not Being Received - Troubleshooting Guide

## Quick Diagnosis Steps

### Step 1: Check Render Logs

1. Go to https://dashboard.render.com
2. Select your backend service
3. Click on "Logs" tab
4. Try sending an email from admin dashboard
5. Look for these messages in the logs:

**If you see:**
- ✅ `"Background thread: Email sent successfully to [email]"` → Email was sent, check spam folder
- ❌ `"Error: Gmail credentials not configured"` → Need to set Gmail credentials
- ❌ `"SMTP Authentication Error"` → Gmail App Password is wrong
- ❌ `"Background thread: Failed to send email"` → Check the error message above it

### Step 2: Verify Gmail Credentials Are Set

1. Go to Render → Your service → "Environment" tab
2. Check if these variables exist:
   - `GMAIL_USER` (should be your Gmail address)
   - `GMAIL_PASS` (should be a 16-character App Password)

**If they're missing or wrong:**
- See "Setting Up Gmail App Password" below

### Step 3: Check Spam Folder

- Gmail might mark automated emails as spam
- Check the recipient's spam/junk folder
- Check "All Mail" folder in Gmail

## Setting Up Gmail App Password

### Step 1: Enable 2-Step Verification

1. Go to: https://myaccount.google.com/security
2. Under "Signing in to Google", click "2-Step Verification"
3. Follow the steps to enable it (if not already enabled)

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords
2. Select "Mail" as the app
3. Select "Other (Custom name)" as device
4. Enter name: "Portfolio Backend"
5. Click "Generate"
6. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Set in Render

1. Go to Render → Your service → Environment
2. Add/Update these variables:
   - `GMAIL_USER` = `sahilkumarsharmaprofessional@gmail.com`
   - `GMAIL_PASS` = `abcdefghijklmnop` (the 16-char password, no spaces)
3. Click "Save Changes"
4. Service will auto-restart

### Step 4: Test Again

1. Wait for service to restart (1-2 minutes)
2. Try sending an email from admin dashboard
3. Check Render logs for success message
4. Check recipient's inbox (and spam folder)

## Common Issues & Solutions

### Issue 1: "Gmail credentials not configured"
**Solution:** Set `GMAIL_USER` and `GMAIL_PASS` in Render environment variables

### Issue 2: "SMTP Authentication Error"
**Solution:** 
- Make sure you're using App Password, not regular password
- App Password should be 16 characters, no spaces
- Make sure 2-Step Verification is enabled

### Issue 3: Email sent but not received
**Solutions:**
- Check spam/junk folder
- Verify recipient email address is correct
- Wait a few minutes (Gmail can be slow)
- Check Gmail "Sent" folder to confirm it was sent

### Issue 4: "Connection timed out"
**Solution:**
- Check internet connectivity
- Gmail SMTP might be temporarily unavailable
- Try again in a few minutes

## Testing Email Sending

### Method 1: Check Render Logs
After sending an email, check logs for:
```
Background thread: Attempting to send email to [email]
Connecting to Gmail SMTP server...
Starting TLS...
Logging in...
Sending email...
Email sent successfully to [email]
Background thread: Email sent successfully to [email]
```

### Method 2: Send Test Email to Yourself
1. In admin dashboard, reply to a message
2. Use your own email as recipient
3. Check your inbox (and spam)

### Method 3: Check Gmail Sent Folder
1. Log into the Gmail account used for sending
2. Check "Sent" folder
3. If email is there, it was sent successfully (might be in recipient's spam)

## Still Not Working?

1. **Check Render Logs** - Look for error messages
2. **Verify App Password** - Make sure it's correct (16 chars, no spaces)
3. **Test with Different Email** - Try sending to a different email address
4. **Check Gmail Account** - Make sure the sending account is active
5. **Wait and Retry** - Sometimes Gmail has delays

## Quick Checklist

- [ ] 2-Step Verification enabled on Gmail
- [ ] App Password generated (16 characters)
- [ ] `GMAIL_USER` set in Render (your Gmail address)
- [ ] `GMAIL_PASS` set in Render (App Password, no spaces)
- [ ] Service restarted after setting credentials
- [ ] Checked Render logs for errors
- [ ] Checked spam folder
- [ ] Verified recipient email is correct
