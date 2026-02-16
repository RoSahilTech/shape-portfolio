# Quick Start Guide - Flask Backend

## Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## Step 2: Set Gmail App Password

1. Go to https://myaccount.google.com/
2. Security → 2-Step Verification → App passwords
3. Generate password for "Mail"
4. Copy the 16-character password

## Step 3: Set Environment Variables

**Windows PowerShell:**
```powershell
$env:GMAIL_USER="sahilkumarsharmaprofessional@gmail.com"
$env:GMAIL_PASS="your-16-char-app-password"
$env:ADMIN_USERNAME="admin"
$env:ADMIN_PASSWORD="your-strong-password"
$env:SECRET_KEY="your-secret-key-here"
```

**Windows CMD:**
```cmd
set GMAIL_USER=sahilkumarsharmaprofessional@gmail.com
set GMAIL_PASS=your-16-char-app-password
set ADMIN_USERNAME=admin
set ADMIN_PASSWORD=your-strong-password
set SECRET_KEY=your-secret-key-here
```

**Mac/Linux:**
```bash
export GMAIL_USER="sahilkumarsharmaprofessional@gmail.com"
export GMAIL_PASS="your-16-char-app-password"
export ADMIN_USERNAME="admin"
export ADMIN_PASSWORD="your-strong-password"
export SECRET_KEY="your-secret-key-here"
```

## Step 4: Run the Server

```bash
python app.py
```

You should see:
```
Starting Flask server...
Gmail User: sahilkumarsharmaprofessional@gmail.com
Make sure GMAIL_PASS is set in environment variables!
 * Running on http://0.0.0.0:5000
```

## Step 5: Test the API

Open browser and go to: `http://localhost:5000/api/health`

You should see: `{"status":"ok"}`

## Step 6: Access Admin Panel

1. Open `admin/admin-login.html` in your browser
2. Login with your admin credentials
3. View and reply to messages!

## Troubleshooting

### "Connection error" in frontend?
- Make sure Flask server is running on port 5000
- Check browser console for CORS errors
- Verify API_URL in JavaScript files matches your server

### Email not sending?
- Double-check Gmail app password is correct
- Ensure 2FA is enabled on Gmail
- Check Flask console for error messages

### Port 5000 already in use?
Edit `app.py` last line:
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Change port
```
And update API_URL in frontend files to `http://localhost:5001`
