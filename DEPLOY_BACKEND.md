# Manual Backend Deployment Instructions

## Quick Fix for Email Timeout Issue

The backend code has been updated to return immediately, but you need to deploy it to Render.

## Step 1: Commit and Push Changes

1. Open terminal/command prompt in your project folder
2. Run these commands:

```bash
cd backend
git add app.py
git commit -m "Fix email sending timeout - make non-blocking"
git push origin main
```

(Replace `main` with your branch name if different)

## Step 2: Deploy on Render

### Option A: Auto-Deploy (if connected to GitHub)
- Render should automatically detect the push and start deploying
- Go to your Render dashboard
- Check the "Events" tab to see deployment progress
- Wait for deployment to complete (usually 2-5 minutes)

### Option B: Manual Deploy
1. Go to https://dashboard.render.com
2. Select your backend service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait for deployment to complete

## Step 3: Verify Deployment

1. After deployment completes, test the endpoint:
   - Open: `https://shape-portfolio-api.onrender.com/api/health`
   - Should show: `{"status":"ok"}`

2. Check Render logs:
   - Go to your service → "Logs" tab
   - Look for any errors

## Step 4: Test Email Sending

1. Go to your admin dashboard
2. Try sending a reply
3. Should get immediate response (no timeout!)

## If Still Having Issues

### Check Render Logs:
1. Go to Render dashboard → Your service → Logs
2. Try sending an email
3. Look for error messages

### Common Issues:

1. **Gmail Credentials Not Set:**
   - Go to Render → Your service → Environment
   - Add:
     - `GMAIL_USER` = `sahilkumarsharmaprofessional@gmail.com`
     - `GMAIL_PASS` = `[your-16-char-app-password]`
   - Click "Save Changes"
   - Service will auto-restart

2. **Backend Not Responding:**
   - Check if service is "Live" in Render dashboard
   - Check logs for crashes
   - Try restarting the service

3. **Still Timing Out:**
   - Clear browser cache (Ctrl+Shift+R)
   - Check Network tab in DevTools
   - Verify the request goes to correct URL

## Quick Test Command

Test if backend is working:
```bash
curl -X POST https://shape-portfolio-api.onrender.com/api/test-email-endpoint \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: shape-admin-token-2024" \
  -d '{}'
```

Should return immediately with success message.
