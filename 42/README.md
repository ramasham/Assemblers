# Technician Task Management System

## 🚀 Project Overview

A comprehensive digital solution for streamlining technician task management and job order tracking in production environments. This system replaces manual reporting processes with real-time tracking, automated calculations, and intuitive dashboards.

### Problem Statement

Production lines with manual tracking systems face:
- Delays in data reporting
- Data entry errors
- Limited visibility into technician performance
- Difficulty tracking job progress in real-time
- Missed deadlines and low accountability

### Solution

A full-stack web application that provides:
- ✅ Real-time task tracking for technicians
- 📊 Automated productivity and efficiency calculations
- 🎯 Job order progress monitoring with serial number tracking
- 🔔 Alert system for delays and performance issues
- 📈 Interactive dashboards for supervisors and planners
- 🔐 Secure role-based access control

---

## 🏗️ Architecture

### Technology Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Frontend** | React 18 | Interactive user interface |
| **Build Tool** | Vite | Fast development and optimized builds |
| **Styling** | Tailwind CSS | Modern, responsive design |
| **UI Components** | Shadcn/UI + Radix UI | Professional, accessible components |
| **Icons** | Lucide React | Clean, consistent icons |
| **Animations** | Framer Motion | Smooth transitions |
| **Charts** | Recharts | Data visualization |
| **Backend** | Node.js + Express | RESTful API server |
| **Database** | MongoDB + Mongoose | Flexible data storage |
| **Authentication** | Firebase Auth | Secure user management |
| **Hosting** | Vercel (frontend) + Render (backend) | Cloud deployment |

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│  ┌──────────────┬──────────────┬──────────────────────────┐ │
│  │ Login/Auth   │ Dashboards   │ Task Management          │ │
│  │              │              │                          │ │
│  │ - Firebase   │ - Overview   │ - Log tasks             │ │
│  │ - Protected  │ - Charts     │ - Update serial numbers │ │
│  │   Routes     │ - Analytics  │ - Track progress        │ │
│  └──────────────┴──────────────┴──────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS (Axios)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND API (Express)                      │
│  ┌──────────────┬──────────────┬──────────────────────────┐ │
│  │ Auth Routes  │ API Routes   │ Analytics                │ │
│  │              │              │                          │ │
│  │ - Login      │ - Technicians│ - Performance metrics   │ │
│  │ - Register   │ - Job Orders │ - Productivity trends   │ │
│  │ - Verify     │ - Tasks      │ - Dashboard data        │ │
│  │              │ - Alerts     │                          │ │
│  └──────────────┴──────────────┴──────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
    ┌───────────────────┐       ┌──────────────────┐
    │  MongoDB Atlas    │       │  Firebase Auth   │
    │                   │       │                  │
    │  - Technicians    │       │  - User tokens   │
    │  - Job Orders     │       │  - Auth state    │
    │  - Tasks          │       │                  │
    │  - Alerts         │       │                  │
    └───────────────────┘       └──────────────────┘
```

---

## 📁 Project Structure

```
42/
├── backend/                    # Node.js/Express backend
│   ├── config/                 # Configuration files
│   │   ├── database.js         # MongoDB connection
│   │   └── firebase.js         # Firebase Admin SDK
│   ├── middleware/             # Express middleware
│   │   ├── auth.js             # Authentication & authorization
│   │   └── errorHandler.js    # Error handling
│   ├── models/                 # Mongoose schemas
│   │   ├── Technician.js       # Technician model
│   │   ├── JobOrder.js         # Job order model
│   │   ├── Task.js             # Task model
│   │   └── Alert.js            # Alert model
│   ├── routes/                 # API routes
│   │   ├── auth.js             # Authentication endpoints
│   │   ├── technicians.js      # Technician CRUD
│   │   ├── jobOrders.js        # Job order CRUD
│   │   ├── tasks.js            # Task CRUD
│   │   ├── alerts.js           # Alert management
│   │   └── analytics.js        # Analytics & reporting
│   ├── .env.example            # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   └── server.js               # Main server file
│
└── frontend/                   # React/Vite frontend
    ├── src/
    │   ├── components/         # React components
    │   │   ├── ui/             # Shadcn UI components
    │   │   │   ├── button.jsx
    │   │   │   ├── card.jsx
    │   │   │   ├── input.jsx
    │   │   │   └── label.jsx
    │   │   ├── Layout.jsx      # Main layout with sidebar
    │   │   └── ProtectedRoute.jsx
    │   ├── config/             # Configuration
    │   │   ├── api.js          # Axios instance
    │   │   └── firebase.js     # Firebase config
    │   ├── context/            # React context
    │   │   └── AuthContext.jsx # Authentication state
    │   ├── lib/                # Utilities
    │   │   └── utils.js        # Helper functions
    │   ├── pages/              # Page components
    │   │   ├── Login.jsx       # Login page
    │   │   └── Dashboard.jsx   # Dashboard page
    │   ├── App.jsx             # Main app component
    │   ├── main.jsx            # Entry point
    │   └── index.css           # Global styles
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── .env.example
```

---

## 🗄️ Database Schema

### Technician Schema
```javascript
{
  employeeId: String (unique),
  name: String,
  email: String (unique),
  role: ['technician', 'supervisor', 'planner', 'admin'],
  phoneNumber: String,
  specialization: String,
  shiftTiming: ['morning', 'afternoon', 'night'],
  isActive: Boolean,
  firebaseUid: String (unique),
  performanceMetrics: {
    totalTasksCompleted: Number,
    averageProductivity: Number,
    averageEfficiency: Number,
    utilizationRate: Number
  },
  timestamps: { createdAt, updatedAt }
}
```

### Job Order Schema
```javascript
{
  jobOrderNumber: String (unique),
  productName: String,
  productCode: String,
  totalQuantity: Number,
  completedQuantity: Number,
  priority: ['low', 'medium', 'high', 'urgent'],
  status: ['pending', 'in-progress', 'completed', 'delayed', 'cancelled'],
  dueDate: Date,
  startDate: Date,
  completionDate: Date,
  assignedTechnicians: [ObjectId (ref: Technician)],
  serialNumbers: [{
    serialNumber: String,
    status: ['pending', 'in-progress', 'completed', 'failed'],
    assignedTo: ObjectId,
    completedAt: Date,
    notes: String
  }],
  estimatedHours: Number,
  actualHours: Number,
  timestamps: { createdAt, updatedAt }
}
```

### Task Schema
```javascript
{
  technician: ObjectId (ref: Technician),
  jobOrder: ObjectId (ref: JobOrder),
  taskDate: Date,
  startTime: Date,
  endTime: Date,
  unitsCompleted: Number,
  serialNumbersCompleted: [String],
  status: ['in-progress', 'completed', 'paused', 'cancelled'],
  productivity: Number,  // units per hour
  efficiency: Number,    // percentage
  notes: String,
  issues: [{
    description: String,
    reportedAt: Date,
    resolved: Boolean
  }],
  timestamps: { createdAt, updatedAt }
}
```

### Alert Schema
```javascript
{
  type: ['delay', 'deadline', 'low-performance', 'quality-issue', 'system'],
  severity: ['low', 'medium', 'high', 'critical'],
  title: String,
  message: String,
  relatedJobOrder: ObjectId,
  relatedTechnician: ObjectId,
  relatedTask: ObjectId,
  isRead: Boolean,
  isResolved: Boolean,
  resolvedAt: Date,
  resolvedBy: ObjectId,
  targetRoles: ['technician', 'supervisor', 'planner', 'admin'],
  timestamps: { createdAt, updatedAt }
}
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and verify token
- `GET /api/auth/me` - Get current user

### Technicians
- `GET /api/technicians` - Get all technicians (filtered)
- `GET /api/technicians/:id` - Get single technician
- `POST /api/technicians` - Create technician (Admin)
- `PUT /api/technicians/:id` - Update technician
- `DELETE /api/technicians/:id` - Delete technician (Admin)
- `GET /api/technicians/:id/performance` - Get performance metrics

### Job Orders
- `GET /api/job-orders` - Get all job orders (filtered)
- `GET /api/job-orders/:id` - Get single job order
- `POST /api/job-orders` - Create job order (Planner/Admin)
- `PUT /api/job-orders/:id` - Update job order
- `PUT /api/job-orders/:id/serial/:serialNumber` - Update serial number status
- `DELETE /api/job-orders/:id` - Delete job order (Admin)

### Tasks
- `GET /api/tasks` - Get all tasks (filtered)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create/log task
- `PUT /api/tasks/:id` - Update task
- `POST /api/tasks/:id/issues` - Report issue
- `DELETE /api/tasks/:id` - Delete task

### Alerts
- `GET /api/alerts` - Get all alerts (filtered by role)
- `GET /api/alerts/unread-count` - Get unread count
- `POST /api/alerts` - Create alert (Supervisor/Admin)
- `PUT /api/alerts/:id/read` - Mark as read
- `PUT /api/alerts/:id/resolve` - Mark as resolved
- `DELETE /api/alerts/:id` - Delete alert (Admin)

### Analytics
- `GET /api/analytics/overview` - Dashboard overview
- `GET /api/analytics/technician-performance` - Technician performance
- `GET /api/analytics/job-progress` - Job order progress
- `GET /api/analytics/productivity-trends` - Productivity trends
- `GET /api/analytics/my-performance` - Personal performance (Technicians)

---

## 🎨 Features

### For Technicians
- ✅ Log daily tasks with start/end times
- ✅ Record completed units and serial numbers
- ✅ View assigned job orders
- ✅ Track personal performance metrics
- ✅ Report issues and delays
- ✅ View task history and trends

### For Supervisors/Planners
- ✅ Monitor all technicians in real-time
- ✅ View production line overview
- ✅ Track job order progress
- ✅ Receive alerts for delays and issues
- ✅ Analyze productivity trends
- ✅ Manage job assignments

### For Administrators
- ✅ Full system access
- ✅ User management
- ✅ Create and manage job orders
- ✅ System-wide analytics
- ✅ Alert management
- ✅ Performance reporting

### Key Metrics Calculated
- **Productivity**: Units completed per hour
- **Efficiency**: Actual vs. estimated time
- **Utilization**: Active work time vs. total time
- **Completion Rate**: Finished vs. total tasks
- **Delay Tracking**: Jobs past due date

---

## 📊 Dashboard Features

### Technician Dashboard
- Personal performance summary (7 days)
- Total tasks and units completed
- Average productivity and efficiency
- Total hours worked
- Daily performance breakdown chart
- Task completion trends

### Supervisor Dashboard
- Overall job order status (pie chart)
- Active technicians count
- Today's task completion
- Critical alerts notification
- Productivity trends (line chart)
- Top performing technicians (bar chart)
- Job order distribution by status

---

## 🔐 Security Features

1. **Firebase Authentication**: Secure user login with email/password
2. **JWT Token Verification**: Backend validates Firebase tokens
3. **Role-Based Access Control (RBAC)**: Different permissions for each role
4. **Protected Routes**: Frontend and backend route protection
5. **Input Validation**: Mongoose schema validation
6. **Error Handling**: Comprehensive error management
7. **CORS Configuration**: Secure cross-origin requests

---

## 🎯 Core Requirements Met

✅ **Real-time Tracking**: Live dashboard updates  
✅ **Automated Calculations**: Productivity, efficiency, utilization  
✅ **Serial Number Tracking**: Individual unit monitoring  
✅ **Alert System**: Delays, deadlines, performance issues  
✅ **Multi-Role Support**: Technician, Supervisor, Planner, Admin  
✅ **Performance Analytics**: Comprehensive reporting  
✅ **Data Accuracy**: Reduced manual errors  
✅ **Responsive Design**: Mobile and desktop support  

---

## 📱 User Interface

### Design Principles
- **Clean and Modern**: Tailwind CSS + Shadcn/UI components
- **Responsive**: Works on desktop, tablet, and mobile
- **Accessible**: ARIA labels and keyboard navigation
- **Intuitive**: Clear navigation and visual hierarchy
- **Data-Driven**: Charts and visualizations for insights

### Color Coding
- 🔵 Blue: In Progress
- 🟢 Green: Completed
- 🟡 Yellow: Pending
- 🔴 Red: Delayed/Critical
- ⚪ Gray: Cancelled/Inactive

---

## 🚀 Getting Started

See **SETUP.md** for complete installation instructions.

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👥 Team

Developed for Hackathon 2025

---

## 📞 Support

For issues or questions, please create an issue in the repository.
