# Fix: Network is Unreachable Error

## Problem Found

The logs show:
```
Timeout/Connection Error: [Errno 101] Network is unreachable
```

This means **Render's free tier is blocking outbound SMTP connections** to Gmail.

## What I Fixed

1. ✅ **Auto-remove spaces from Gmail password** (your password shows 19 chars, should be 16)
2. ✅ **Try port 465 (SSL) as fallback** if port 587 is blocked
3. ✅ **Better error messages** explaining the issue

## Solutions (Choose One)

### Option 1: Upgrade Render Plan (Easiest)

**Render's free tier blocks SMTP connections.** Paid plans allow them.

1. Go to Render dashboard
2. Upgrade to a paid plan (starts at $7/month)
3. SMTP will work immediately

### Option 2: Use Email API Service (Recommended for Free Tier)

Use a service like **Resend**, **SendGrid**, or **Mailgun** instead of SMTP:

#### Using Resend (Free tier: 3,000 emails/month)

1. **Sign up**: https://resend.com
2. **Get API key** from dashboard
3. **Update Render environment variables:**
   - Add: `RESEND_API_KEY` = `[your-api-key]`
4. **I'll update the code** to use Resend API instead of SMTP

#### Using SendGrid (Free tier: 100 emails/day)

1. **Sign up**: https://sendgrid.com
2. **Create API key** in dashboard
3. **Update Render environment variables:**
   - Add: `SENDGRID_API_KEY` = `[your-api-key]`
4. **I'll update the code** to use SendGrid API

### Option 3: Fix Gmail Password First

Your password shows **19 characters** but should be **16**:

1. **Check Render Environment:**
   - Go to Render → Environment tab
   - Look at `GMAIL_PASS` value
   - **Remove ALL spaces** (should be exactly 16 characters, no spaces)
   - Example: `abcd efgh ijkl mnop` → `abcdefghijklmnop`

2. **Generate new App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Generate new password
   - **Copy WITHOUT spaces** (or remove spaces after copying)
   - Update `GMAIL_PASS` in Render

3. **Deploy updated code** (I've already fixed password cleaning)

4. **Test again** - it will now try both port 587 and 465

## What the Updated Code Does

1. **Automatically removes spaces** from Gmail password
2. **Tries port 587 first** (STARTTLS)
3. **Falls back to port 465** (SSL) if 587 fails
4. **Shows clear error messages** if both fail

## Next Steps

### If You Want to Keep Using Gmail SMTP:

1. **Fix the password** (remove spaces, should be 16 chars)
2. **Deploy the updated code** (see below)
3. **Test again** - it will try both ports
4. **If still fails** → Render free tier blocks SMTP → Use Option 2 (Email API)

### If You Want to Use Email API (Recommended):

Tell me which service you prefer:
- **Resend** (easiest, modern, 3,000 emails/month free)
- **SendGrid** (popular, 100 emails/day free)
- **Mailgun** (reliable, 5,000 emails/month free)

I'll update the code to use the API instead of SMTP.

## Deploy Updated Code

```bash
cd backend
git add app.py
git commit -m "Fix email: auto-remove spaces from password, try port 465 fallback"
git push origin main
```

Wait 2-5 minutes for Render to deploy, then test again.

## Check Logs After Deploy

After deploying, send a test email and check logs. You should see:

**If password was fixed:**
```
Gmail password length: 16 chars (should be 16)
Trying port 587 (STARTTLS)...
```

**If port 587 is blocked:**
```
Port 587 failed: [Errno 101] Network is unreachable
Trying port 465 (SSL) as fallback...
```

**If both ports are blocked:**
```
❌ Network/Connection Error: [Errno 101] Network is unreachable
❌ Render might be blocking outbound SMTP connections
❌ This is common on free tier hosting services
```

If you see the last message, you need to either:
- Upgrade Render plan, OR
- Use an email API service (Resend/SendGrid/Mailgun)
