# 🚀 Deploy to Render (Free Hosting)

## Step 1: Push to GitHub

1. **Create a new GitHub repository**
2. **Push your code**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/pepiniera-website.git
   git push -u origin main
   ```

## Step 2: Deploy Backend to Render

1. **Go to [render.com](https://render.com)** and sign up with GitHub
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the backend service**:
   - **Name**: `pepiniera-api`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Auto-Deploy**: `Yes`

5. **Add Environment Variables**:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render will set this automatically)

6. **Deploy** - Wait for the build to complete
7. **Copy the backend URL** (something like `https://pepiniera-api-xxx.onrender.com`)

## Step 3: Deploy Frontend to Render

1. **Click "New +" → "Static Site"**
2. **Connect your GitHub repository again**
3. **Configure the frontend**:
   - **Name**: `pepiniera-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Auto-Deploy**: `Yes`

4. **Add Environment Variable**:
   - `VITE_API_URL` = `YOUR_BACKEND_URL_FROM_STEP_2`

5. **Deploy** - Wait for the build to complete

## Step 4: Update Frontend API Calls

You'll need to update all API calls in the frontend to use the environment variable.

**Example update needed in each frontend file:**

```javascript
// OLD:
fetch('http://localhost:5000/api/products')

// NEW:
import { API_URL } from '../config/api.js';
fetch(`${API_URL}/api/products`)
```

**Files to update:**
- `src/pages/Home.jsx`
- `src/pages/Products.jsx` 
- `src/pages/ProductDetail.jsx`
- `src/pages/Admin.jsx`
- `src/pages/Contact.jsx`

## Step 5: Test Everything

1. **Visit your frontend URL**
2. **Test all functionality**:
   - View products
   - Product detail pages
   - Admin login
   - Add/edit products
   - Image uploads
   - Contact page

## 🎉 Your site is now live!

**Frontend URL**: `https://pepiniera-frontend-xxx.onrender.com`
**Backend API**: `https://pepiniera-api-xxx.onrender.com`

## 📝 Important Notes:

- **Free tier limitations**: Services may sleep after inactivity
- **First load might be slow** (15-30 seconds) as services wake up
- **Persistent storage**: Your images and data are safely stored
- **Auto-deploy**: Updates automatically when you push to GitHub
- **Custom domain**: Can be added later if needed

## 🔧 If you need help updating the API calls:

Just let me know and I can help you update all the frontend files to use the environment variables!
