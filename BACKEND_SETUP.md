# Backend Setup Guide for Admin Email System

## Current Setup
The admin system currently uses **localStorage** for demo purposes. To make it production-ready, you need to set up a backend server.

## Required Backend Features

### 1. Contact Form API Endpoint
- **POST** `/api/contact` - Save contact form submissions to database
- Store: name, email, subject, message, date

### 2. Admin Authentication
- **POST** `/api/admin/login` - Authenticate admin user
- Use JWT tokens or session-based authentication
- Store credentials securely (hashed passwords)

### 3. Messages API
- **GET** `/api/messages` - Fetch all messages (admin only)
- **PUT** `/api/messages/:id/read` - Mark message as read
- **PUT** `/api/messages/:id/replied` - Mark message as replied
- **DELETE** `/api/messages/:id` - Delete message

### 4. Email Sending API
- **POST** `/api/send-email` - Send email to user
- Use email service: Nodemailer (Node.js), SendGrid, Mailgun, etc.

## Recommended Tech Stack

### Option 1: Node.js + Express
```javascript
// Example with Nodemailer
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sahilkumarsharmaprofessional@gmail.com',
        pass: 'your-app-password' // Use App Password, not regular password
    }
});

app.post('/api/send-email', async (req, res) => {
    const { to, subject, text } = req.body;
    
    await transporter.sendMail({
        from: 'sahilkumarsharmaprofessional@gmail.com',
        to: to,
        subject: subject,
        text: text
    });
    
    res.json({ success: true });
});
```

### Option 2: PHP
```php
<?php
// Use PHPMailer library
use PHPMailer\PHPMailer\PHPMailer;

$mail = new PHPMailer(true);
$mail->isSMTP();
$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;
$mail->Username = 'sahilkumarsharmaprofessional@gmail.com';
$mail->Password = 'your-app-password';
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port = 587;

$mail->setFrom('sahilkumarsharmaprofessional@gmail.com');
$mail->addAddress($to);
$mail->Subject = $subject;
$mail->Body = $message;
$mail->send();
?>
```

### Option 3: Python + Flask
```python
from flask import Flask, request, jsonify
import smtplib
from email.mime.text import MIMEText

@app.route('/api/send-email', methods=['POST'])
def send_email():
    data = request.json
    msg = MIMEText(data['message'])
    msg['Subject'] = data['subject']
    msg['From'] = 'sahilkumarsharmaprofessional@gmail.com'
    msg['To'] = data['to']
    
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login('sahilkumarsharmaprofessional@gmail.com', 'your-app-password')
    server.send_message(msg)
    server.quit()
    
    return jsonify({'success': True})
```

## Gmail Setup (For Gmail SMTP)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in your backend code (NOT your regular password)

## Database Schema

```sql
CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    date DATETIME NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    replied BOOLEAN DEFAULT FALSE,
    replied_date DATETIME NULL
);

CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);
```

## Frontend Updates Needed

Update `admin-script.js` to use real API calls:

```javascript
// Replace localStorage calls with API calls
async function loadMessages() {
    const response = await fetch('/api/messages', {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    });
    const messages = await response.json();
    displayMessages(messages);
}

async function sendEmail(replyData) {
    const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(replyData)
    });
    return await response.json();
}
```

## Security Considerations

1. **Never store passwords in plain text** - Use bcrypt or similar
2. **Use HTTPS** - Always use SSL/TLS in production
3. **Validate inputs** - Sanitize all user inputs
4. **Rate limiting** - Prevent spam/abuse
5. **CORS** - Configure properly for your domain
6. **Environment variables** - Store sensitive data in .env files

## Quick Start with Node.js

1. Install dependencies:
```bash
npm init -y
npm install express nodemailer bcrypt jsonwebtoken cors dotenv
```

2. Create `.env` file:
```
GMAIL_USER=sahilkumarsharmaprofessional@gmail.com
GMAIL_PASS=your-app-password
JWT_SECRET=your-secret-key
```

3. Set up Express server with routes for:
   - Contact form submission
   - Admin login
   - Message retrieval
   - Email sending

## Testing

- Test contact form submission
- Test admin login
- Test message viewing
- Test email sending
- Test message deletion
