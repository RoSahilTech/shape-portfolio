# How to Run the Flask Server

## Step-by-Step Instructions

### Step 1: Open Terminal/Command Prompt
Navigate to your project folder:
```bash
cd D:\porfolio\backend
```

### Step 2: Install Dependencies (First Time Only)
```bash
pip install -r requirements.txt
```

### Step 3: Verify .env File
Make sure your `.env` file exists and has all values filled:
- `SECRET_KEY` - Your generated secret key
- `GMAIL_USER` - sahilkumarsharmaprofessional@gmail.com
- `GMAIL_PASS` - Your Gmail App Password
- `ADMIN_USERNAME` - admin (or your choice)
- `ADMIN_PASSWORD` - Your admin password

### Step 4: Run the Server
```bash
python app.py
```

You should see:
```
Starting Flask server...
Gmail User: sahilkumarsharmaprofessional@gmail.com
Make sure GMAIL_PASS is set in environment variables!
 * Running on http://0.0.0.0:5000
 * Running on http://127.0.0.1:5000
```

### Step 5: Test the Server
Open your browser and go to:
```
http://localhost:5000/api/health
```

You should see: `{"status":"ok"}`

### Step 6: Access Your Portfolio
1. Open `index.html` in your browser
2. The contact form will now send messages to the Flask backend

### Step 7: Access Admin Panel
1. Open `admin/admin-login.html` in your browser
2. Login with your admin credentials
3. View and reply to messages!

## Troubleshooting

### Port 5000 Already in Use?
Change the port in `app.py` (last line):
```python
app.run(debug=True, host='0.0.0.0', port=5001)
```
Then update `API_URL` in frontend files to `http://localhost:5001`

### Module Not Found Error?
```bash
pip install Flask flask-cors python-dotenv
```

### Gmail Password Error?
- Make sure you're using App Password, not regular password
- Verify 2FA is enabled on Gmail
- Check the password in .env file has no extra spaces

### CORS Errors?
- Make sure flask-cors is installed
- Check browser console for specific error messages

## Running in Background (Optional)

### Windows PowerShell:
```powershell
Start-Process python -ArgumentList "app.py" -WindowStyle Hidden
```

### Or use a terminal that supports background processes

## Stop the Server
Press `Ctrl + C` in the terminal where the server is running
