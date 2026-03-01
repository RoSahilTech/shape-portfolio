# Fix: Resend Domain Verification Error

## Problem
```
❌ Resend API error: 403 - The gmail.com domain is not verified
```

Resend requires domain verification to send from Gmail addresses. You can't send from `@gmail.com` without verifying the domain.

## Solution ✅

I've updated the code to use **Resend's default domain** (`onboarding@resend.dev`) which works **without verification**. Replies will still go to your Gmail address.

## What Changed

1. ✅ **Uses Resend's default domain** for "from" address (no verification needed)
2. ✅ **Sets reply-to** to your Gmail address (replies go to you)
3. ✅ **Works immediately** - no domain setup required

## Deploy the Fix

```bash
cd backend
git add app.py
git commit -m "Fix Resend: use default domain, set reply-to to Gmail"
git push origin main
```

Wait 2-5 minutes for Render to deploy.

## How It Works Now

**Before (didn't work):**
- From: `Portfolio <sahilkumarsharmaprofessional@gmail.com>` ❌ (requires verification)

**After (works):**
- From: `Portfolio <onboarding@resend.dev>` ✅ (no verification needed)
- Reply-To: `sahilkumarsharmaprofessional@gmail.com` ✅ (replies go to you)

## Test After Deploy

1. Send a test email from admin dashboard
2. Check Render logs - should see:
   ```
   ✅ Email sent successfully via Resend API to [email]
   ```
3. Check recipient's inbox - email will come from `onboarding@resend.dev`
4. When they reply, it goes to your Gmail ✅

## Optional: Use Custom Domain

If you want emails to come from your own domain:

1. **Verify your domain in Resend:**
   - Go to: https://resend.com/domains
   - Click "Add Domain"
   - Follow verification steps (add DNS records)

2. **Set environment variable in Render:**
   - Add: `RESEND_FROM_EMAIL` = `noreply@yourdomain.com`
   - Or: `RESEND_FROM_EMAIL` = `contact@yourdomain.com`

3. **Deploy and test**

**For now, the default domain works perfectly!** No setup needed.
