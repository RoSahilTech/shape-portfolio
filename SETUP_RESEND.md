# Setup Resend API for Email (Works on Render Free Tier!)

## Problem
Render's free tier **blocks SMTP connections** (ports 587 and 465). The connection hangs because it's blocked at the network level.

## Solution: Use Resend API
Resend is a modern email API that works perfectly on free tier hosting. It's free for up to **3,000 emails/month**.

## Step 1: Sign Up for Resend

1. Go to: **https://resend.com**
2. Click **"Sign Up"** (free account)
3. Verify your email
4. You'll get **3,000 free emails/month**

## Step 2: Get Your API Key

1. After signing up, go to **Dashboard**
2. Click **"API Keys"** in the sidebar
3. Click **"Create API Key"**
4. Name it: `Portfolio Backend`
5. **Copy the API key** (starts with `re_...`)
   - ⚠️ **Copy it immediately** - you won't see it again!

## Step 3: Add API Key to Render

1. Go to **Render Dashboard** → Your service → **"Environment"** tab
2. Click **"Add Environment Variable"**
3. Add:
   - **Key**: `RESEND_API_KEY`
   - **Value**: `re_...` (paste your API key)
4. Click **"Save Changes"**
5. Service will auto-restart (wait 1-2 minutes)

## Step 4: Verify Domain (Optional but Recommended)

To send from your Gmail address, you need to verify it:

1. Go to Resend Dashboard → **"Domains"**
2. Click **"Add Domain"**
3. For Gmail, you need to verify the domain
4. **OR** use Resend's default domain (emails will come from `onboarding@resend.dev`)

**For now, you can skip domain verification** - emails will work but come from Resend's domain.

## Step 5: Deploy Updated Code

The code has been updated to use Resend API automatically if `RESEND_API_KEY` is set.

```bash
cd backend
git add app.py requirements.txt
git commit -m "Add Resend API support for email sending"
git push origin main
```

Wait 2-5 minutes for Render to deploy.

## Step 6: Test Email Sending

1. Go to your **admin dashboard**
2. Try replying to a message
3. Check **Render logs** - you should see:
   ```
   Attempting to send via Resend API (recommended for free tier)...
   ✅ Email sent successfully via Resend API to [email]
   ```

4. Check recipient's **inbox** (and spam folder)

## How It Works

The updated code:
1. **First tries Resend API** (if `RESEND_API_KEY` is set)
2. **Falls back to SMTP** if Resend fails or isn't configured
3. **Works on Render free tier** (no network blocking!)

## Troubleshooting

### "RESEND_API_KEY not set"
- Make sure you added `RESEND_API_KEY` in Render → Environment
- Wait 1-2 minutes after saving for service to restart
- Check that the key starts with `re_`

### "requests library not installed"
- The code should install it automatically from `requirements.txt`
- If not, Render will show an error in logs
- Make sure `requirements.txt` includes `requests==2.31.0`

### Email not received
- Check **spam folder**
- Check Resend dashboard → **"Emails"** tab to see if it was sent
- Check Render logs for error messages

### Still using SMTP
- Make sure `RESEND_API_KEY` is set correctly
- Check logs - it should say "Attempting to send via Resend API"
- If it says "Trying port 587", Resend isn't configured

## Benefits of Resend

✅ **Works on free tier** (no network blocking)  
✅ **3,000 emails/month free**  
✅ **Fast delivery** (usually < 1 second)  
✅ **Reliable** (99.9% uptime)  
✅ **Easy setup** (just API key)  
✅ **Email tracking** (see if emails were delivered)

## Alternative: SendGrid

If you prefer SendGrid:
1. Sign up: https://sendgrid.com (100 emails/day free)
2. Get API key from dashboard
3. I can update the code to use SendGrid instead

But **Resend is recommended** - it's modern, easy, and has better free tier limits.
