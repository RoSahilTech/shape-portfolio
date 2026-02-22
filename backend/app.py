from flask import Flask, request, jsonify, session
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import os
from functools import wraps
import json
from dotenv import load_dotenv
import threading
import socket

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your-secret-key-change-this-in-production')

# Configure CORS - Allow all origins for production
# This allows requests from any origin (you can restrict this to specific domains for security)
@app.after_request
def after_request_cors(response):
    origin = request.headers.get('Origin')
    if origin:
        # Allow requests from any origin (for production)
        # You can restrict this to specific domains for better security
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Credentials'] = 'true'
    else:
        # Fallback: allow all origins if no Origin header
        response.headers['Access-Control-Allow-Origin'] = '*'
    
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Accept, X-Auth-Token'
    response.headers['Access-Control-Expose-Headers'] = 'Content-Type'
    return response

# Handle preflight OPTIONS requests
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        origin = request.headers.get('Origin')
        response = jsonify({})
        if origin:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Credentials'] = 'true'
        else:
            response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Accept, X-Auth-Token'
        return response

# Configuration
GMAIL_USER = os.environ.get('GMAIL_USER', 'sahilkumarsharmaprofessional@gmail.com')
GMAIL_PASS = os.environ.get('GMAIL_PASS', '')  # Set this in environment variable
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')  # Change this!

# In-memory storage (replace with database in production)
messages_db = []
messages_file = 'messages.json'

projects_db = []
projects_file = 'projects.json'

skills_db = []
skills_file = 'skills.json'

# Load messages from file
def load_messages():
    global messages_db
    try:
        if os.path.exists(messages_file):
            with open(messages_file, 'r') as f:
                messages_db = json.load(f)
    except:
        messages_db = []

# Save messages to file
def save_messages():
    try:
        with open(messages_file, 'w') as f:
            json.dump(messages_db, f, indent=2)
    except Exception as e:
        print(f"Error saving messages: {e}")

# Load projects from file
def load_projects():
    global projects_db
    try:
        if os.path.exists(projects_file):
            with open(projects_file, 'r') as f:
                projects_db = json.load(f)
    except Exception as e:
        print(f"Error loading projects: {e}")
        projects_db = []

# Save projects to file
def save_projects():
    try:
        with open(projects_file, 'w') as f:
            json.dump(projects_db, f, indent=2)
    except Exception as e:
        print(f"Error saving projects: {e}")

# Load skills from file
def load_skills():
    global skills_db
    try:
        if os.path.exists(skills_file):
            with open(skills_file, 'r') as f:
                skills_db = json.load(f)
        else:
            # Initialize with default skills if file doesn't exist
            skills_db = [
                {"id": 1, "name": "Electronics Design", "percentage": 90},
                {"id": 2, "name": "Robotics & Automation", "percentage": 85},
                {"id": 3, "name": "Embedded Systems", "percentage": 88},
                {"id": 4, "name": "Microcontroller Programming", "percentage": 87},
                {"id": 5, "name": "Circuit Design", "percentage": 92},
                {"id": 6, "name": "Space Technology", "percentage": 80}
            ]
            save_skills()
    except Exception as e:
        print(f"Error loading skills: {e}")
        skills_db = []

# Save skills to file
def save_skills():
    try:
        with open(skills_file, 'w') as f:
            json.dump(skills_db, f, indent=2)
    except Exception as e:
        print(f"Error saving skills: {e}")

# Load messages on startup
load_messages()
load_projects()


# Simple token-based authentication (for CORS compatibility)
# In production, use proper JWT tokens
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', 'admin-token-change-in-production')

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check for token in header or session
        auth_token = request.headers.get('Authorization') or request.headers.get('X-Auth-Token')
        session_auth = session.get('admin_logged_in', False)
        
        # Allow if session is valid OR token is valid
        if not session_auth and auth_token != f'Bearer {ADMIN_TOKEN}' and auth_token != ADMIN_TOKEN:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated_function

# Email sending function
def send_email(to_email, subject, message_body):
    """Send email using Gmail SMTP"""
    server = None
    try:
        # Check if Gmail credentials are configured
        if not GMAIL_USER or not GMAIL_PASS:
            print("Error: Gmail credentials not configured")
            print(f"GMAIL_USER: {GMAIL_USER if GMAIL_USER else 'NOT SET'}")
            print(f"GMAIL_PASS: {'SET' if GMAIL_PASS else 'NOT SET'}")
            return False
        
        print(f"Attempting to send email to {to_email}...")
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = GMAIL_USER
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Add body
        msg.attach(MIMEText(message_body, 'plain'))
        
        # Connect to Gmail SMTP server with shorter timeout
        print("Connecting to Gmail SMTP server...")
        server = smtplib.SMTP('smtp.gmail.com', 587, timeout=10)  # 10 second connection timeout
        print("Starting TLS...")
        server.starttls(timeout=10)  # 10 second TLS timeout
        print("Logging in...")
        server.login(GMAIL_USER, GMAIL_PASS)  # This can hang if credentials are wrong
        print("Sending email...")
        
        # Send email
        text = msg.as_string()
        server.sendmail(GMAIL_USER, to_email, text)
        print(f"Email sent successfully to {to_email}")
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        print(f"SMTP Authentication Error: {e}")
        print("Make sure you're using a Gmail App Password, not your regular password")
        return False
    except smtplib.SMTPServerDisconnected as e:
        print(f"SMTP Server Disconnected: {e}")
        print("Gmail server disconnected. This might be a temporary issue.")
        return False
    except smtplib.SMTPException as e:
        print(f"SMTP Error: {e}")
        return False
    except (TimeoutError, OSError) as e:
        print(f"Timeout/Connection Error: {e}")
        print("Connection to Gmail SMTP server timed out or failed")
        return False
    except socket.timeout as e:
        print(f"Socket Timeout: {e}")
        print("SMTP connection timed out")
        return False
    except Exception as e:
        print(f"Error sending email: {e}")
        print(f"Error type: {type(e).__name__}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return False
    finally:
        # Always close the connection
        if server:
            try:
                server.quit()
            except:
                pass

# Routes

@app.route('/api/contact', methods=['POST'])
def contact():
    """Handle contact form submission"""
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['name', 'email', 'subject', 'message']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create message object
        message = {
            'id': len(messages_db) + 1,
            'name': data['name'],
            'email': data['email'],
            'subject': data['subject'],
            'message': data['message'],
            'date': datetime.now().isoformat(),
            'read': False,
            'replied': False
        }
        
        # Save message
        messages_db.append(message)
        save_messages()
        
        # Optional: Send notification email to admin
        # notification_subject = f"New Contact Form Submission from {data['name']}"
        # notification_body = f"Name: {data['name']}\nEmail: {data['email']}\nSubject: {data['subject']}\n\nMessage:\n{data['message']}"
        # send_email(GMAIL_USER, notification_subject, notification_body)
        
        return jsonify({
            'success': True,
            'message': 'Thank you for your message! I will get back to you soon.'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    """Admin login endpoint"""
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        # Debug logging (remove in production)
        print(f"Login attempt - Username: {username}")
        print(f"Expected username: {ADMIN_USERNAME}")
        print(f"Password match: {password == ADMIN_PASSWORD}")
        print(f"Username match: {username == ADMIN_USERNAME}")
        
        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            session['admin_logged_in'] = True
            session['admin_username'] = username
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'token': ADMIN_TOKEN  # Return token for client to use
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Invalid credentials. Please check your username and password.'
            }), 401
            
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/logout', methods=['POST'])
def admin_logout():
    """Admin logout endpoint"""
    session.clear()
    return jsonify({'success': True, 'message': 'Logged out successfully'}), 200

@app.route('/api/messages', methods=['GET'])
@admin_required
def get_messages():
    """Get all messages (admin only)"""
    try:
        # Sort by date (newest first)
        sorted_messages = sorted(messages_db, key=lambda x: x['date'], reverse=True)
        return jsonify({
            'success': True,
            'messages': sorted_messages
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/messages/<int:message_id>/read', methods=['PUT'])
@admin_required
def mark_as_read(message_id):
    """Mark message as read"""
    try:
        for message in messages_db:
            if message['id'] == message_id:
                message['read'] = True
                save_messages()
                return jsonify({'success': True}), 200
        return jsonify({'error': 'Message not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/messages/<int:message_id>/replied', methods=['PUT'])
@admin_required
def mark_as_replied(message_id):
    """Mark message as replied"""
    try:
        for message in messages_db:
            if message['id'] == message_id:
                message['replied'] = True
                message['repliedDate'] = datetime.now().isoformat()
                save_messages()
                return jsonify({'success': True}), 200
        return jsonify({'error': 'Message not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/messages/<int:message_id>', methods=['DELETE'])
@admin_required
def delete_message(message_id):
    """Delete a message"""
    try:
        global messages_db
        messages_db = [m for m in messages_db if m['id'] != message_id]
        save_messages()
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/send-email', methods=['POST'])
@admin_required
def send_reply_email():
    """Send reply email to user - returns immediately, sends email in background"""
    try:
        data = request.json
        
        # Validate required fields
        if 'to' not in data or 'subject' not in data or 'message' not in data:
            return jsonify({'success': False, 'error': 'Missing required fields: to, subject, or message'}), 400
        
        # Check if Gmail is configured FIRST (return immediately if not)
        if not GMAIL_USER or not GMAIL_PASS:
            print("ERROR: Gmail credentials not configured")
            print(f"GMAIL_USER: {'SET' if GMAIL_USER else 'NOT SET'}")
            print(f"GMAIL_PASS: {'SET' if GMAIL_PASS else 'NOT SET'}")
            return jsonify({
                'success': False,
                'error': 'Gmail credentials not configured. Please set GMAIL_USER and GMAIL_PASS environment variables in your Render dashboard.'
            }), 500
        
        # Return immediately and send email in background
        print(f"Received email send request: to={data['to']}, subject={data['subject']}")
        print("Starting email send in background thread...")
        
        def send_email_background():
            """Send email in background thread"""
            try:
                print(f"Background thread: Attempting to send email to {data['to']}")
                print(f"Background thread: Using Gmail account: {GMAIL_USER}")
                print(f"Background thread: Gmail password is {'SET' if GMAIL_PASS else 'NOT SET'}")
                
                success = send_email(
                    to_email=data['to'],
                    subject=data['subject'],
                    message_body=data['message']
                )
                
                if success:
                    print(f"✅ Background thread: Email sent successfully to {data['to']}")
                    print(f"✅ Check recipient's inbox (and spam folder) for the email")
                else:
                    print(f"❌ Background thread: Failed to send email to {data['to']}")
                    print(f"❌ Check logs above for the specific error message")
                    print(f"❌ Common issues:")
                    print(f"   1. Gmail credentials not configured in Render")
                    print(f"   2. Gmail App Password is incorrect")
                    print(f"   3. 2-Step Verification not enabled on Gmail account")
            except Exception as e:
                print(f"❌ Background thread: Exception sending email: {e}")
                import traceback
                print(f"Background thread traceback: {traceback.format_exc()}")
        
        # Start email sending in background (don't wait for it)
        thread = threading.Thread(target=send_email_background)
        thread.daemon = True
        thread.start()
        
        # Return immediately - email will send in background
        print("Returning success response immediately, email sending in background")
        return jsonify({
            'success': True,
            'message': 'Email is being sent. You will receive a confirmation once it\'s delivered.'
        }), 200
            
    except Exception as e:
        print(f"Error in send_reply_email: {e}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok'}), 200

@app.route('/api/test-email-endpoint', methods=['POST'])
@admin_required
def test_email_endpoint():
    """Test endpoint to verify email route is working - returns immediately"""
    return jsonify({
        'success': True,
        'message': 'Email endpoint is working! Backend is responding quickly.',
        'timestamp': datetime.now().isoformat()
    }), 200

# ============================================
# PROJECTS API ENDPOINTS
# ============================================

@app.route('/api/projects', methods=['GET'])
def get_projects():
    """Get all projects (filter by status if provided)"""
    # Reload projects from file to ensure we have latest data
    load_projects()
    
    status = request.args.get('status', None)  # 'live' or 'draft'
    
    # Debug logging
    print(f"GET /api/projects - status filter: {status}")
    print(f"Total projects in DB: {len(projects_db)}")
    if projects_db:
        print(f"Project statuses: {[p.get('status', 'N/A') for p in projects_db]}")
        print(f"Project names: {[p.get('name', 'N/A') for p in projects_db]}")
    
    if status:
        filtered_projects = [p for p in projects_db if p.get('status', 'draft') == status]
        print(f"Filtered projects with status '{status}': {len(filtered_projects)}")
        if filtered_projects:
            print(f"Filtered project names: {[p.get('name', 'N/A') for p in filtered_projects]}")
        return jsonify({'success': True, 'projects': filtered_projects})
    
    return jsonify({'success': True, 'projects': projects_db})

def normalize_image_path(image_path):
    """
    Convert whatever the admin pasted (absolute Windows path, relative path,
    or simple filename) into a web-safe path.
    
    - Keeps full URLs (http/https/data) unchanged
    - For absolute paths, strips everything before the 'image' folder if present
      and returns 'image/...'
    - For anything else, just normalizes slashes and returns as‑is
      (we'll add per‑project folders separately).
    """
    if not image_path:
        return image_path
    
    image_path = str(image_path).strip()

    # If it's a full URL or data URI, keep as‑is
    lower = image_path.lower()
    if lower.startswith('http://') or lower.startswith('https://') or lower.startswith('data:'):
        return image_path
    
    # Normalize path separators
    normalized = image_path.replace('\\', '/')
    
    # If it's an absolute Windows/UNIX path
    if ':' in normalized or normalized.startswith('/'):
        # Try to locate an "image" folder in the path
        parts = normalized.split('/')
        image_index = -1
        for i, part in enumerate(parts):
            if part.lower() == 'image':
                image_index = i
                break
        
        if image_index >= 0:
            # Everything after the 'image' folder becomes the relative path
            relative_path = '/'.join(parts[image_index + 1:])
            return f'image/{relative_path}' if relative_path else 'image'
        
        # No 'image' folder in the absolute path – fall back to just the filename
        filename = parts[-1]
        return filename

    # For non‑absolute paths we mostly trust what the admin typed; just normalize slashes
    return normalized


def to_project_image_path(image_path, project_id):
    """
    Take an arbitrary image path from the admin UI and force it into a
    stable per‑project folder:
        image/project/pro<project_id>/<filename>

    This makes the frontend logic predictable and avoids "IMAGE NOT FOUND"
    when editing the same project multiple times.
    """
    if not image_path:
        return None

    base = normalize_image_path(image_path)
    if not base:
        return None

    base = base.replace('\\', '/')

    # If it's a full URL, leave it unchanged (remote image)
    lower = base.lower()
    if lower.startswith('http://') or lower.startswith('https://') or lower.startswith('data:'):
        return base

    # If it already points inside this project's folder, keep as‑is
    parts = base.split('/')
    if (
        len(parts) >= 4
        and parts[0] == 'image'
        and parts[1] == 'project'
        and parts[2] == f'pro{project_id}'
    ):
        return base

    # Otherwise, always map to image/project/pro<id>/<filename>
    filename = parts[-1]
    return f'image/project/pro{project_id}/{filename}'

@app.route('/api/projects', methods=['POST'])
@admin_required
def create_project():
    """Create a new project"""
    data = request.json
    # Determine new project id first so we can optionally derive per-project image folders
    new_project_id = len(projects_db) + 1 if projects_db else 1
    
    # Normalize image paths into per‑project folder
    images = data.get('images', [])
    normalized_images = []
    if images:
        for img in images:
            normalized = to_project_image_path(img, new_project_id)
            if normalized:
                normalized_images.append(normalized)
    
    project = {
        'id': new_project_id,
        'name': data.get('name', ''),
        'mission': data.get('mission', ''),
        'missionBrief': data.get('missionBrief', ''),
        'architecture': data.get('architecture', ''),
        'stack': data.get('stack', []),
        'status': data.get('status', 'draft'),  # 'live' or 'draft'
        'images': normalized_images,  # Array of normalized image paths
        'linkedInLink': data.get('linkedInLink', ''),  # LinkedIn post link
        'reportFile': data.get('reportFile', ''),  # Optional PDF report
        'statusValues': {
            'stability': data.get('stability', 0),
            'range': data.get('range', 0),
            'reliability': data.get('reliability', 0)
        },
        'createdAt': datetime.now().isoformat(),
        'updatedAt': datetime.now().isoformat()
    }
    
    projects_db.append(project)
    save_projects()
    
    # Debug: Print saved project info
    print(f"Created project: ID={project['id']}, Name={project['name']}, Status={project['status']}")
    print(f"Total projects now: {len(projects_db)}")
    
    return jsonify({'success': True, 'project': project})

@app.route('/api/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    """Get a specific project"""
    project = next((p for p in projects_db if p['id'] == project_id), None)
    
    if project:
        return jsonify({'success': True, 'project': project})
    return jsonify({'success': False, 'error': 'Project not found'}), 404

@app.route('/api/projects/<int:project_id>', methods=['PUT'])
@admin_required
def update_project(project_id):
    """Update a project"""
    project = next((p for p in projects_db if p['id'] == project_id), None)
    
    if not project:
        return jsonify({'success': False, 'error': 'Project not found'}), 404
    
    data = request.json
    
    # Normalize image paths if provided (keep everything in project folder)
    if 'images' in data:
        images = data.get('images', [])
        normalized_images = []
        if images:
            for img in images:
                normalized = to_project_image_path(img, project_id)
                if normalized:
                    normalized_images.append(normalized)
        project['images'] = normalized_images
    
    # Update project fields
    project['name'] = data.get('name', project['name'])
    project['mission'] = data.get('mission', project['mission'])
    project['missionBrief'] = data.get('missionBrief', project['missionBrief'])
    project['architecture'] = data.get('architecture', project['architecture'])
    project['stack'] = data.get('stack', project['stack'])
    project['status'] = data.get('status', project['status'])
    project['linkedInLink'] = data.get('linkedInLink', project.get('linkedInLink', ''))
    project['reportFile'] = data.get('reportFile', project.get('reportFile', ''))
    project['statusValues'] = {
        'stability': data.get('stability', project['statusValues'].get('stability', 0)),
        'range': data.get('range', project['statusValues'].get('range', 0)),
        'reliability': data.get('reliability', project['statusValues'].get('reliability', 0))
    }
    project['updatedAt'] = datetime.now().isoformat()
    
    save_projects()
    
    # Debug: Print updated project info
    print(f"Updated project: ID={project['id']}, Name={project['name']}, Status={project['status']}")
    print(f"Total projects now: {len(projects_db)}")
    
    return jsonify({'success': True, 'project': project})

@app.route('/api/projects/<int:project_id>', methods=['DELETE'])
@admin_required
def delete_project(project_id):
    """Delete a project"""
    global projects_db
    projects_db = [p for p in projects_db if p['id'] != project_id]
    save_projects()
    
    return jsonify({'success': True})

@app.route('/api/projects/<int:project_id>/status', methods=['PUT'])
@admin_required
def update_project_status(project_id):
    """Update project status (live/draft)"""
    project = next((p for p in projects_db if p['id'] == project_id), None)
    
    if not project:
        return jsonify({'success': False, 'error': 'Project not found'}), 404
    
    data = request.json
    new_status = data.get('status', 'draft')
    
    if new_status not in ['live', 'draft']:
        return jsonify({'success': False, 'error': 'Invalid status'}), 400
    
    project['status'] = new_status
    project['updatedAt'] = datetime.now().isoformat()
    save_projects()
    
    return jsonify({'success': True, 'project': project})

# ============================================
# SKILLS API ENDPOINTS
# ============================================

@app.route('/api/skills', methods=['GET'])
def get_skills():
    """Get all skills"""
    load_skills()
    return jsonify({'success': True, 'skills': skills_db})

@app.route('/api/skills', methods=['POST'])
@admin_required
def create_skill():
    """Create a new skill"""
    global skills_db
    load_skills()
    
    data = request.json
    new_id = max([s['id'] for s in skills_db], default=0) + 1
    
    skill = {
        'id': new_id,
        'name': data.get('name', ''),
        'percentage': data.get('percentage', 0)
    }
    
    skills_db.append(skill)
    save_skills()
    
    return jsonify({'success': True, 'skill': skill})

@app.route('/api/skills/<int:skill_id>', methods=['PUT'])
@admin_required
def update_skill(skill_id):
    """Update a skill"""
    global skills_db
    load_skills()
    
    skill = next((s for s in skills_db if s['id'] == skill_id), None)
    if not skill:
        return jsonify({'success': False, 'error': 'Skill not found'}), 404
    
    data = request.json
    skill['name'] = data.get('name', skill['name'])
    skill['percentage'] = data.get('percentage', skill['percentage'])
    
    save_skills()
    
    return jsonify({'success': True, 'skill': skill})

@app.route('/api/skills/<int:skill_id>', methods=['DELETE'])
@admin_required
def delete_skill(skill_id):
    """Delete a skill"""
    global skills_db
    load_skills()
    skills_db = [s for s in skills_db if s['id'] != skill_id]
    save_skills()
    
    return jsonify({'success': True})

if __name__ == '__main__':
    print("Starting Flask server...")
    print(f"Gmail User: {GMAIL_USER}")
    print("Make sure GMAIL_PASS is set in environment variables!")
    # Use PORT from environment if provided (needed on most hosting platforms)
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', '1') == '1'
    app.run(debug=debug, host='0.0.0.0', port=port)
