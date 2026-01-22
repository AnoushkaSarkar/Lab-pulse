# Lab Pulse - Real-time Lab Monitoring System

A web-based real-time monitoring system that helps faculty track student progress during lab sessions without physically walking to every screen.

## Features

### Faculty Dashboard
- **Mission Control Matrix**: Real-time grid view showing student progress across all tasks
- **Color-coded Status**: 
  - 🔘 Grey: Not started
  - 🟡 Yellow: In progress  
  - 🟢 Green: Completed
- **Live Updates**: Instant updates when students submit work
- **Submission Details**: Click any cell to view student's code and output
- **Statistics**: Overview of total students, completed tasks, and in-progress work

### Student Interface
- **Task List**: Clear view of all lab tasks with difficulty levels
- **Code Editor**: Simple textarea for writing and submitting code
- **Output Section**: Space to share program output or results
- **Progress Tracking**: Visual indicators showing completed and current tasks

### Real-time Features
- **Firebase Integration**: Uses Firebase Realtime Database for instant updates
- **No Page Refresh**: Faculty dashboard updates automatically when students submit
- **Live Status**: Real-time status changes as students work through tasks

## Technology Stack

- **Frontend**: React 18 with React Router
- **Styling**: Tailwind CSS for modern, responsive design
- **Backend**: Firebase Realtime Database
- **Authentication**: Firebase Auth
- **Icons**: Lucide React

## Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Firebase Setup**:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Realtime Database
   - Enable Authentication (Email/Password)
   - Replace the Firebase config in `src/firebase.js` with your credentials

3. **Start Development Server**:
   ```bash
   npm start
   ```

4. **Open Browser**: Navigate to `http://localhost:3000`

## Demo Accounts

The system includes demo accounts for testing:

- **Faculty**: `faculty@university.edu` / `password`
- **Student**: `student@university.edu` / `password`

## Project Structure

```
src/
├── components/
│   ├── FacultyDashboard.js    # Main faculty interface with matrix view
│   ├── StudentInterface.js   # Student task and submission interface
│   └── Login.js              # Authentication component
├── services/
│   └── databaseService.js    # Firebase database operations
├── firebase.js               # Firebase configuration
├── App.js                    # Main app with routing
├── index.js                  # App entry point
└── index.css                 # Global styles with Tailwind
```

## How It Works

1. **Faculty Login**: Access the dashboard to see real-time student progress
2. **Student Login**: View tasks and submit code/output
3. **Real-time Updates**: When a student submits work, the faculty dashboard updates instantly
4. **Status Tracking**: Tasks automatically change from Grey → Yellow → Green based on activity

## Database Schema

```
labs/
├── {labId}/
│   ├── name/                 # Lab session name
│   ├── students/            # Student information
│   ├── tasks/               # Task definitions
│   ├── status/              # Real-time task status per student
│   └── submissions/         # Student code submissions
```

## Customization

- **Add Your Own Labs**: Modify `databaseService.initializeDemoData()` to create custom lab sessions
- **Custom Authentication**: Update the role detection logic in `App.js`
- **Styling**: Modify Tailwind classes in components for your preferred design
- **Additional Features**: Extend the database schema to support more features

## Production Deployment

1. Build the project: `npm run build`
2. Deploy to your preferred hosting service (Vercel, Netlify, etc.)
3. Ensure Firebase security rules are properly configured
4. Set up proper authentication methods

## Security Notes

- Replace demo Firebase credentials with your own
- Configure Firebase security rules for production
- Implement proper user authentication in production
- Consider adding role-based access control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
