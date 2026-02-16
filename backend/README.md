# Flask Backend for Portfolio Admin System

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

Or use virtual environment (recommended):

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Gmail App Password

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security → 2-Step Verification → App passwords
4. Generate an app password for "Mail"
5. Copy the generated password

### 3. Set Environment Variables

**Option 1: Create .env file (recommended)**

Create a `.env` file in the `backend` folder:

```env
SECRET_KEY=your-secret-key-change-this-in-production
GMAIL_USER=sahilkumarsharmaprofessional@gmail.com
GMAIL_PASS=your-gmail-app-password-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-strong-password-here
```

**Option 2: Set environment variables directly**

On Windows (PowerShell):
```powershell
$env:SECRET_KEY="your-secret-key"
$env:GMAIL_USER="sahilkumarsharmaprofessional@gmail.com"
$env:GMAIL_PASS="your-app-password"
$env:ADMIN_USERNAME="admin"
$env:ADMIN_PASSWORD="your-password"
```

On Mac/Linux:
```bash
export SECRET_KEY="your-secret-key"
export GMAIL_USER="sahilkumarsharmaprofessional@gmail.com"
export GMAIL_PASS="your-app-password"
export ADMIN_USERNAME="admin"
export ADMIN_PASSWORD="your-password"
```

### 4. Run the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

### 5. Update Frontend to Use API

The frontend JavaScript files need to be updated to call the Flask API endpoints instead of using localStorage.

## API Endpoints

### Contact Form
- **POST** `/api/contact` - Submit contact form
  - Body: `{ "name": "...", "email": "...", "subject": "...", "message": "..." }`

### Admin Authentication
- **POST** `/api/admin/login` - Admin login
  - Body: `{ "username": "...", "password": "..." }`
- **POST** `/api/admin/logout` - Admin logout

### Messages (Admin Only)
- **GET** `/api/messages` - Get all messages
- **PUT** `/api/messages/<id>/read` - Mark message as read
- **PUT** `/api/messages/<id>/replied` - Mark message as replied
- **DELETE** `/api/messages/<id>` - Delete message

### Email
- **POST** `/api/send-email` - Send reply email
  - Body: `{ "to": "...", "subject": "...", "message": "..." }`

### Health Check
- **GET** `/api/health` - Server health check

## Production Deployment

### Using Gunicorn (Recommended)

1. Install Gunicorn:
```bash
pip install gunicorn
```

2. Run with Gunicorn:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Using Waitress (Windows-friendly)

1. Install Waitress:
```bash
pip install waitress
```

2. Create `run_production.py`:
```python
from waitress import serve
from app import app

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=5000)
```

3. Run:
```bash
python run_production.py
```

## Security Notes

1. **Never commit `.env` file** - Add it to `.gitignore`
2. **Change default admin password** - Use a strong password
3. **Use HTTPS in production** - Set up SSL certificate
4. **Rate limiting** - Consider adding rate limiting to prevent abuse
5. **Database** - Replace in-memory storage with a proper database (SQLite, PostgreSQL, etc.)

## Database Migration (Optional)

For production, consider using a database:

```python
# Example with SQLite
import sqlite3

def init_db():
    conn = sqlite3.connect('messages.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS messages
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL,
                  email TEXT NOT NULL,
                  subject TEXT NOT NULL,
                  message TEXT NOT NULL,
                  date TEXT NOT NULL,
                  read INTEGER DEFAULT 0,
                  replied INTEGER DEFAULT 0,
                  replied_date TEXT)''')
    conn.commit()
    conn.close()
```

## Troubleshooting

### Email not sending?
- Check Gmail app password is correct
- Ensure 2FA is enabled on Gmail account
- Check firewall/antivirus isn't blocking SMTP

### CORS errors?
- Make sure `flask-cors` is installed
- Check CORS settings in `app.py`

### Port already in use?
- Change port in `app.py`: `app.run(port=5001)`
- Or kill the process using port 5000
