# HeartSync Deployment Guide

## 🚀 Deploy Your Application

### Prerequisites
- [GitHub Account](https://github.com)
- [Vercel Account](https://vercel.com) (for Frontend)
- [Render Account](https://render.com) (for Backend)

---

## 📦 Backend Deployment (Render)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy on Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `heartsync-backend` (or your choice)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: 
     - `MONGODB_URI` (if using MongoDB)
     - `PORT` = `5000`
5. Click **"Create Web Service"**
6. **Copy your backend URL** (e.g., `https://heartsync-backend.onrender.com`)

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Update Backend URL
1. Open `Frontend/config.js`
2. Replace `your-backend-name.onrender.com` with your actual Render URL
3. Commit changes:
```bash
git add Frontend/config.js
git commit -m "Update backend URL"
git push origin main
```

### Step 2: Deploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Root Directory**: `Frontend`
   - **Framework Preset**: Other
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
5. Click **"Deploy"**
6. Once deployed, copy your Vercel URL (e.g., `https://heartsync.vercel.app`)

---

## 🔐 User Instructions

When users visit your application:
1. They will see an API key input field on the login page
2. They need to get their FREE Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Enter the API key (stored securely in their browser only)
4. Complete the login form and start chatting

### Security Benefits
✅ Your API key is never exposed  
✅ Each user uses their own quota  
✅ API keys are stored in browser sessionStorage (cleared on browser close)  
✅ No API keys stored on your servers

---

## 🧪 Testing Locally

### Backend
```bash
cd Backend
npm install
npm start
```

### Frontend
Open `Frontend/login.html` in your browser or use a local server:
```bash
cd Frontend
npx serve
```

---

## 📝 Environment Variables

### Backend (.env) - For Local Testing Only
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/heartsync
GEMINI_API_KEY=your_key_for_testing_only
```

**Note**: The GEMINI_API_KEY in .env is only used as a fallback for local testing. In production, users provide their own keys.

---

## 🛠️ Troubleshooting

### CORS Issues
If you encounter CORS errors, update the CORS configuration in `Backend/index.js`:
```javascript
app.use(cors({
  origin: ['https://your-vercel-app.vercel.app'],
  credentials: true
}));
```

### API Key Not Working
- Ensure users get their key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Check browser console for error messages
- Verify the API key is valid and has proper permissions

### Render Free Tier Spins Down
Render's free tier spins down after 15 minutes of inactivity. First request may be slow.

---

## 📊 Monitoring

### Render
- View logs in Render Dashboard → Your Service → Logs
- Monitor performance and errors

### Vercel
- View analytics in Vercel Dashboard → Your Project → Analytics
- Check deployment logs

---

## 🎉 You're All Set!

Share your application URL with users and let them enjoy chatting with their loved ones using their own Gemini API keys!
