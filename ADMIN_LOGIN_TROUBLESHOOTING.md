# Admin Login 401 Error - Troubleshooting Guide

## Quick Fix

The 401 error means your username/password doesn't match what's configured on the backend.

## Default Credentials

If you haven't set custom credentials in Render, the defaults are:
- **Username**: `admin`
- **Password**: `admin123`

Try logging in with these first!

## Check Render Environment Variables

1. Go to: https://dashboard.render.com
2. Select your backend service (`shape-portfolio-api`)
3. Click "Environment" tab
4. Look for:
   - `ADMIN_USERNAME` - This is your login username
   - `ADMIN_PASSWORD` - This is your login password

## Solutions

### Option 1: Use Default Credentials

If you haven't set custom credentials in Render:
- **Username**: `admin`
- **Password**: `admin123`

### Option 2: Set Custom Credentials in Render

1. Go to Render → Your service → Environment tab
2. Add/Update:
   - `ADMIN_USERNAME` = `your-username`
   - `ADMIN_PASSWORD` = `your-strong-password`
3. Click "Save Changes"
4. Wait for service to restart (1-2 minutes)
5. Use your custom credentials to login

### Option 3: Check Backend Logs

1. Go to Render → Your service → Logs tab
2. Try logging in
3. Look for messages like:
   ```
   Login attempt - Username: admin
   Expected username: admin
   Password match: True/False
   Username match: True/False
   ```
4. This will show you what credentials the backend expects

## Common Issues

### Issue: "Invalid username or password"
**Solution**: 
- Check Render environment variables
- Make sure you're using the exact username/password (case-sensitive)
- Wait for service to restart after changing credentials

### Issue: "Connection error"
**Solution**:
- Check if backend service is "Live" in Render
- Verify API URL is correct: `https://shape-portfolio-api.onrender.com`
- Check Render logs for errors

### Issue: Still getting 401 after setting credentials
**Solution**:
1. Make sure you saved the environment variables in Render
2. Wait 2-3 minutes for service to restart
3. Clear browser cache and try again
4. Check Render logs to see what credentials it's expecting

## Quick Test

1. **Check if backend is running**:
   - Go to: `https://shape-portfolio-api.onrender.com/api/health`
   - Should show: `{"status":"ok"}`

2. **Try default credentials**:
   - Username: `admin`
   - Password: `admin123`

3. **If that doesn't work**:
   - Check Render environment variables
   - Check Render logs for authentication errors

## Security Note

**Important**: Change the default password in production!

1. Set a strong password in Render environment variables
2. Never commit passwords to GitHub
3. Use environment variables for all sensitive data
