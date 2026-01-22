# Lab Pulse - Deployment Guide

## 🚀 Quick Deployment

### Prerequisites
- Node.js 18+ 
- Firebase project with Realtime Database
- GitHub account (for Vercel deployment)

### 1. Firebase Setup
1. Create a new Firebase project at https://console.firebase.google.com
2. Enable Realtime Database
3. Get your Firebase credentials from Project Settings > General > Your apps
4. Add environment variables:
   ```
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

### 2. Local Development
```bash
# Install dependencies
npm install

# Seed sample users (optional)
node seed.js

# Start development server
npm run dev
```

### 3. Vercel Deployment (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### 4. Manual Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🎯 Features Included

### Core System
- ✅ Authentication (Faculty/Student roles)
- ✅ Session management with capacity limits
- ✅ Real-time progress tracking
- ✅ File upload system

### Coding Environment
- ✅ Multi-language support (JavaScript, Python, Java, C++)
- ✅ In-browser code editor
- ✅ Automatic test execution
- ✅ Real-time scoring system
- ✅ Faculty code review tools

### Enhanced Features
- ✅ School selection (SOL, STME, SPTM, SOC, SBM)
- ✅ Batch year selection (1st-4th year)
- ✅ Timer functionality
- ✅ Document/PDF uploads
- ✅ Session capacity management

## 📱 Access URLs
- **Application:** https://your-app.vercel.app
- **Login Page:** https://your-app.vercel.app/login
- **Faculty Dashboard:** https://your-app.vercel.app/faculty
- **Student Dashboard:** https://your-app.vercel.app/student

## 🔑 Default Credentials
- **Faculty:** username: `faculty`, password: `faculty`
- **Student:** username: `student`, password: `student`

## 🛠️ Technical Stack
- **Frontend:** Next.js 16, React 19, Tailwind CSS
- **Backend:** Firebase Realtime Database
- **Authentication:** Custom auth system
- **Code Execution:** Mock implementation (replace with real service in production)

## 📝 Notes
- The code execution service is a mock implementation for demo purposes
- In production, replace `src/lib/codeExecutor.ts` with a real code execution service
- File uploads are stored as base64 (use Firebase Storage in production)
- The application is fully responsive and works on mobile devices
