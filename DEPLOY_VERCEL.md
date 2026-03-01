# Deploy Portfolio to Vercel - Complete Step-by-Step Guide

This guide will help you deploy your SHAPE portfolio website to Vercel instead of Netlify.

---

## Prerequisites

Before starting, make sure you have:
- ✅ Your code pushed to GitHub
- ✅ A Vercel account (we'll create one if needed)
- ✅ Your backend API already deployed on Render (or ready to deploy)

---

## Step 1: Create Vercel Account

1. **Go to Vercel**: https://vercel.com
2. **Click "Sign Up"** (top right)
3. **Choose "Continue with GitHub"** (recommended)
   - This connects your GitHub account to Vercel
   - Authorize Vercel to access your GitHub repositories
4. **Complete the signup process**

---

## Step 2: Prepare Your Project for Vercel

### Option A: Create `vercel.json` (Recommended)

Create a file named `vercel.json` in your project root (`D:\porfolio\`):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "*.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/",
      "dest": "/index.html"
    },
    {
      "src": "/portfolio",
      "dest": "/portfolio.html"
    },
    {
      "src": "/projects",
      "dest": "/projects.html"
    },
    {
      "src": "/resume",
      "dest": "/resume.html"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

This tells Vercel:
- Your site is a static site (HTML/CSS/JS)
- How to route different pages
- To serve all files from the root

### Option B: No Configuration (Simpler)

Vercel can auto-detect static sites, so you might not need `vercel.json` at all. Try deploying without it first!

---

## Step 3: Push Code to GitHub (If Not Already Done)

If your code isn't on GitHub yet:

1. **Open terminal/PowerShell** in `D:\porfolio`

2. **Initialize Git** (if not already done):
   ```bash
   git init
   ```

3. **Add all files**:
   ```bash
   git add .
   ```

4. **Create .gitignore** (if not exists) to exclude backend files:
   ```
   backend/
   .env
   *.pyc
   __pycache__/
   node_modules/
   ```

5. **Commit**:
   ```bash
   git commit -m "Initial commit - Portfolio website"
   ```

6. **Create GitHub repository**:
   - Go to: https://github.com/new
   - Name it: `portfolio` (or any name)
   - Don't initialize with README
   - Click "Create repository"

7. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
   git branch -M main
   git push -u origin main
   ```
   (Replace `YOUR_USERNAME` with your GitHub username)

---

## Step 4: Deploy to Vercel

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard

2. **Click "Add New..." → "Project"**

3. **Import your GitHub repository**:
   - You'll see a list of your GitHub repositories
   - Find your portfolio repository
   - Click "Import" next to it

4. **Configure Project**:
   - **Project Name**: `portfolio` (or any name you like)
   - **Framework Preset**: Select "Other" or leave as "Other"
   - **Root Directory**: Leave as `./` (root)
   - **Build Command**: Leave empty (static site, no build needed)
   - **Output Directory**: Leave empty (serves from root)
   - **Install Command**: Leave empty

5. **Environment Variables** (if needed):
   - You don't need to set any for the frontend
   - Your backend API URL is already hardcoded in your JS files

6. **Click "Deploy"**

7. **Wait for deployment** (usually 1-2 minutes)

8. **Success!** You'll get a URL like: `https://portfolio-xyz123.vercel.app`

---

### Method 2: Deploy via Vercel CLI (Alternative)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```
   (You need Node.js installed: https://nodejs.org/)

2. **Login to Vercel**:
   ```bash
   vercel login
   ```
   - Follow the prompts to authenticate

3. **Deploy**:
   ```bash
   cd D:\porfolio
   vercel
   ```
   - Follow the prompts:
     - "Set up and deploy? Yes"
     - "Which scope? Your account"
     - "Link to existing project? No"
     - "Project name? portfolio"
     - "Directory? ./"
     - "Override settings? No"

4. **Your site will be deployed!**

---

## Step 5: Configure Custom Domain (Optional)

1. **Go to your project** in Vercel dashboard
2. **Click "Settings" → "Domains"**
3. **Add your domain** (e.g., `yourdomain.com`)
4. **Follow DNS configuration instructions**
5. **Wait for DNS propagation** (can take up to 24 hours)

---

## Step 6: Update API URLs (If Needed)

Make sure your frontend files point to your Render backend:

**Check these files:**
- `admin/admin-login.html` - Should have: `https://shape-portfolio-api.onrender.com`
- `admin/admin-script.js` - Should have: `https://shape-portfolio-api.onrender.com`
- `script.js` - Should have: `https://shape-portfolio-api.onrender.com`
- `projects-script.js` - Should have: `https://shape-portfolio-api.onrender.com`

If they're pointing to `localhost:5000`, update them to your Render URL.

---

## Step 7: Test Your Deployment

1. **Visit your Vercel URL**: `https://your-project.vercel.app`
2. **Test all pages**:
   - Home page (`/`)
   - Portfolio page (`/portfolio.html`)
   - Projects page (`/projects.html`)
   - Resume page (`/resume.html`)
   - Admin login (`/admin/admin-login.html`)

3. **Test functionality**:
   - Contact form submission
   - Admin login
   - Message viewing
   - Email sending

---

## Step 8: Automatic Deployments

Vercel automatically deploys when you push to GitHub:

1. **Make changes** to your code
2. **Commit and push**:
   ```bash
   git add .
   git commit -m "Update portfolio"
   git push
   ```
3. **Vercel will automatically deploy** the new version
4. **Check deployment status** in Vercel dashboard

---

## Troubleshooting

### Issue: 404 Errors on Pages

**Solution**: Create `vercel.json` (see Step 2) to configure routing

### Issue: Images Not Loading

**Solution**: 
- Make sure image paths are relative (e.g., `image/logo.png` not `D:\porfolio\image\logo.png`)
- Check that all image files are committed to GitHub

### Issue: API Calls Failing

**Solution**:
- Check browser console for CORS errors
- Verify API URLs point to Render, not localhost
- Check Render backend is running and accessible

### Issue: Admin Dashboard Not Working

**Solution**:
- Make sure `admin/` folder is in your repository
- Check API URLs in `admin/admin-script.js`
- Verify you're logged in with correct credentials

### Issue: Build Fails

**Solution**:
- Check Vercel build logs for errors
- Make sure all required files are in the repository
- Verify file paths are correct

---

## Vercel vs Netlify Comparison

| Feature | Vercel | Netlify |
|---------|--------|---------|
| **Free Tier** | ✅ Generous | ✅ Generous |
| **Auto Deploy** | ✅ Yes | ✅ Yes |
| **Custom Domain** | ✅ Free | ✅ Free |
| **SSL Certificate** | ✅ Automatic | ✅ Automatic |
| **Performance** | ⚡ Very Fast | ⚡ Fast |
| **CDN** | ✅ Global | ✅ Global |
| **Build Time** | ⚡ Fast | ⚡ Fast |
| **CLI Tool** | ✅ Yes | ✅ Yes |

Both are excellent choices! Vercel is known for excellent performance and developer experience.

---

## Quick Reference Commands

### Deploy via CLI:
```bash
vercel                    # Deploy to preview
vercel --prod            # Deploy to production
```

### View deployments:
```bash
vercel ls                # List all deployments
```

### Remove deployment:
```bash
vercel remove            # Remove project
```

---

## Next Steps

1. ✅ **Deploy to Vercel** (follow steps above)
2. ✅ **Test all functionality**
3. ✅ **Set up custom domain** (optional)
4. ✅ **Share your portfolio URL!**

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Vercel Discord**: https://vercel.com/discord

---

**Congratulations!** Your portfolio is now live on Vercel! 🎉
