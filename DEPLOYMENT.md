# Deployment to Railway

## Prerequisites

1. GitHub account
2. Railway account (sign up at https://railway.app)
3. MongoDB Atlas account (for database)
4. Code pushed to GitHub repository

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/taskpilot`)
5. Save this for later

## Step 2: Prepare Backend for Railway

### Update Backend Package.json

The backend `package.json` is already configured with:
- `"type": "module"` for ES Modules
- `"start": "node server.js"` for production
- `"dev": "nodemon server.js"` for development

### Verify Environment Variables

The backend uses:
- `PORT` - Set by Railway (default 5000)
- `MONGO_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Set to production on Railway

## Step 3: Deploy Backend to Railway

1. **Connect GitHub to Railway:**
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select your repository

2. **Configure Backend Service:**
   - Railway will detect your Node.js backend
   - Click on the backend service
   - Go to "Variables"
   - Add the following environment variables:
     ```
     MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskpilot
     JWT_SECRET=your-secret-key-min-32-characters-long
     NODE_ENV=production
     ```

3. **Deploy:**
   - Click "Deploy"
   - Railway will automatically build and deploy
   - You'll get a public URL for your backend (e.g., `https://taskpilot-backend.up.railway.app`)

## Step 4: Prepare Frontend for Railway

### Update Frontend .env File

Create `.env.local` in the frontend folder:
```
VITE_API_URL=https://your-railway-backend-url/api
```

Replace `your-railway-backend-url` with the actual Railway backend URL from Step 3.

### Build Frontend

```bash
cd frontend
npm run build
```

This creates a `dist` folder with production build.

## Step 5: Deploy Frontend to Railway

1. **Create Frontend Service:**
   - In Railway Dashboard, click "New Service"
   - Select "Empty Service"
   - Name it "taskpilot-frontend"

2. **Configure Settings:**
   - Go to "Settings"
   - Set "Build Command": `npm install && npm run build`
   - Set "Start Command": `npm run preview`

3. **Add Environment Variables:**
   - Go to "Variables"
   - Add: `VITE_API_URL=https://your-railway-backend-url/api`

4. **Deploy:**
   - Connect your GitHub repo
   - Railway will build and deploy
   - You'll get a frontend URL (e.g., `https://taskpilot-frontend.up.railway.app`)

## Step 6: Verify Deployment

1. Open your frontend URL in browser
2. Sign up with test account
3. Verify authentication works
4. Create a project and task
5. Check dashboard statistics

## Troubleshooting

### Backend Issues

**Error: Cannot find module**
- Make sure all dependencies are installed: `npm install`
- Check that `.env` variables are set in Railway

**Error: MongoDB connection failed**
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for development)

**Error: Port already in use**
- Railway manages ports automatically
- Check `process.env.PORT` is being used in `server.js`

### Frontend Issues

**CORS errors**
- Verify backend CORS is configured correctly
- Backend should have `cors()` middleware
- Make sure API URL in `.env.local` is correct

**Blank page or 404**
- Check build output for errors
- Verify `vite.config.js` is configured correctly
- Clear browser cache

**API calls not working**
- Check `VITE_API_URL` environment variable
- Verify backend is running and accessible
- Check Network tab in browser DevTools

## Useful Commands

### Backend
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Seed sample data
npm run seed

# Start production server
npm start
```

### Frontend
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Production Best Practices

1. **Security:**
   - Use strong JWT_SECRET (min 32 characters)
   - Enable HTTPS only
   - Set CORS properly for frontend URL

2. **Database:**
   - Use strong MongoDB credentials
   - Enable IP whitelist (add your Railway IP)
   - Regular backups enabled

3. **Monitoring:**
   - Check Railway logs regularly
   - Set up error tracking (optional)
   - Monitor database usage

4. **Updates:**
   - Keep dependencies updated
   - Test locally before pushing to production
   - Use semantic versioning for releases

## Maintenance

### Update Dependencies
```bash
npm update
```

### Restart Services
- Railway automatically restarts on deploy
- Manual restart available in Railway Dashboard

### View Logs
- Railway Dashboard shows real-time logs
- Check both backend and frontend logs for errors

## Custom Domain (Optional)

1. In Railway Dashboard, go to Deployment
2. Click "Add Domain"
3. Configure your domain in DNS settings
4. Railway handles SSL/TLS automatically

---

For more help, visit [Railway Documentation](https://docs.railway.app)
