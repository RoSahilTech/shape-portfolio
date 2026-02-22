# SHAPE Portfolio – Complete Deployment Guide

This comprehensive guide will walk you through deploying your SHAPE portfolio website from scratch. It assumes you're on **Windows** and have **never deployed a website before**.

---

## 📋 Table of Contents

1. [Prerequisites](#0-prerequisites-do-once)
2. [GitHub Setup](#1-put-the-project-on-github)
3. [Backend Deployment (Render)](#2-deploy-the-flask-backend-api-to-render)
4. [Update Frontend API URLs](#3-point-the-frontend-to-the-deployed-api)
5. [Frontend Deployment (Netlify)](#4-deploy-the-static-frontend-to-netlify)
6. [Verification & Testing](#5-verify-the-full-system)
7. [Troubleshooting](#6-troubleshooting)
8. [Custom Domain (Optional)](#7-optional--custom-domain)

---

## 0. Prerequisites (do once)

Before starting, ensure you have everything installed and accounts created.

### 0.1 Install Git for Windows

1. **Download Git**:
   - Go to: `https://git-scm.com/downloads`
   - Click "Download for Windows"
   - The file will be something like `Git-2.x.x-64-bit.exe`

2. **Install Git**:
   - Run the downloaded installer
   - **Important**: Keep all default options (especially "Git from the command line and also from 3rd-party software")
   - Click "Next" through all screens
   - Click "Install"
   - Wait for installation to complete
   - Click "Finish"

3. **Verify Git is installed**:
   - Open PowerShell (press `Win + X` → select "Windows PowerShell" or "Terminal")
   - Type: `git --version`
   - You should see something like: `git version 2.x.x`
   - If you see an error, Git is not in your PATH - restart your computer and try again

### 0.2 Install Python 3

1. **Download Python**:
   - Go to: `https://www.python.org/downloads/`
   - Click the big yellow "Download Python 3.x.x" button
   - The file will be something like `python-3.x.x-amd64.exe`

2. **Install Python**:
   - Run the downloaded installer
   - **CRITICAL**: Check the box "Add Python to PATH" at the bottom of the first screen
   - Click "Install Now"
   - Wait for installation to complete
   - Click "Close"

3. **Verify Python is installed**:
   - Open PowerShell
   - Type: `python --version`
   - You should see: `Python 3.x.x`
   - Also type: `pip --version`
   - You should see: `pip x.x.x from ...`

### 0.3 Create Required Accounts

You'll need accounts on three platforms:

1. **GitHub** (for storing your code):
   - Go to: `https://github.com`
   - Click "Sign up"
   - Enter email, password, username
   - Verify your email
   - Complete the setup wizard

2. **Render** (for hosting the backend API):
   - Go to: `https://render.com`
   - Click "Get Started for Free"
   - Click "Sign up with GitHub"
   - Authorize Render to access your GitHub account
   - Complete the signup

3. **Netlify** (for hosting the frontend):
   - Go to: `https://netlify.com`
   - Click "Sign up"
   - Click "Sign up with GitHub"
   - Authorize Netlify to access your GitHub account
   - Complete the signup

### 0.4 Verify Your Project Structure

Your project folder should be at: `D:\porfolio`

Open File Explorer and navigate to `D:\porfolio`. You should see:

```
D:\porfolio\
├── index.html              (Welcome page)
├── portfolio.html          (Main portfolio page)
├── projects.html           (Projects showcase page)
├── resume.html             (Resume page)
├── projects-script.js      (Projects page JavaScript)
├── projects-styles.css     (Projects page styles)
├── script.js               (Main portfolio JavaScript)
├── styles.css              (Main portfolio styles)
├── backend\
│   ├── app.py              (Flask API server)
│   ├── requirements.txt    (Python dependencies)
│   ├── projects.json       (Project data storage)
│   ├── messages.json       (Contact messages storage)
│   └── skills.json         (Skills data storage)
└── admin\
    ├── admin-login.html    (Admin login page)
    ├── admin-dashboard.html (Admin dashboard)
    └── admin-script.js      (Admin dashboard JavaScript)
```

**If any of these files are missing**, make sure you're in the correct folder.

---

## 1. Put the project on GitHub

GitHub will store your code and allow Render and Netlify to access it automatically.

### 1.1 Initialize Git in Your Project Folder

1. **Open PowerShell**:
   - Press `Win + X`
   - Select "Windows PowerShell" or "Terminal"
   - Or press `Win + R`, type `powershell`, press Enter

2. **Navigate to your project folder**:
   ```powershell
   cd D:\porfolio
   ```
   - Press Enter
   - You should see: `PS D:\porfolio>`

3. **Initialize Git repository**:
   ```powershell
   git init
   ```
   - You should see: `Initialized empty Git repository in D:/porfolio/.git/`

4. **Create a `.gitignore` file** (optional but recommended):
   ```powershell
   echo "__pycache__/" > .gitignore
   echo "*.pyc" >> .gitignore
   echo ".env" >> .gitignore
   echo ".vscode/" >> .gitignore
   ```
   - This prevents Git from tracking unnecessary files

5. **Add all files to Git**:
   ```powershell
   git add .
   ```
   - This stages all files for commit
   - No output means success

6. **Create your first commit**:
   ```powershell
   git commit -m "Initial SHAPE portfolio commit"
   ```
   - You should see a list of files being committed
   - If you see "Author identity unknown", run:
     ```powershell
     git config --global user.name "Your Name"
     git config --global user.email "your.email@example.com"
     ```
     Then run the commit command again

### 1.2 Create GitHub Repository

1. **Go to GitHub**:
   - Open `https://github.com` in your browser
   - Make sure you're logged in

2. **Create a new repository**:
   - Click your profile picture (top right)
   - Click "Your repositories"
   - Click the green "New" button (or go to `https://github.com/new`)

3. **Fill in repository details**:
   - **Repository name**: `shape-portfolio` (or any name you like)
   - **Description**: "SHAPE Portfolio Website" (optional)
   - **Visibility**: Choose **Public** (required for free Render/Netlify)
   - **DO NOT** check "Add a README file" (we already have files)
   - **DO NOT** check "Add .gitignore" (we already have one)
   - **DO NOT** check "Choose a license"

4. **Click "Create repository"**

5. **Copy the repository URL**:
   - GitHub will show you a page with setup instructions
   - Look for a URL like: `https://github.com/your-username/shape-portfolio.git`
   - Copy this URL (you'll need it in the next step)

### 1.3 Connect Local Folder to GitHub

Back in PowerShell (still in `D:\porfolio`):

1. **Set the main branch name**:
   ```powershell
   git branch -M main
   ```

2. **Add GitHub as remote** (replace `<your-username>` and `<repo-name>` with your actual values):
   ```powershell
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   ```
   Example:
   ```powershell
   git remote add origin https://github.com/johndoe/shape-portfolio.git
   ```

3. **Push your code to GitHub**:
   ```powershell
   git push -u origin main
   ```
   - GitHub will ask for your username and password
   - **Username**: Your GitHub username
   - **Password**: You need a **Personal Access Token** (not your GitHub password)
     - See section 1.4 below for how to create one

### 1.4 Create GitHub Personal Access Token

GitHub no longer accepts passwords for Git operations. You need a token:

1. **Go to GitHub Settings**:
   - Click your profile picture → "Settings"
   - Or go to: `https://github.com/settings/profile`

2. **Navigate to Developer Settings**:
   - Scroll down in the left sidebar
   - Click "Developer settings" (at the bottom)

3. **Create Personal Access Token**:
   - Click "Personal access tokens" → "Tokens (classic)"
   - Click "Generate new token" → "Generate new token (classic)"

4. **Configure the token**:
   - **Note**: "Portfolio Deployment" (or any description)
   - **Expiration**: Choose "90 days" or "No expiration" (your choice)
   - **Select scopes**: Check `repo` (this gives full repository access)
   - Scroll down and click "Generate token"

5. **Copy the token**:
   - **IMPORTANT**: Copy the token immediately (it looks like `ghp_xxxxxxxxxxxxxxxxxxxx`)
   - You won't be able to see it again
   - Save it somewhere safe (password manager, text file, etc.)

6. **Use the token**:
   - When Git asks for password, paste the token instead
   - Username: Your GitHub username
   - Password: The token you just copied

### 1.5 Verify Upload Success

1. **Go back to your GitHub repository page**:
   - Refresh the page: `https://github.com/your-username/shape-portfolio`

2. **You should see**:
   - All your files listed (index.html, backend/, admin/, etc.)
   - A green checkmark indicating the repository is set up

3. **Test future updates**:
   - Make a small change to any file (e.g., add a comment)
   - In PowerShell:
     ```powershell
     git add .
     git commit -m "Test update"
     git push
     ```
   - Refresh GitHub - you should see the change

**From now on**, whenever you make changes to your code:
```powershell
git add .
git commit -m "Description of what you changed"
git push
```

---

## 2. Deploy the Flask Backend (API) to Render

Render will host your Flask API server that provides data to your frontend.

### 2.1 Check Backend Requirements File

Before deploying, ensure `backend/requirements.txt` exists and contains:

```
Flask==3.0.0
flask-cors==4.0.0
```

**If the file doesn't exist or is incomplete**:

1. Navigate to `D:\porfolio\backend` in PowerShell:
   ```powershell
   cd D:\porfolio\backend
   ```

2. Create/update requirements.txt:
   ```powershell
   echo Flask==3.0.0 > requirements.txt
   echo flask-cors==4.0.0 >> requirements.txt
   ```

3. Go back to project root:
   ```powershell
   cd ..
   ```

4. Commit the file:
   ```powershell
   git add backend/requirements.txt
   git commit -m "Add requirements.txt"
   git push
   ```

### 2.2 Create Web Service on Render

1. **Go to Render Dashboard**:
   - Open `https://render.com` in your browser
   - Make sure you're logged in
   - You should see your dashboard

2. **Create New Web Service**:
   - Click the **"New +"** button (top right)
   - Select **"Web Service"** from the dropdown

3. **Connect GitHub Repository**:
   - Render will show "Connect a repository"
   - If you see your `shape-portfolio` repo, click **"Connect"**
   - If you don't see it:
     - Click "Configure account" or "Connect GitHub"
     - Authorize Render to access your repositories
     - Refresh the page
     - Your repo should now appear

4. **Select Your Repository**:
   - Click on `shape-portfolio` (or whatever you named it)
   - Click **"Connect"**

5. **Configure Service Settings**:

   Fill in these fields **exactly**:

   - **Name**: `shape-portfolio-api` (or any name - this becomes part of your URL)
   - **Region**: Choose the closest to you (e.g., "Oregon (US West)" for US, "Frankfurt (EU)" for Europe)
   - **Branch**: `main` (should be selected by default)
   - **Runtime**: `Python 3` (select from dropdown)
   - **Build Command**: 
     ```
     pip install -r requirements.txt
     ```
   - **Start Command**: 
     ```
     python app.py
     ```
   - **Root Directory**: 
     ```
     backend
     ```
     ⚠️ **CRITICAL**: This tells Render to look in the `backend` folder for `app.py` and `requirements.txt`

6. **Choose Plan**:
   - You'll see a section called **"Instance Types"**
   - Under **"For hobby projects"**, you'll see a purple box with **"Free"** plan
   - Click on the **"Free"** plan box (it shows "$0 / month", "512 MB RAM", "0.1 CPU")
   - ⚠️ **Note**: Free plan limitations:
     - Service spins down after 15 minutes of inactivity
     - First request after spin-down takes ~30 seconds
     - This is fine for portfolios (you don't need to upgrade)

7. **Click "Create Web Service"**:
   - Scroll down to the bottom of the page
   - Click the blue **"Create Web Service"** button
   - Render will start deploying immediately
   - You'll be redirected to your service page
   - You'll see build logs in real-time at the bottom
   - **First deployment takes 5-10 minutes** - be patient!

### 2.3 Add Environment Variables

**IMPORTANT**: You can add environment variables while the deployment is running OR after it completes. Both work!

**What You'll See on Screen**:
When you're on the Environment page, you'll see:
- **Left sidebar**: Navigation menu with "Environment" highlighted (purple)
- **Main area**: 
  - Top: Your service URL (e.g., `https://shape-portfolio-api.onrender.com`)
  - Heading: "Environment"
  - Section: "Environment Variables" with description text
  - **"+ Add" button** - This is what you'll click!
  
**When you click "+ Add"**, a dropdown menu appears with:
- ✅ **"New variable"** ← Click this for each variable you want to add
- "Datastore URL >" (ignore)
- "Generated secret" (ignore)  
- "Import from .env" (ignore)

1. **Navigate to Environment Tab**:
   - On your Render service page (after clicking "Create Web Service")
   - Look at the **left sidebar** - you'll see tabs like:
     - Overview
     - **Environment** ← Click this one!
     - Events
     - Logs
     - Settings
   - OR look at the **top tabs** - click **"Environment"** tab
   - You'll see a section called **"Environment Variables"**

2. **Understanding the Interface**:
   - You'll see a section called **"Environment Variables"**
   - There's a **"+ Add"** button - click it!
   - A dropdown menu will appear with 4 options:
     - ✅ **"New variable"** ← Click this one!
     - "Datastore URL >" (ignore this)
     - "Generated secret" (ignore this)
     - "Import from .env" (ignore this)
   - Click **"New variable"** from the dropdown

3. **Add Your First Variable - SECRET_KEY**:

   **Step 1**: Generate a random SECRET_KEY
   - Open PowerShell on your computer
   - Run this command:
     ```powershell
     python -c "import secrets; print(secrets.token_urlsafe(32))"
     ```
   - Copy the output (it will be a long random string like `xK9mP2qR7vW4nT8yU1zA5bC6dE3fG0hI2jK4lM6nO8pQ0`)
   - Keep this copied - you'll need it

   **Step 2**: Add it to Render
   - After clicking "New variable", you'll see two input fields appear:
     - **Left field** (Key/Name): Type `SECRET_KEY`
     - **Right field** (Value): Paste the random string you copied
   - Click **"Add"** button (or the checkmark/save icon)
   - ✅ You should see `SECRET_KEY` appear in a list below with your value

4. **Add ADMIN_USERNAME**:
   - Click the **"+ Add"** button again
   - Select **"New variable"** from the dropdown
   - **Left field** (Key): Type `ADMIN_USERNAME`
   - **Right field** (Value): Type `admin` (or any username you want)
   - Click **"Add"** button
   - ✅ You should now see 2 variables in the list

5. **Add ADMIN_PASSWORD**:
   - Click the **"+ Add"** button again
   - Select **"New variable"** from the dropdown
   - **Left field** (Key): Type `ADMIN_PASSWORD`
   - **Right field** (Value): Type a strong password (e.g., `MySecurePass123!`)
   - ⚠️ **Important**: Use a strong password - this protects your admin dashboard!
   - Click **"Add"** button
   - ✅ You should now see 3 variables

6. **Add ADMIN_TOKEN**:
   - Click the **"+ Add"** button again
   - Select **"New variable"** from the dropdown
   - **Left field** (Key): Type `ADMIN_TOKEN`
   - **Right field** (Value): Type `shape-admin-token-2024` (or any random string)
   - Click **"Add"** button
   - ✅ You should now see 4 variables

7. **Add FLASK_DEBUG**:
   - Click the **"+ Add"** button again
   - Select **"New variable"** from the dropdown
   - **Left field** (Key): Type `FLASK_DEBUG`
   - **Right field** (Value): Type `0` (zero - this means production mode)
   - Click **"Add"** button
   - ✅ You should now see 5 variables

8. **DO NOT add PORT**:
   - ⚠️ **Skip PORT** - Render sets this automatically
   - You don't need to add it manually

9. **Check Your Variables**:
   - You should see a list with these 5 variables:
     ```
     SECRET_KEY          [your-random-string]
     ADMIN_USERNAME      admin
     ADMIN_PASSWORD      [your-password]
     ADMIN_TOKEN         shape-admin-token-2024
     FLASK_DEBUG         0
     ```

10. **Optional: Add Email Variables** (skip if you don't need email):
    
    If you want the contact form to send emails:
    
    **Add GMAIL_USER**:
    - Click the **"+ Add"** button
    - Select **"New variable"** from the dropdown
    - **Left field** (Key): Type `GMAIL_USER`
    - **Right field** (Value): Type `your-email@gmail.com`
    - Click **"Add"** button
    
    **Add GMAIL_PASS**:
    - First, get your Gmail App Password:
      1. Go to: `https://myaccount.google.com/security`
      2. Enable "2-Step Verification" if not enabled
      3. Go to "App passwords" (search for it in the search bar)
      4. Click "Generate" → Select "Mail" → Select "Other" → Type "Render"
      5. Copy the 16-character password (looks like: `abcd efgh ijkl mnop`)
    - Click the **"+ Add"** button
    - Select **"New variable"** from the dropdown
    - **Left field** (Key): Type `GMAIL_PASS`
    - **Right field** (Value): Paste the 16-character password (remove spaces)
    - Click **"Add"** button

11. **Save Changes**:
    - ⚠️ **Important**: In Render's new interface, variables are saved automatically!
    - After clicking "Add" for each variable, it's immediately saved
    - You don't need to click a separate "Save Changes" button
    - Render will automatically redeploy when you add variables
    - Check the "Events" tab or "Logs" tab to see the redeploy progress
    - This takes 2-5 minutes

**Troubleshooting Environment Variables**:

- **Can't find the Environment tab?**
  - Make sure you're on your service page (not the dashboard)
  - Look in the left sidebar - it should be there
  - If still not visible, wait for the initial deployment to start

- **Variables not saving?**
  - Make sure you clicked "Save Changes" button
  - Check that variable names don't have spaces
  - Variable names should be UPPERCASE

- **Want to edit a variable?**
  - Click on the variable in the list
  - Edit the value
  - Click "Save Changes"

- **Want to delete a variable?**
  - Click the trash can icon (🗑️) next to the variable
  - Click "Save Changes"

**Quick Reference - All Variables You Need**:

Copy-paste this list and fill in your values:

```
SECRET_KEY          → [Generate with: python -c "import secrets; print(secrets.token_urlsafe(32))"]
ADMIN_USERNAME      → admin
ADMIN_PASSWORD      → [Your secure password]
ADMIN_TOKEN         → shape-admin-token-2024
FLASK_DEBUG         → 0
GMAIL_USER          → [Optional: your-email@gmail.com]
GMAIL_PASS          → [Optional: Gmail app password]
```

**Step-by-Step Summary**:
1. ✅ Click "Environment" tab (left sidebar)
2. ✅ Click "+ Add" button
3. ✅ Select "New variable" from dropdown
4. ✅ Type variable name in left field (Key)
5. ✅ Type variable value in right field (Value)
6. ✅ Click "Add" button
7. ✅ Repeat steps 2-6 for each variable
8. ✅ Variables save automatically - no "Save Changes" button needed!
9. ✅ Wait for auto-redeploy (2-5 minutes)

### 2.4 Verify Backend Deployment

1. **Wait for "Live" Status**:
   - In your Render service page, look at the top
   - Status should say **"Live"** (green)
   - If it says "Build failed" or "Deploy failed", check the logs:
     - Click "Logs" tab
     - Look for red error messages
     - Common issues:
       - Missing `requirements.txt`
       - Wrong "Root Directory" (should be `backend`)
       - Python syntax errors in `app.py`

2. **Get Your API URL**:
   - At the top of the service page, you'll see:
     ```
     https://shape-portfolio-api.onrender.com
     ```
   - Copy this URL (you'll need it in the next section)

3. **Test the API**:
   - Open a new browser tab
   - Go to: `https://your-api-url.onrender.com/api/health`
   - You should see:
     ```json
     {"status": "ok"}
     ```
   - If you see an error:
     - Check Render logs for errors
     - Verify environment variables are set correctly
     - Make sure the service status is "Live"

4. **Test Projects Endpoint**:
   - Go to: `https://your-api-url.onrender.com/api/projects`
   - You should see JSON with your projects (or an empty array if you haven't added any yet)

**Your backend is now live!** 🎉

---

## 3. Point the Frontend to the Deployed API

Your frontend JavaScript files currently point to `http://localhost:5000`. We need to update them to use your Render API URL.

### 3.1 Update `projects-script.js`

1. **Open the file**:
   - Navigate to `D:\porfolio\projects-script.js`
   - Open it in any text editor (Notepad, VS Code, etc.)

2. **Find the API_URL line**:
   - Look near the top of the file (around line 4-5)
   - You should see:
     ```javascript
     const API_URL = 'http://localhost:5000';
     ```

3. **Replace with your Render URL**:
   - Change it to:
     ```javascript
     const API_URL = 'https://shape-portfolio-api.onrender.com';
     ```
   - **Important**: 
     - Use `https://` (not `http://`)
     - No trailing slash at the end
     - Replace `shape-portfolio-api` with your actual Render service name

4. **Save the file**

### 3.2 Update `admin/admin-script.js`

1. **Open the file**:
   - Navigate to `D:\porfolio\admin\admin-script.js`
   - Open it in your text editor

2. **Find the API_URL line**:
   - Look near the top (around line 4-5)
   - You should see:
     ```javascript
     const API_URL = 'http://localhost:5000';
     ```

3. **Replace with the same Render URL**:
   ```javascript
   const API_URL = 'https://shape-portfolio-api.onrender.com';
   ```
   - Use the exact same URL as in `projects-script.js`

4. **Save the file**

### 3.3 Check for Other API URLs (Optional)

Search your codebase for any other references to `localhost:5000`:

1. **In PowerShell**:
   ```powershell
   cd D:\porfolio
   Select-String -Pattern "localhost:5000" -Recurse
   ```

2. **If you find any other files**, update them too

### 3.4 Commit and Push Changes

1. **In PowerShell** (from `D:\porfolio`):
   ```powershell
   git add projects-script.js admin/admin-script.js
   git commit -m "Update API URLs to point to Render service"
   git push
   ```

2. **Verify on GitHub**:
   - Go to your GitHub repository
   - Click on `projects-script.js`
   - Verify line 4-5 shows your Render URL (not localhost)
   - Do the same for `admin/admin-script.js`

**Your frontend is now configured to use the live API!**

---

## 4. Deploy the Static Frontend to Netlify

Netlify will serve your HTML, CSS, and JavaScript files to visitors.

### 4.1 Create New Site on Netlify

1. **Go to Netlify Dashboard**:
   - Open `https://netlify.com` in your browser
   - Make sure you're logged in
   - You should see your dashboard

2. **Add New Site**:
   - Click **"Add new site"** button (top right)
   - Select **"Import an existing project"**

3. **Connect to Git Provider**:
   - Click **"Deploy with GitHub"** (or the GitHub logo)
   - If prompted, authorize Netlify to access your GitHub account
   - Grant access to your repositories

4. **Select Your Repository**:
   - Netlify will show a list of your GitHub repositories
   - Find and click on `shape-portfolio` (or your repo name)
   - Click **"Connect"**

### 4.2 Configure Build Settings

**If you're setting up a NEW site**, Netlify will show "Configure build settings" screen:

1. **Branch to deploy**: 
   - Select `main` (should be selected by default)

2. **Build command**: 
   - **Leave this EMPTY** (your site is pure HTML/JS, no build step needed)
   - If there's any text, delete it

3. **Publish directory**: 
   - Enter: `.` (a single dot)
   - This tells Netlify to serve files from the project root
   - Netlify will automatically serve `index.html` as the homepage

4. **Advanced settings** (click "Show advanced" if needed):
   - Usually not needed, but if you have issues:
     - **Base directory**: Leave empty
     - **Package directory**: Leave empty

5. **Click "Deploy site"**:
   - Netlify will start deploying
   - You'll see build logs
   - **First deployment takes 2-5 minutes**

**If your site is ALREADY DEPLOYED** (like yours), check/update build settings:

1. **Access Deploy Settings**:
   - In your Netlify dashboard, you're currently on the **"Deploys"** page
   - Look at the top left card "Deploys for soft-malabi-921097"
   - Click the **"Deploy settings"** button (it has a gear icon ⚙️)
   - This will open the build settings page

2. **Alternative Method - Via Left Sidebar**:
   - In the **left sidebar**, click **"Project configuration"**
   - Scroll down to find **"Build settings"** section
   - Click **"Edit settings"** or **"Change settings"** button

3. **Check/Update Build Settings**:
   Once you're in the settings page, you'll see:
   
   - **Build command**: 
     - Should be **EMPTY** (completely blank)
     - If there's any text (like `npm run build`), **delete it**
     - Leave it empty
   
   - **Publish directory**: 
     - Should be **`.`** (a single dot, period)
     - This tells Netlify to serve files from the project root
     - If it's empty or says `dist` or `build`, change it to `.`
   
   - **Base directory**: 
     - Should be **empty** (leave blank)
     - Only fill this if your files are in a subfolder

4. **Save Changes**:
   - After updating, click **"Save"** button (usually at the bottom)
   - Netlify will automatically trigger a new deploy
   - Go back to **"Deploys"** tab to watch the deployment

5. **Verify Deployment**:
   - In the **"Deploys"** tab, you'll see a new deployment starting
   - Wait for it to complete (usually 1-2 minutes)
   - Status should show **"Published"** (green) when done

### 4.3 Wait for Deployment

1. **Watch the Build Logs**:
   - You'll see progress in real-time
   - Look for "Build successful" or "Deploy successful"
   - If you see errors:
     - Check that "Publish directory" is `.` (not empty, not `dist`, not `build`)
     - Check that "Build command" is empty
     - Check GitHub repository has all files

2. **Get Your Site URL**:
   - Once deployment completes, Netlify will show:
     ```
     https://random-name-12345.netlify.app
     ```
   - Or you can set a custom name (see next step)

### 4.4 Customize Site Name (Optional)

**Note**: Changing the site name is optional. Your site works fine with the auto-generated name like `soft-malabi-921097.netlify.app`. If you want a custom name, follow these steps:

**Method 1: Via Project Configuration** (Recommended):

1. **Go to Project Configuration**:
   - In the **left sidebar**, click **"Project configuration"**
   - Look for **"General"** or **"Site information"** section
   - Find **"Site name"** or **"Site slug"** field

2. **Change the Name**:
   - Click **"Edit"** or the name field itself
   - Enter a new name like: `shape-portfolio` or `yourname-portfolio`
   - Click **"Save"** or **"Update"**
   - Your new URL will be: `https://your-chosen-name.netlify.app`

**Method 2: Via Domain Management**:

1. **Go to Domain Management**:
   - In the **left sidebar**, click **"Domain management"**
   - Look for **"Site name"** or **"Custom domain"** section
   - Click **"Options"** or **"Edit"** next to your current domain

2. **Update Site Name**:
   - You'll see your current site name
   - Click to edit it
   - Enter your new name
   - Click **"Save"**

**Method 3: Click on the Site Name** (If available):

1. **Look at the top of your dashboard**:
   - You might see your site name/URL displayed
   - Click on it or look for an edit icon (pencil icon ✏️)
   - This might open the rename option

**If the name is already taken**:

- Netlify will show an error: "This name is already taken"
- Try variations like:
  - `shape-portfolio-2024`
  - `shape-portfolio-site`
  - `yourname-shape-portfolio`
  - `shape-portfolio-dev`
  - `shape-engineering-portfolio`
  - Or use your name: `sahil-shape-portfolio`

**If you can't find the option or name is taken**:

- **It's okay!** Your site works perfectly with the auto-generated name
- The current URL `soft-malabi-921097.netlify.app` is fine
- You can always add a custom domain later (see Section 7 in README)
- Focus on making sure your site works correctly first
- The site name doesn't affect functionality - it's just the URL

**Note the URL**:
   - Your current URL is: `https://soft-malabi-921097.netlify.app`
   - Copy this URL - you'll use it to access your live website
   - Test it in your browser to make sure everything works

### 4.5 Verify Frontend Deployment

1. **Open Your Site**:
   - Go to your Netlify URL in a browser
   - You should see your welcome page (`index.html`)

2. **Test Navigation**:
   - Click "Enter Portfolio" → should go to `portfolio.html`
   - Click "Projects" → should go to `projects.html`
   - Verify all pages load

3. **Check for Errors**:
   - Open browser Developer Tools (F12)
   - Go to "Console" tab
   - Look for red errors
   - Common issues:
     - CORS errors → Backend not configured correctly
     - 404 errors → Files not found (check file paths)
     - Network errors → API URL incorrect

**Your frontend is now live!** 🎉

---

## 5. Verify the Full System

Now test everything end-to-end to ensure it all works together.

### 5.1 Test Projects Page

1. **Navigate to Projects**:
   - Go to: `https://your-site.netlify.app/projects.html`
   - Or click "Projects" from your homepage

2. **Check Project Cards**:
   - You should see project cards displayed
   - Each card should show:
     - Project image (or placeholder)
     - Project name
     - Short mission description
     - Tech stack icons
     - "View Mission" button

3. **If you see "No projects available"**:
   - This is normal if you haven't added projects yet
   - Continue to section 5.4 to add projects via admin dashboard

4. **If you see errors in console**:
   - Open Developer Tools (F12) → Console tab
   - Look for red errors mentioning:
     - `fetch failed` → API URL incorrect or backend down
     - `CORS` → Backend CORS not configured (should be automatic)
     - `404` → API endpoint not found

### 5.2 Test Project Detail View

1. **Click a Project Card**:
   - Click "View Mission" or anywhere on a project card
   - A detailed overlay should appear

2. **Verify Detail Sections**:
   - **MISSION BRIEF**: Should show project description
   - **PROJECT GALLERY**: Should show images (if project has images)
     - Test left/right arrows
     - Test thumbnail clicks
   - **SYSTEM ARCHITECTURE**: Should show ASCII diagram
   - **ENGINEERING STACK**: Should show tech tags
   - **MISSION STATUS**: Should show progress bars (Stability, Range, Reliability)
   - **LINKEDIN POST**: Should show link if project has LinkedIn link
   - **PROJECT REPORT**: Should show PDF embed if project has report

3. **Test Close Button**:
   - Click the "×" button (top right)
   - Overlay should close
   - Or press `Escape` key

### 5.3 Test Project Report PDF

1. **For Projects WITH Reports**:
   - Open a project that has a PDF report
   - Scroll to "PROJECT REPORT" section
   - PDF should be embedded and viewable
   - Click "Open in New Tab" link to test fallback

2. **For Projects WITHOUT Reports**:
   - Open a project without a report
   - "PROJECT REPORT" section should **NOT** appear at all
   - If you see a broken PDF icon, the checkbox in admin wasn't unchecked

### 5.4 Test Admin Dashboard

1. **Navigate to Admin Login**:
   - Go to: `https://your-site.netlify.app/admin/admin-login.html`

2. **Login**:
   - **Username**: The value you set for `ADMIN_USERNAME` in Render (e.g., `admin`)
   - **Password**: The value you set for `ADMIN_PASSWORD` in Render
   - Click "Login"

3. **Verify Dashboard Loads**:
   - You should see three sections:
     - **Messages**: Contact form submissions
     - **Projects**: List of all projects
     - **Skills**: List of all skills

4. **Test Adding a Project**:
   - Click "Add New Project" button
   - Fill in:
     - Project Name: "Test Project"
     - Mission: "This is a test project"
     - Mission Brief: "Detailed description here"
     - Status: Select "Live"
     - Add at least one image path: `image/project/pro1/test.jpg`
     - Add tech stack tags: "Arduino, ESP32"
   - Click "Save Project"
   - You should see a success message
   - Project should appear in the projects list

5. **Test Editing a Project**:
   - Click "Edit" on any project card
   - Make a small change (e.g., change the name)
   - Click "Save Project"
   - Verify the change appears

6. **Test Viewing on Public Site**:
   - Go back to: `https://your-site.netlify.app/projects.html`
   - Refresh the page
   - Your new/edited project should appear

### 5.5 Test Contact Form (if applicable)

1. **Navigate to Contact Section**:
   - Go to: `https://your-site.netlify.app/portfolio.html#contact`
   - Or scroll to contact section

2. **Submit a Test Message**:
   - Fill in name, email, subject, message
   - Click "Send Message"
   - You should see a success message

3. **Verify in Admin**:
   - Go to admin dashboard
   - Check "Messages" section
   - Your test message should appear

### 5.6 Test Skills Section (if applicable)

1. **View Skills**:
   - Skills should appear on your portfolio page
   - Or check admin dashboard → Skills section

2. **Add/Edit Skills via Admin**:
   - In admin dashboard, go to Skills section
   - Add or edit skills
   - Verify they appear on the public site

---

## 6. Troubleshooting

Common issues and how to fix them.

### 6.1 Projects Not Loading

**Symptoms**: Projects page shows "No projects available" or blank cards

**Solutions**:

1. **Check Browser Console**:
   - Press F12 → Console tab
   - Look for red errors
   - Common errors:
     ```
     Failed to fetch
     CORS policy blocked
     404 Not Found
     ```

2. **Verify API URL**:
   - Open `projects-script.js`
   - Check `API_URL` is your Render URL (not localhost)
   - Should be: `https://your-api.onrender.com` (no trailing slash)

3. **Verify Backend is Live**:
   - Go to Render dashboard
   - Check service status is "Live" (green)
   - If it says "Stopped", click "Manual Deploy" → "Deploy latest commit"

4. **Test API Directly**:
   - Open: `https://your-api.onrender.com/api/projects`
   - Should return JSON (even if empty array `[]`)
   - If you see error, backend has issues

5. **Check CORS Configuration**:
   - Your `backend/app.py` should have CORS configured
   - If not, Render might be blocking requests
   - Check Render logs for CORS errors

### 6.2 Images Not Displaying

**Symptoms**: Project cards show "IMAGE NOT FOUND" or broken image icons

**Solutions**:

1. **Check Image Paths in Admin**:
   - Go to admin dashboard
   - Edit the project
   - Check image paths are correct
   - Should be relative: `image/project/pro1/image.jpg`
   - Not absolute: `D:\porfolio\image\...`

2. **Verify Files Exist in Repository**:
   - Go to GitHub repository
   - Navigate to `image/project/pro1/` folder
   - Verify image files are there
   - If missing, add them and push to GitHub

3. **Check File Names**:
   - Image paths are case-sensitive
   - `image.jpg` ≠ `Image.jpg`
   - Ensure exact match

4. **Verify Files Are on GitHub**:
   - Go to your GitHub repository: `https://github.com/RoSahilTech/shape-portfolio`
   - Navigate to `image/project/pro5/` folder
   - Verify all 5 image files are there (ima1.jpg, ima2.jpg, ima3.jpg, ima4.jpg, ima5.jpg)
   - If files are missing on GitHub:
     ```powershell
     git add image/project/pro5/*.jpg
     git commit -m "Add missing project images"
     git push
     ```

5. **Verify Netlify Deployment**:
   - In Netlify, go to "Deploys" tab
   - Check latest deploy includes image files
   - If images are missing, trigger a new deploy:
     - Click "Trigger deploy" → "Deploy site"
     - Wait for deployment to complete

6. **Test Image URLs Directly**:
   - Try accessing images directly:
     - `https://soft-malabi-921097.netlify.app/image/project/pro5/ima1.jpg`
     - `https://soft-malabi-921097.netlify.app/image/project/pro5/ima2.jpg`
     - If you get 404, images aren't on Netlify
     - If images load, the issue is in the JavaScript code

7. **Check File Sizes**:
   - Large images (>5MB) might not deploy properly
   - Compress images if they're too large
   - Use tools like TinyPNG or Squoosh to optimize

### 6.3 PDF Reports Not Showing

**Symptoms**: Project report section shows broken icon or blank frame

**Solutions**:

1. **Check PDF Path**:
   - In admin dashboard, edit project
   - Check "Project Report (PDF)" field
   - Should be: `docs/report.pdf` (or similar relative path)

2. **Verify PDF File Exists**:
   - Go to GitHub repository
   - Check `docs/` folder exists
   - Verify PDF file is there
   - If missing, add it and push to GitHub

3. **Check Checkbox**:
   - In admin, make sure "This project has a report PDF" is checked
   - If unchecked, the section won't appear (which is correct)

4. **Test PDF Directly**:
   - Go to: `https://your-site.netlify.app/docs/report.pdf`
   - Should download or display PDF
   - If 404, file doesn't exist on Netlify

### 6.4 Admin Login Not Working

**Symptoms**: Can't log in to admin dashboard, "Invalid credentials" error

**Solutions**:

1. **Verify Environment Variables**:
   - Go to Render dashboard
   - Open your service → Environment tab
   - Check `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set
   - Values are case-sensitive

2. **Check Username/Password**:
   - Use exact values from Render (no extra spaces)
   - Copy-paste to avoid typos

3. **Redeploy Backend**:
   - If you changed env vars, backend needs redeploy
   - In Render, click "Manual Deploy" → "Deploy latest commit"
   - Wait for deployment to complete

4. **Check Backend Logs**:
   - In Render, go to "Logs" tab
   - Try logging in
   - Look for error messages
   - Common: "ADMIN_USERNAME not set" → env var missing

### 6.5 CORS Errors

**Symptoms**: Browser console shows "CORS policy blocked" errors

**Solutions**:

1. **Verify Backend CORS Configuration**:
   - Check `backend/app.py` has CORS setup
   - Should include:
     ```python
     from flask_cors import CORS
     CORS(app, supports_credentials=True)
     ```

2. **Check Render Service**:
   - Make sure backend is "Live"
   - Check logs for CORS-related errors

3. **Verify API URL**:
   - Use `https://` (not `http://`)
   - No trailing slash
   - Correct domain

### 6.6 Site Loading Very Slowly

**Symptoms**: Site takes 30+ seconds to load, especially on first visit

**Common Causes & Solutions**:

1. **Render Free Plan Spin-Down** (Most Common):
   - **Problem**: Render free plan spins down after 15 minutes of inactivity
   - **First request after spin-down takes ~30 seconds** to wake up
   - **Solution Options**:
     - **Option A**: Wait 30 seconds on first load (it's normal for free plan)
     - **Option B**: Upgrade to Render "Starter" plan ($7/month) - stays awake 24/7
     - **Option C**: Use a free service like UptimeRobot to ping your API every 10 minutes (keeps it awake)
     - **Option D**: Accept the delay - it's only on the first request after inactivity

2. **Large Image Files**:
   - **Problem**: Unoptimized images slow down page load
   - **Solution**:
     - Compress images before uploading (use tools like TinyPNG, Squoosh)
     - Use WebP format instead of JPG/PNG when possible
     - Resize images to appropriate dimensions (don't use 4000px images for 400px display)
     - Check image sizes in your `image/` folder

3. **API Calls Taking Too Long**:
   - **Problem**: Frontend waiting for API responses
   - **Solution**:
     - Check if API URL is correct in `projects-script.js` and `admin/admin-script.js`
     - Test API directly: `https://shape-portfolio-api.onrender.com/api/health`
     - If API is slow, it's likely the Render spin-down issue (see #1)

4. **Too Many Resources Loading**:
   - **Problem**: Loading too many files at once
   - **Solution**:
     - Check browser Network tab (F12 → Network)
     - Look for files taking long to load
     - Consider lazy-loading images
     - Minimize JavaScript and CSS files

5. **Network Issues**:
   - **Problem**: Slow internet connection or geographic distance
   - **Solution**:
     - Test from different network/location
     - Check Netlify CDN is working (should be fast globally)
     - Render servers might be far from your location

**Quick Diagnosis Steps**:

1. **Open Browser Developer Tools** (F12):
   - Go to **"Network"** tab
   - Reload the page
   - Look for requests taking long (red or yellow bars)
   - Check which file/API call is slow

2. **Check Render Logs**:
   - Go to Render dashboard → Your service → "Logs" tab
   - Look for slow requests or errors
   - Check if service is "Live" or "Stopped"

3. **Test API Directly**:
   - Open: `https://shape-portfolio-api.onrender.com/api/health`
   - Time how long it takes
   - If it takes 30+ seconds, it's the Render spin-down (normal for free plan)

**Expected Behavior**:
- **First visit after 15+ minutes of inactivity**: 30-40 seconds (Render waking up)
- **Subsequent visits within 15 minutes**: 1-3 seconds (normal)
- **Page load (after API responds)**: 1-2 seconds

**If it's always slow** (even after first load):
- Check image file sizes
- Check browser console for errors
- Check Network tab for slow resources
- Consider optimizing images

### 6.7 Render Service Keeps Stopping

**Symptoms**: Backend works sometimes, then stops responding

**Solutions**:

1. **Free Plan Limitation**:
   - Render free plan spins down after 15 minutes of inactivity
   - First request after spin-down takes ~30 seconds
   - This is normal behavior

2. **Upgrade to Paid Plan** (optional):
   - In Render, upgrade to "Starter" plan ($7/month)
   - Service stays awake 24/7
   - Faster response times

3. **Use Render Cron Job** (free workaround):
   - Create a cron job that pings your API every 10 minutes
   - Keeps service awake
   - See Render documentation for cron jobs

### 6.7 Netlify Build Fails

**Symptoms**: Netlify shows "Build failed" error

**Solutions**:

1. **Check Build Logs**:
   - In Netlify, click "Deploys" tab
   - Click failed deploy → "View build log"
   - Look for error messages

2. **Common Issues**:
   - **Build command not empty**: Should be empty for static sites
   - **Publish directory wrong**: Should be `.` (dot)
   - **Missing files**: Check GitHub has all files

3. **Redeploy**:
   - Fix the issue
   - Push to GitHub
   - Netlify will auto-redeploy
   - Or click "Trigger deploy" → "Deploy site"

### 6.8 Changes Not Appearing

**Symptoms**: Made changes, pushed to GitHub, but site still shows old content

**Solutions**:

1. **Check GitHub**:
   - Verify changes are on GitHub
   - Go to repository → check file → verify changes are there

2. **Check Netlify Deploy**:
   - Go to Netlify → "Deploys" tab
   - Latest deploy should show your commit message
   - If not, click "Trigger deploy" → "Deploy site"

3. **Clear Browser Cache**:
   - Press `Ctrl + Shift + R` (hard refresh)
   - Or open in incognito/private window

4. **Check Render** (for backend changes):
   - Backend changes need Render redeploy
   - Go to Render → "Manual Deploy" → "Deploy latest commit"

---

## 7. Optional – Custom Domain

Add your own domain name (e.g., `yourname.com`) instead of `netlify.app`.

### 7.1 Buy a Domain

1. **Choose a Registrar**:
   - Namecheap: `https://www.namecheap.com`
   - GoDaddy: `https://www.godaddy.com`
   - Google Domains: `https://domains.google`
   - Cloudflare: `https://www.cloudflare.com/products/registrar`

2. **Search for Domain**:
   - Enter your desired name (e.g., `yourname`)
   - Choose extension (`.com`, `.dev`, `.io`, etc.)
   - Add to cart and checkout

3. **Complete Purchase**:
   - Follow registrar's instructions
   - Domain usually activates within minutes to hours

### 7.2 Configure Domain in Netlify

1. **Add Domain to Netlify**:
   - Go to Netlify dashboard
   - Open your site
   - Click **"Site settings"**
   - Click **"Domain management"** (left sidebar)
   - Click **"Add custom domain"**

2. **Enter Your Domain**:
   - Type your domain: `yourname.com`
   - Click **"Verify"**
   - Netlify will check if domain is available

3. **Get DNS Records**:
   - Netlify will show DNS configuration
   - Usually one of:
     - **CNAME**: `www` → `your-site.netlify.app`
     - **A Record**: `@` → IP address (shown by Netlify)
   - Copy these values

### 7.3 Configure DNS at Registrar

1. **Go to Your Registrar**:
   - Log in to your domain registrar account
   - Find "DNS Settings" or "Manage DNS"

2. **Add DNS Records**:
   - Add the records Netlify provided:
     - **Type**: CNAME or A (as shown by Netlify)
     - **Name**: `www` or `@` (as shown)
     - **Value**: The value Netlify provided
     - **TTL**: 3600 (or default)

3. **Save Changes**:
   - Click "Save" or "Update DNS"
   - DNS propagation takes 1-24 hours (usually 1-2 hours)

### 7.4 Verify Domain

1. **Wait for DNS Propagation**:
   - Use a DNS checker: `https://www.whatsmydns.net`
   - Enter your domain
   - Check if DNS records are updated globally

2. **Check Netlify**:
   - Netlify will automatically detect when DNS is configured
   - Domain status will change to "Active"
   - HTTPS certificate will be issued automatically

3. **Test Your Domain**:
   - Go to: `https://yourname.com`
   - Should show your portfolio site
   - Should have HTTPS (green lock icon)

### 7.5 Set Primary Domain

1. **In Netlify**:
   - Go to "Domain management"
   - Click "Options" next to your domain
   - Select "Set as primary domain"
   - This makes `yourname.com` the main URL

2. **Configure Redirects** (optional):
   - Set up redirects:
     - `www.yourname.com` → `yourname.com` (or vice versa)
     - In Netlify, go to "Domain management" → "HTTPS" → configure redirects

---

## 8. Maintenance & Updates

### 8.1 Making Updates

Whenever you want to update your site:

1. **Make Changes Locally**:
   - Edit files in `D:\porfolio`
   - Test locally if possible

2. **Commit and Push**:
   ```powershell
   cd D:\porfolio
   git add .
   git commit -m "Description of changes"
   git push
   ```

3. **Wait for Auto-Deploy**:
   - Netlify will automatically detect the push
   - Will redeploy in 1-2 minutes
   - Render will also redeploy if backend files changed

4. **Verify Changes**:
   - Check your live site
   - Verify changes appear correctly

### 8.2 Backing Up

1. **GitHub is Your Backup**:
   - All code is stored on GitHub
   - If you lose local files, clone from GitHub:
     ```powershell
     git clone https://github.com/your-username/shape-portfolio.git
     ```

2. **Backup Data Files**:
   - `backend/projects.json`
   - `backend/messages.json`
   - `backend/skills.json`
   - Download these periodically from GitHub or Render

### 8.3 Monitoring

1. **Netlify Analytics** (optional):
   - Upgrade to paid plan for analytics
   - Or use Google Analytics (free)

2. **Render Logs**:
   - Check Render logs periodically
   - Look for errors or warnings

3. **Uptime Monitoring** (optional):
   - Use services like UptimeRobot (free)
   - Monitors your site and alerts if down

---

## 🎉 Congratulations!

Your SHAPE portfolio is now live on the internet! 

**Your URLs**:
- **Frontend**: `https://your-site.netlify.app`
- **Backend API**: `https://your-api.onrender.com`
- **Admin Dashboard**: `https://your-site.netlify.app/admin/admin-login.html`

**Next Steps**:
- Add more projects via admin dashboard
- Customize styling to match your brand
- Add your resume PDF
- Share your portfolio URL with potential employers/clients

**Need Help?**
- Check the Troubleshooting section above
- Review Render/Netlify documentation
- Check browser console for errors (F12)

Good luck with your portfolio! 🚀
