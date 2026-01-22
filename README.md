# Lab Pulse - Comprehensive Task Management & Coding Assessment System

A powerful web-based platform for managing lab sessions, tracking student progress, and conducting automated coding assessments with real-time monitoring capabilities.

## 🚀 Key Features

### 🎓 Faculty Dashboard
- **Mission Control Matrix**: Real-time grid view showing student progress across all tasks
- **Session Management**: Create sessions with capacity limits, deadlines, school, and batch year selection
- **Task Creation**: Support for both text-based and coding assignments
- **Automated Grading**: Built-in test case execution and scoring system
- **Code Review**: Run and evaluate student submissions directly
- **File Upload Management**: Toggle document/PDF uploads per task
- **Real-time Updates**: Instant updates when students submit work

### 👨‍🎓 Student Interface
- **Session Joining**: Join sessions by name with capacity checking
- **In-browser Code Editor**: Write code in JavaScript, Python, Java, or C++
- **Test Execution**: Run tests instantly and see real-time results
- **File Uploads**: Submit documents when enabled by faculty
- **Timer Functionality**: Built-in countdown timer for assessments
- **Progress Tracking**: Visual indicators showing completed and current tasks

### 🔧 Advanced Features
- **Multi-language Support**: JavaScript, Python, Java, C++ code execution
- **Test Case Management**: Create custom test cases with input/output validation
- **Automatic Scoring**: Calculate scores based on test case performance
- **School Selection**: SOL, STME, SPTM, SOC, SBM
- **Batch Year Management**: 1st, 2nd, 3rd, 4th year selection
- **Session Capacity**: Limit student enrollment per session
- **Real-time Synchronization**: Firebase-powered live updates

## 🛠️ Technology Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Firebase Realtime Database
- **Authentication**: Custom role-based authentication
- **Code Execution**: Mock implementation (replaceable with real service)
- **File Storage**: Base64 encoding (upgrade to Firebase Storage in production)
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase project with Realtime Database
- GitHub account (for Vercel deployment)

### 1. Clone & Install
```bash
git clone https://github.com/vedanth-raj/Lab-pulse.git
cd Lab-pulse
npm install
```

### 2. Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Realtime Database
3. Get your Firebase credentials from Project Settings
4. Add environment variables (see `.env.local` example)

### 3. Environment Variables
Create `.env.local`:
```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Seed Sample Data (Optional)
```bash
node seed.js
```

### 5. Start Development
```bash
npm run dev
```

### 6. Open Browser
Navigate to `http://localhost:3000`

## 🔑 Default Credentials

- **Faculty**: username: `faculty`, password: `faculty`
- **Student**: username: `student`, password: `student`

## 📱 Access URLs

- **Home**: `http://localhost:3000`
- **Login**: `http://localhost:3000/login`
- **Faculty Dashboard**: `http://localhost:3000/faculty`
- **Student Dashboard**: `http://localhost:3000/student`

## 🏗️ Project Structure

```
src/
├── app/
│   ├── faculty/page.tsx        # Faculty dashboard with session/task management
│   ├── student/page.tsx         # Student interface with code editor
│   ├── login/page.tsx           # Authentication system
│   └── page.tsx                 # Landing page with auth redirect
├── components/
│   └── AuthGuard.tsx            # Route protection component
├── lib/
│   ├── types.ts                 # TypeScript type definitions
│   ├── auth.ts                  # Authentication utilities
│   ├── firebaseClient.ts        # Firebase operations
│   └── codeExecutor.ts          # Code execution service
├── firebase.js                  # Firebase configuration
└── seed.js                      # Database seeding script
```

## 🎯 How It Works

### For Faculty:
1. **Create Sessions**: Set up lab sessions with capacity limits and deadlines
2. **Add Tasks**: Create text-based or coding assignments with test cases
3. **Monitor Progress**: View real-time student progress in the matrix
4. **Review Submissions**: Run student code and view detailed results
5. **Manage Grades**: Automatic scoring based on test case performance

### For Students:
1. **Join Sessions**: Enter session name to join (if capacity allows)
2. **Complete Tasks**: Write code or submit text responses
3. **Run Tests**: Execute code against test cases for instant feedback
4. **Upload Files**: Submit documents when required
5. **Track Progress**: See real-time scores and completion status

## 📊 Database Schema

```typescript
// Users
users: {
  [userId]: {
    id: string,
    username: string,
    password: string,
    role: "faculty" | "student",
    school?: School,
    batchYear?: BatchYear
  }
}

// Sessions
sessions: {
  [sessionId]: {
    id: string,
    name: string,
    facultyId: string,
    school: School,
    batchYear: BatchYear,
    deadline: string,
    maxStudents: number,
    currentStudents: number,
    isActive: boolean
  }
}

// Tasks
tasks: {
  [taskId]: {
    id: string,
    sessionId: string,
    title: string,
    description: string,
    allowFileUpload: boolean,
    language?: "javascript" | "python" | "java" | "cpp",
    testCases?: TestCase[],
    maxScore?: number
  }
}

// Progress
progress: {
  [progressId]: {
    student_id: string,
    task_id: string,
    status: TaskStatus,
    output?: string,
    code?: string,
    fileUrl?: string,
    fileName?: string,
    testResults?: TestResult[],
    score?: number
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables
4. Deploy automatically

### Manual Deployment
```bash
npm run build
npm start
```

## 🔧 Customization

### Replace Code Execution Service
The current implementation uses a mock code executor. To use a real service:

1. Update `src/lib/codeExecutor.ts`
2. Replace mock execution with real API calls
3. Configure proper sandboxing for security

### Firebase Storage Integration
Replace base64 file storage with Firebase Storage:

1. Set up Firebase Storage bucket
2. Update file upload functions
3. Configure security rules

### Add New Languages
1. Update `Language` type in `src/lib/types.ts`
2. Add execution logic in `src/lib/codeExecutor.ts`
3. Update language options in faculty task creation

## 🛡️ Security Notes

- Replace demo credentials with proper authentication
- Configure Firebase security rules for production
- Implement proper code execution sandboxing
- Set up role-based access control
- Validate all file uploads

## 📈 Production Considerations

- **Code Execution**: Use a proper sandboxed service (Docker, AWS Lambda, etc.)
- **File Storage**: Migrate to Firebase Storage or AWS S3
- **Authentication**: Implement OAuth or SSO integration
- **Monitoring**: Add error tracking and analytics
- **Scaling**: Consider CDN for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Live Demo

Check out the live application: [Lab Pulse Demo](https://lab-pulse-demo.vercel.app)

---

**Built with ❤️ for educators and students**
