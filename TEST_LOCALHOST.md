# Testing Email on Localhost - Step by Step Guide

## Step 1: Create .env File

1. Go to `D:\porfolio\backend` folder
2. Create a new file named `.env` (with the dot at the beginning)
3. Add this content:

```env
# Flask Configuration
SECRET_KEY=your-secret-key-here-change-this

# Gmail SMTP Configuration
GMAIL_USER=sahilkumarsharmaprofessional@gmail.com
GMAIL_PASS=your-16-character-gmail-app-password

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

4. **Replace `GMAIL_PASS`** with your actual Gmail App Password (16 characters, no spaces)

### How to Get Gmail App Password:
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" → "Other (Custom name)" → Enter "Portfolio Test"
3. Click "Generate"
4. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)
5. Paste it in `.env` file (remove spaces: `abcdefghijklmnop`)

## Step 2: Install Dependencies

Open terminal in `D:\porfolio\backend`:

```bash
cd D:\porfolio\backend
pip install -r requirements.txt
```

## Step 3: Update Frontend to Use Localhost

You need to temporarily change the API URL in your frontend files:

### Update `admin/admin-login.html`:
Find this line (around line 196):
```javascript
const API_URL = 'https://shape-portfolio-api.onrender.com';
```

Change to:
```javascript
const API_URL = 'http://localhost:5000';
```

### Update `admin/admin-script.js`:
Find this line (around line 2):
```javascript
const API_URL = 'https://shape-portfolio-api.onrender.com';
```

Change to:
```javascript
const API_URL = 'http://localhost:5000';
```

### Update `script.js`:
Find this line (around line 288 and 364):
```javascript
const API_URL = 'https://shape-portfolio-api.onrender.com';
```

Change to:
```javascript
const API_URL = 'http://localhost:5000';
```

## Step 4: Run the Backend Server

In terminal (in `D:\porfolio\backend` folder):

```bash
python app.py
```

You should see:
```
Starting Flask server...
Gmail User: sahilkumarsharmaprofessional@gmail.com
 * Running on http://127.0.0.1:5000
 * Running on http://0.0.0.0:5000
```

**Keep this terminal open!** The server needs to keep running.

## Step 5: Test the Server

1. Open browser
2. Go to: `http://localhost:5000/api/health`
3. Should see: `{"status":"ok"}`

## Step 6: Test Email Sending

1. Open your admin dashboard: `http://localhost:3000/admin/admin-dashboard.html`
   - Or open `admin/admin-dashboard.html` directly in browser
2. Login with your admin credentials
3. Try sending a reply to a message
4. **Watch the terminal** where Flask is running - you'll see detailed logs!

## What to Look For in Terminal

### ✅ If Working Correctly:
```
📧 EMAIL SEND REQUEST RECEIVED
   To: [email]
   Subject: [subject]
   GMAIL_USER: sahilkumarsharmaprofessional@gmail.com
   GMAIL_PASS: SET (16 chars)
🔄 BACKGROUND THREAD STARTED
   Attempting to send email to [email]
   Using Gmail account: sahilkumarsharmaprofessional@gmail.com
   Gmail password is: SET (16 chars)
Attempting to send email to [email]...
Connecting to Gmail SMTP server...
Starting TLS...
Logging in...
Sending email...
Email sent successfully to [email]
✅ SUCCESS: Email sent successfully to [email]
```

### ❌ If Gmail Credentials Not Set:
```
GMAIL_PASS: NOT SET - THIS IS THE PROBLEM!
❌ ERROR: Gmail credentials are NOT configured!
```

### ❌ If App Password Wrong:
```
SMTP Authentication Error: [error message]
Make sure you're using a Gmail App Password, not your regular password
```

## Step 7: Check Your Email

1. Check the recipient's inbox
2. **Check spam/junk folder** (very important!)
3. Check "All Mail" in Gmail

## Troubleshooting

### Port 5000 Already in Use?
Change port in `app.py` (last line):
```python
app.run(debug=True, host='0.0.0.0', port=5001)
```
Then update API_URL to `http://localhost:5001`

### "Module not found" Error?
```bash
pip install Flask flask-cors python-dotenv
```

### Email Not Sending?
1. Check terminal for error messages
2. Verify Gmail App Password is correct (16 chars, no spaces)
3. Make sure 2-Step Verification is enabled on Gmail
4. Check `.env` file has no extra spaces around `=`

### CORS Errors?
- Make sure Flask server is running
- Check browser console for specific errors
- Make sure API_URL is `http://localhost:5000` (not `https://`)

## After Testing Locally

Once email works on localhost:

1. **Revert API URLs** back to production:
   - Change `http://localhost:5000` back to `https://shape-portfolio-api.onrender.com`
   - In: `admin/admin-login.html`, `admin/admin-script.js`, `script.js`

2. **Deploy to Render** with the same `.env` values:
   - Set `GMAIL_USER` and `GMAIL_PASS` in Render environment variables
   - Use the same App Password that worked locally

## Quick Test Checklist

- [ ] `.env` file created in `backend` folder
- [ ] Gmail App Password generated and added to `.env`
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend API URLs changed to `http://localhost:5000`
- [ ] Flask server running (`python app.py`)
- [ ] Health check works (`http://localhost:5000/api/health`)
- [ ] Tested sending email from admin dashboard
- [ ] Checked terminal logs for success/errors
- [ ] Checked recipient's inbox and spam folder

## Pro Tip

Keep the terminal open while testing - you'll see all the detailed logs in real-time, making it much easier to debug!
