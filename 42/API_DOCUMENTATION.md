# API Documentation

## Base URL

**Development**: `http://localhost:5000/api`  
**Production**: `https://your-app.onrender.com/api`

---

## Authentication

All protected endpoints require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

To get a token:
1. User logs in via Firebase Authentication
2. Frontend obtains ID token: `await user.getIdToken()`
3. Token is sent with every API request

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10  // Optional, for list endpoints
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": []  // Optional, for validation errors
}
```

---

## Endpoints

## Authentication Endpoints

### 1. Register User

Create a new user account.

**Endpoint**: `POST /api/auth/register`  
**Access**: Public  
**Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "employeeId": "EMP001",
  "role": "technician",
  "phoneNumber": "+1234567890",
  "specialization": "Assembly"
}
```

**Response**: `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "uid": "firebase-uid",
    "email": "user@example.com",
    "name": "John Doe",
    "employeeId": "EMP001",
    "role": "technician"
  }
}
```

---

### 2. Login (Verify Token)

Verify Firebase token and get user data.

**Endpoint**: `POST /api/auth/login`  
**Access**: Public  
**Body**:
```json
{
  "idToken": "firebase-id-token"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "employeeId": "EMP001",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "technician",
      "isActive": true
    },
    "uid": "firebase-uid"
  }
}
```

---

### 3. Get Current User

Get authenticated user's profile.

**Endpoint**: `GET /api/auth/me`  
**Access**: Protected  
**Headers**: `Authorization: Bearer <token>`

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "employeeId": "EMP001",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "technician"
  }
}
```

---

## Technician Endpoints

### 1. Get All Technicians

**Endpoint**: `GET /api/technicians`  
**Access**: Supervisor, Planner, Admin  
**Query Parameters**:
- `role` - Filter by role (technician, supervisor, etc.)
- `isActive` - Filter by active status (true/false)
- `search` - Search by name, email, or employee ID

**Example**: `GET /api/technicians?role=technician&isActive=true&search=john`

**Response**: `200 OK`
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "employeeId": "EMP001",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "technician",
      "phoneNumber": "+1234567890",
      "specialization": "Assembly",
      "shiftTiming": "morning",
      "isActive": true,
      "performanceMetrics": {
        "totalTasksCompleted": 150,
        "averageProductivity": 12.5,
        "averageEfficiency": 85.3,
        "utilizationRate": 78.2
      }
    }
  ]
}
```

---

### 2. Get Single Technician

**Endpoint**: `GET /api/technicians/:id`  
**Access**: Protected (own profile) or Supervisor/Planner/Admin

**Response**: `200 OK`

---

### 3. Create Technician

**Endpoint**: `POST /api/technicians`  
**Access**: Admin  
**Body**:
```json
{
  "employeeId": "EMP002",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "technician",
  "phoneNumber": "+1234567891",
  "specialization": "Quality Control",
  "shiftTiming": "afternoon"
}
```

**Response**: `201 Created`

---

### 4. Update Technician

**Endpoint**: `PUT /api/technicians/:id`  
**Access**: Supervisor, Admin

---

### 5. Delete Technician

**Endpoint**: `DELETE /api/technicians/:id`  
**Access**: Admin

---

### 6. Get Technician Performance

**Endpoint**: `GET /api/technicians/:id/performance`  
**Access**: Protected

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "employeeId": "EMP001",
    "name": "John Doe",
    "metrics": {
      "totalTasksCompleted": 150,
      "averageProductivity": 12.5,
      "averageEfficiency": 85.3,
      "utilizationRate": 78.2
    }
  }
}
```

---

## Job Order Endpoints

### 1. Get All Job Orders

**Endpoint**: `GET /api/job-orders`  
**Access**: Protected  
**Query Parameters**:
- `status` - pending, in-progress, completed, delayed, cancelled
- `priority` - low, medium, high, urgent
- `assignedTo` - Filter by technician ID
- `search` - Search by job number, product name, or code

**Example**: `GET /api/job-orders?status=in-progress&priority=high`

**Response**: `200 OK`
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "jobOrderNumber": "JO-2025-001",
      "productName": "Circuit Board Assembly",
      "productCode": "PCB-001",
      "totalQuantity": 100,
      "completedQuantity": 45,
      "priority": "high",
      "status": "in-progress",
      "dueDate": "2025-11-01T00:00:00.000Z",
      "startDate": "2025-10-15T08:00:00.000Z",
      "assignedTechnicians": [
        {
          "_id": "...",
          "employeeId": "EMP001",
          "name": "John Doe",
          "email": "john@example.com"
        }
      ],
      "serialNumbers": [
        {
          "serialNumber": "SN001",
          "status": "completed",
          "assignedTo": "...",
          "completedAt": "2025-10-20T14:30:00.000Z"
        }
      ],
      "estimatedHours": 80,
      "actualHours": 45.5,
      "progressPercentage": "45.00",
      "isDelayed": false
    }
  ]
}
```

---

### 2. Get Single Job Order

**Endpoint**: `GET /api/job-orders/:id`  
**Access**: Protected (assigned technicians or supervisor/planner/admin)

---

### 3. Create Job Order

**Endpoint**: `POST /api/job-orders`  
**Access**: Planner, Admin  
**Body**:
```json
{
  "jobOrderNumber": "JO-2025-002",
  "productName": "Motor Assembly",
  "productCode": "MTR-100",
  "totalQuantity": 50,
  "priority": "medium",
  "dueDate": "2025-11-15",
  "assignedTechnicians": ["technician-id-1", "technician-id-2"],
  "serialNumbers": [
    { "serialNumber": "SN100", "status": "pending" },
    { "serialNumber": "SN101", "status": "pending" }
  ],
  "estimatedHours": 40,
  "notes": "Handle with care"
}
```

**Response**: `201 Created`

---

### 4. Update Job Order

**Endpoint**: `PUT /api/job-orders/:id`  
**Access**: Planner, Supervisor, Admin

---

### 5. Update Serial Number Status

**Endpoint**: `PUT /api/job-orders/:id/serial/:serialNumber`  
**Access**: Protected  
**Body**:
```json
{
  "status": "completed",
  "notes": "Quality check passed"
}
```

**Response**: `200 OK`

---

### 6. Delete Job Order

**Endpoint**: `DELETE /api/job-orders/:id`  
**Access**: Admin

---

## Task Endpoints

### 1. Get All Tasks

**Endpoint**: `GET /api/tasks`  
**Access**: Protected  
**Query Parameters**:
- `technicianId` - Filter by technician
- `jobOrderId` - Filter by job order
- `status` - in-progress, completed, paused, cancelled
- `startDate` - Filter by date range (ISO format)
- `endDate` - Filter by date range (ISO format)

**Example**: `GET /api/tasks?technicianId=...&startDate=2025-10-01&endDate=2025-10-31`

**Response**: `200 OK`
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "...",
      "technician": {
        "_id": "...",
        "employeeId": "EMP001",
        "name": "John Doe"
      },
      "jobOrder": {
        "_id": "...",
        "jobOrderNumber": "JO-2025-001",
        "productName": "Circuit Board"
      },
      "taskDate": "2025-10-26T00:00:00.000Z",
      "startTime": "2025-10-26T08:00:00.000Z",
      "endTime": "2025-10-26T12:00:00.000Z",
      "unitsCompleted": 10,
      "serialNumbersCompleted": ["SN001", "SN002"],
      "status": "completed",
      "productivity": 2.5,
      "efficiency": 85.5,
      "durationHours": "4.00",
      "notes": "Smooth operation"
    }
  ]
}
```

---

### 2. Get Single Task

**Endpoint**: `GET /api/tasks/:id`  
**Access**: Protected (own tasks or supervisor/planner/admin)

---

### 3. Create Task (Log Work)

**Endpoint**: `POST /api/tasks`  
**Access**: Protected  
**Body**:
```json
{
  "jobOrder": "job-order-id",
  "taskDate": "2025-10-26",
  "startTime": "2025-10-26T08:00:00.000Z",
  "endTime": "2025-10-26T12:00:00.000Z",
  "unitsCompleted": 10,
  "serialNumbersCompleted": ["SN001", "SN002"],
  "status": "completed",
  "notes": "All units passed QC"
}
```

**Response**: `201 Created`

**Note**: This automatically updates the job order's completed quantity and status.

---

### 4. Update Task

**Endpoint**: `PUT /api/tasks/:id`  
**Access**: Protected (own tasks or supervisor/admin)

---

### 5. Add Issue to Task

**Endpoint**: `POST /api/tasks/:id/issues`  
**Access**: Protected  
**Body**:
```json
{
  "description": "Machine malfunction at station 3",
  "reportedAt": "2025-10-26T10:30:00.000Z"
}
```

**Response**: `200 OK`

---

### 6. Delete Task

**Endpoint**: `DELETE /api/tasks/:id`  
**Access**: Protected (own tasks or supervisor/admin)

---

## Alert Endpoints

### 1. Get All Alerts

**Endpoint**: `GET /api/alerts`  
**Access**: Protected  
**Query Parameters**:
- `isRead` - true/false
- `isResolved` - true/false
- `severity` - low, medium, high, critical
- `type` - delay, deadline, low-performance, quality-issue, system

**Example**: `GET /api/alerts?isRead=false&severity=critical`

**Response**: `200 OK`
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "type": "delay",
      "severity": "high",
      "title": "Job Order JO-2025-001 is Delayed",
      "message": "Job order has passed its due date",
      "relatedJobOrder": {
        "_id": "...",
        "jobOrderNumber": "JO-2025-001",
        "productName": "Circuit Board"
      },
      "isRead": false,
      "isResolved": false,
      "targetRoles": ["supervisor", "planner"],
      "createdAt": "2025-10-26T09:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Unread Count

**Endpoint**: `GET /api/alerts/unread-count`  
**Access**: Protected

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "count": 3
  }
}
```

---

### 3. Create Alert

**Endpoint**: `POST /api/alerts`  
**Access**: Supervisor, Admin  
**Body**:
```json
{
  "type": "quality-issue",
  "severity": "high",
  "title": "Quality Issue Detected",
  "message": "Multiple units failed QC in Job JO-2025-001",
  "relatedJobOrder": "job-order-id",
  "targetRoles": ["supervisor", "planner", "admin"]
}
```

**Response**: `201 Created`

---

### 4. Mark Alert as Read

**Endpoint**: `PUT /api/alerts/:id/read`  
**Access**: Protected

**Response**: `200 OK`

---

### 5. Mark Alert as Resolved

**Endpoint**: `PUT /api/alerts/:id/resolve`  
**Access**: Supervisor, Admin

**Response**: `200 OK`

---

### 6. Delete Alert

**Endpoint**: `DELETE /api/alerts/:id`  
**Access**: Admin

---

## Analytics Endpoints

### 1. Dashboard Overview

**Endpoint**: `GET /api/analytics/overview`  
**Access**: Supervisor, Planner, Admin

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "jobOrders": {
      "total": 50,
      "pending": 10,
      "inProgress": 25,
      "completed": 12,
      "delayed": 3
    },
    "technicians": {
      "total": 14,
      "active": 14
    },
    "tasks": {
      "today": 28,
      "todayCompleted": 20
    },
    "alerts": {
      "critical": 2,
      "unread": 5
    }
  }
}
```

---

### 2. Technician Performance

**Endpoint**: `GET /api/analytics/technician-performance`  
**Access**: Supervisor, Planner, Admin  
**Query Parameters**:
- `period` - today, 7days, 30days, week, month

**Example**: `GET /api/analytics/technician-performance?period=7days`

**Response**: `200 OK`
```json
{
  "success": true,
  "period": "7days",
  "count": 14,
  "data": [
    {
      "technicianId": "EMP001",
      "name": "John Doe",
      "totalTasks": 35,
      "totalUnits": 420,
      "avgProductivity": 12.5,
      "avgEfficiency": 87.3
    }
  ]
}
```

---

### 3. Job Progress Analytics

**Endpoint**: `GET /api/analytics/job-progress`  
**Access**: Supervisor, Planner, Admin

**Response**: `200 OK`
```json
{
  "success": true,
  "count": 50,
  "data": [
    {
      "jobOrderNumber": "JO-2025-001",
      "productName": "Circuit Board",
      "totalQuantity": 100,
      "completedQuantity": 75,
      "status": "in-progress",
      "dueDate": "2025-11-01",
      "priority": "high",
      "progressPercentage": 75,
      "isDelayed": false
    }
  ]
}
```

---

### 4. Productivity Trends

**Endpoint**: `GET /api/analytics/productivity-trends`  
**Access**: Supervisor, Planner, Admin  
**Query Parameters**:
- `days` - Number of days (default: 30)

**Example**: `GET /api/analytics/productivity-trends?days=7`

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-10-20",
      "totalTasks": 45,
      "totalUnits": 520,
      "avgProductivity": 11.56,
      "avgEfficiency": 83.2
    }
  ]
}
```

---

### 5. My Performance (Technician)

**Endpoint**: `GET /api/analytics/my-performance`  
**Access**: Protected (All roles)  
**Query Parameters**:
- `period` - today, 7days, 30days

**Example**: `GET /api/analytics/my-performance?period=7days`

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalTasks": 35,
      "totalUnits": 420,
      "avgProductivity": 12.5,
      "avgEfficiency": 87.3,
      "totalHours": 140.5
    },
    "dailyBreakdown": [
      {
        "_id": "2025-10-20",
        "tasks": 5,
        "units": 60,
        "productivity": 12.0
      }
    ]
  }
}
```

---

## Error Codes

| Status Code | Meaning |
|------------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding in production.

---

## Pagination

For large datasets, consider implementing pagination:
```
GET /api/tasks?page=1&limit=20
```

This is not currently implemented but recommended for production.

---

## Testing with Postman

1. Import the collection (create one from these endpoints)
2. Set environment variable `{{baseUrl}}` = `http://localhost:5000/api`
3. After login, set `{{token}}` to the Firebase ID token
4. Use `{{token}}` in Authorization headers

---

## WebSocket Support

WebSocket support for real-time updates is not currently implemented but recommended for production use cases.

Potential implementation:
- Socket.io for real-time notifications
- Live dashboard updates
- Alert broadcasting

---
