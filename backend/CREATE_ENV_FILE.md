# How to Create .env File

## Method 1: Using Text Editor (Recommended)

1. **Navigate to the backend folder:**
   ```
   D:\porfolio\backend
   ```

2. **Create a new file named `.env`** (with the dot at the beginning)

3. **Copy and paste this content:**
   ```env
   # Flask Configuration
   SECRET_KEY=your-secret-key-change-this-in-production-use-random-string

   # Gmail SMTP Configuration
   GMAIL_USER=sahilkumarsharmaprofessional@gmail.com
   GMAIL_PASS=your-gmail-app-password-here

   # Admin Credentials
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

4. **Replace the values:**
   - `SECRET_KEY`: Use a random string (e.g., generate one online)
   - `GMAIL_PASS`: Your Gmail App Password (16 characters)
   - `ADMIN_PASSWORD`: Your desired admin password

5. **Save the file**

## Method 2: Using Command Line (Windows)

### PowerShell:
```powershell
cd D:\porfolio\backend
@"
# Flask Configuration
SECRET_KEY=your-secret-key-change-this-in-production-use-random-string

# Gmail SMTP Configuration
GMAIL_USER=sahilkumarsharmaprofessional@gmail.com
GMAIL_PASS=your-gmail-app-password-here

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
"@ | Out-File -FilePath .env -Encoding utf8
```

### Command Prompt (CMD):
```cmd
cd D:\porfolio\backend
echo # Flask Configuration > .env
echo SECRET_KEY=your-secret-key-change-this-in-production-use-random-string >> .env
echo. >> .env
echo # Gmail SMTP Configuration >> .env
echo GMAIL_USER=sahilkumarsharmaprofessional@gmail.com >> .env
echo GMAIL_PASS=your-gmail-app-password-here >> .env
echo. >> .env
echo # Admin Credentials >> .env
echo ADMIN_USERNAME=admin >> .env
echo ADMIN_PASSWORD=admin123 >> .env
```

## Method 3: Using VS Code or Any Code Editor

1. Open VS Code in the `backend` folder
2. Click "New File"
3. Name it `.env`
4. Paste the content from Method 1
5. Save

## Important Notes:

- **File must be named exactly `.env`** (with the dot at the beginning)
- **No spaces around the `=` sign** in the .env file
- **Don't use quotes** around values (unless the value itself contains spaces)
- **Never commit .env to Git** - it's already in .gitignore
- **Keep it secure** - contains sensitive passwords

## After Creating .env File:

1. Install python-dotenv (if not already installed):
   ```bash
   pip install python-dotenv
   ```

2. The Flask app will automatically load the .env file when you run it

## Verify .env is Working:

Run the Flask app and check the console output. It should show:
```
Starting Flask server...
Gmail User: sahilkumarsharmaprofessional@gmail.com
Make sure GMAIL_PASS is set in environment variables!
```

If you see your Gmail user, the .env file is being loaded correctly!
