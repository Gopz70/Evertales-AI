╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                   🚀 EVERTALES AI - PRODUCTION DEPLOYMENT GUIDE 🚀           ║
║                                                                              ║
║                      Complete Setup for Vercel + Railway + PlanetScale      ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝


📋 TABLE OF CONTENTS
════════════════════════════════════════════════════════════════════════════════

1. Local Development Setup
2. Frontend Deployment (Vercel)
3. Backend Deployment (Railway/Render)
4. Database Setup (PlanetScale)
5. Cloudinary Setup (File Storage)
6. Environment Variables Configuration
7. Testing Before Deployment
8. Deployment Checklist


═══════════════════════════════════════════════════════════════════════════════
1. LOCAL DEVELOPMENT SETUP
═══════════════════════════════════════════════════════════════════════════════

The project works LOCALLY with NO changes needed:
- Uses local file storage for audio files
- Uses local MySQL database
- Perfect for development

To run locally:

Backend:
```bash
cd backend
npm install
npm run dev
```
Runs on: http://localhost:5000

Frontend:
```bash
cd frontend
npm install
npm run dev
```
Runs on: http://localhost:5173


═══════════════════════════════════════════════════════════════════════════════
2. FRONTEND DEPLOYMENT (Vercel)
═══════════════════════════════════════════════════════════════════════════════

✅ EASIEST PART - Frontend is production-ready!

Step 1: Connect GitHub to Vercel
├─ Go to vercel.com
├─ Click "New Project"
├─ Import your GitHub repository
└─ Select evertales-ai folder

Step 2: Configure Environment Variables
├─ Add to Vercel project settings:
│
├─ Key: VITE_API_BASE_URL
└─ Value: https://your-backend-domain.com/api
   (You'll set this after deploying backend)

Step 3: Deploy
├─ Vercel auto-deploys on every push to main
├─ Builds with: npm run build
└─ Serves from Vercel CDN

✅ Frontend deployed in 2 minutes!


═══════════════════════════════════════════════════════════════════════════════
3. BACKEND DEPLOYMENT (Railway or Render)
═══════════════════════════════════════════════════════════════════════════════

Choose ONE:

Option A: RAILWAY (Recommended - Simpler)
────────────────────────────────────────
1. Go to railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub"
4. Choose your repository
5. Add environment variables (see section 6)
6. Deploy!

Option B: RENDER (Also Good)
────────────────────────────
1. Go to render.com
2. Click "New +" → "Web Service"
3. Connect GitHub
4. Add environment variables (see section 6)
5. Deploy!

Key Backend Settings:
├─ Build command: npm install
├─ Start command: npm run start
├─ Set NODE_ENV=production
└─ Add all environment variables


═══════════════════════════════════════════════════════════════════════════════
4. DATABASE SETUP (PlanetScale)
═══════════════════════════════════════════════════════════════════════════════

PlanetScale = MySQL hosting (free tier available!)

Step 1: Create PlanetScale Account
├─ Go to planetscale.com
├─ Sign up (free tier)
├─ Create new database "evertales_ai"
└─ Branch: main

Step 2: Get Connection String
├─ Click your database
├─ Connect → Passwords → Create password
├─ Copy connection string: mysql://user:password@host/evertales_ai
└─ Store this securely!

Step 3: Migrate Local Database
├─ Option A: Export from local MySQL
│  └─ Using MySQL Workbench or command line
│
└─ Option B: Run schema on PlanetScale
   └─ Execute these SQL commands:

```sql
CREATE TABLE Users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Categories (
  category_id INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Stories (
  story_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  story_date DATE NOT NULL,
  category_id INT,
  transcript TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

CREATE TABLE Tags (
  tag_id INT PRIMARY KEY AUTO_INCREMENT,
  story_id INT NOT NULL,
  tag_name VARCHAR(100) NOT NULL,
  FOREIGN KEY (story_id) REFERENCES Stories(story_id)
);

CREATE TABLE Media (
  media_id INT PRIMARY KEY AUTO_INCREMENT,
  story_id INT NOT NULL,
  media_type ENUM('image', 'audio') NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (story_id) REFERENCES Stories(story_id)
);

-- Insert default categories
INSERT INTO Categories (category_name) VALUES 
('Personal'),
('Career'),
('Family'),
('Travel'),
('Learning'),
('Moments & Milestones'),
('Reflections'),
('Other');
```

Step 4: Add to Backend Environment
├─ DB_HOST: from PlanetScale connection string
├─ DB_USER: from connection string
├─ DB_PASSWORD: from connection string
└─ DB_NAME: evertales_ai


═══════════════════════════════════════════════════════════════════════════════
5. CLOUDINARY SETUP (File Storage)
═══════════════════════════════════════════════════════════════════════════════

Cloudinary = Cloud storage for audio files (free tier: 25GB!)

Step 1: Create Cloudinary Account
├─ Go to cloudinary.com
├─ Sign up (free tier)
└─ Verify email

Step 2: Get API Credentials
├─ Dashboard → Settings → API
├─ Find:
│  ├─ Cloud Name
│  ├─ API Key
│  └─ API Secret
└─ Keep these PRIVATE!

Step 3: Add to Backend Environment
├─ CLOUDINARY_NAME: your_cloud_name
├─ CLOUDINARY_API_KEY: your_api_key
└─ CLOUDINARY_API_SECRET: your_api_secret

That's it! The code automatically:
├─ Uses local storage in development
└─ Uses Cloudinary in production


═══════════════════════════════════════════════════════════════════════════════
6. ENVIRONMENT VARIABLES CONFIGURATION
═══════════════════════════════════════════════════════════════════════════════

Backend Environment Variables
────────────────────────────

LOCAL DEVELOPMENT (.env):
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_local_password
DB_NAME=evertales_ai
DB_PORT=3306
JWT_SECRET=your_super_secret_key_12345
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

PRODUCTION (Railway/Render):
```
NODE_ENV=production
PORT=5000
DB_HOST=your_planetscale_host
DB_USER=your_planetscale_user
DB_PASSWORD=your_planetscale_password
DB_NAME=evertales_ai
DB_PORT=3306
JWT_SECRET=generate_a_random_long_string_here
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Frontend Environment Variables
──────────────────────────────

VERCEL:
```
VITE_API_BASE_URL=https://your-backend.railway.app/api
```

That's the ONLY frontend env var needed!


═══════════════════════════════════════════════════════════════════════════════
7. TESTING BEFORE DEPLOYMENT
═══════════════════════════════════════════════════════════════════════════════

Test Locally:

1. Backend Test:
   ```bash
   # Ensure NODE_ENV=development in .env
   npm run dev
   # Should show: "EverTales AI backend running on http://localhost:5000"
   ```

2. Frontend Test:
   ```bash
   npm run dev
   # Should show: "Local:   http://localhost:5173"
   ```

3. Feature Test:
   ├─ Register new account ✓
   ├─ Login ✓
   ├─ Change password ✓
   ├─ Create story ✓
   ├─ Record voice ✓
   ├─ Save story ✓
   ├─ View story → See audio player ✓
   ├─ Make public ✓
   ├─ View public story while logged out ✓
   └─ Playback works ✓

4. Build Test:
   ```bash
   # Frontend
   cd frontend
   npm run build
   # Should create dist/ folder
   
   # Backend (no build needed, runs as-is)
   ```


═══════════════════════════════════════════════════════════════════════════════
8. DEPLOYMENT CHECKLIST
═══════════════════════════════════════════════════════════════════════════════

Pre-Deployment:
□ All features tested locally ✓
□ .env.example updated with new variables ✓
□ No hardcoded localhost URLs in code ✓
□ Backend package.json has all dependencies ✓
□ Database schema ready ✓
□ Cloudinary account created ✓
□ PlanetScale database created ✓
□ Git repository up to date ✓

Frontend (Vercel):
□ GitHub repository connected
□ Environment variables added
□ VITE_API_BASE_URL points to correct backend
□ Auto-deploy configured
□ Domain configured (if custom domain)

Backend (Railway/Render):
□ GitHub connected
□ All environment variables added
□ NODE_ENV=production set
□ Database connection tested
□ Cloudinary credentials verified
□ Start command: npm start or node src/server.js

Database (PlanetScale):
□ Database created
□ Schema migrated
□ Connection string saved
□ User/password secure

Post-Deployment:
□ Frontend loads at https://your-domain.com
□ Can register new account
□ Can login
□ Can create story with audio
□ Audio uploads to Cloudinary
□ Audio plays back correctly
□ Public stories accessible without login
□ All features working


═══════════════════════════════════════════════════════════════════════════════
TROUBLESHOOTING
═══════════════════════════════════════════════════════════════════════════════

Audio Upload Fails:
├─ Check Cloudinary credentials in env vars
├─ Ensure NODE_ENV=production
└─ Check backend logs for errors

Database Connection Error:
├─ Verify PlanetScale connection string
├─ Check DB_HOST, DB_USER, DB_PASSWORD
├─ Ensure port is open (3306)
└─ Test connection manually

Frontend Can't Connect to Backend:
├─ Verify VITE_API_BASE_URL in Vercel env vars
├─ Check backend is running
├─ Look for CORS errors in browser console
└─ Verify backend URL is correct (https, not http)

Voice Recording Not Working:
├─ Check browser console for errors
├─ Ensure HTTPS (required for microphone access)
├─ Try different browser
└─ Check microphone permissions


═══════════════════════════════════════════════════════════════════════════════
NEXT STEPS
═══════════════════════════════════════════════════════════════════════════════

1. ✅ Install cloudinary package:
   cd backend && npm install cloudinary

2. ✅ Set up PlanetScale database

3. ✅ Create Cloudinary account

4. ✅ Add environment variables to Railway/Render

5. ✅ Deploy frontend to Vercel

6. ✅ Deploy backend to Railway/Render

7. ✅ Test everything

8. ✅ Share your live project! 🎉


═══════════════════════════════════════════════════════════════════════════════
SUPPORT
═══════════════════════════════════════════════════════════════════════════════

If you encounter issues:
├─ Check the troubleshooting section above
├─ Review environment variables configuration
├─ Check backend logs (Railway/Render dashboard)
├─ Check frontend errors (browser developer tools)
└─ Ensure all services are connected properly


═══════════════════════════════════════════════════════════════════════════════
🎉 CONGRATULATIONS! 🎉

Your EverTales AI project is now production-ready!

You have:
✅ Professional voice recording feature
✅ Strong password validation
✅ Cloud storage integration
✅ Production database
✅ Complete deployment infrastructure

Ready to go live! 🚀

═══════════════════════════════════════════════════════════════════════════════
