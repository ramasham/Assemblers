export interface JobOrder {
  id: string
  jobNumber: string
  deviceType: string
  serialNumber: string
  quantity: number
  completed: number
  dueDate: string
  priority: "high" | "medium" | "low"
  status: "pending" | "in-progress" | "completed" | "delayed"
  assignedTo?: string
  notes?: string
}

export interface Task {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  dueDate: string
  status: "pending" | "in-progress" | "completed"
  assignedTo: string
  jobOrderId?: string
}

export interface Alert {
  id: string
  type: "warning" | "error" | "info" | "success"
  title: string
  message: string
  timestamp: string
  read: boolean
}

export interface PerformanceMetric {
  technicianId: string
  technicianName: string
  productivity: number // units per hour
  efficiency: number // percentage
  utilization: number // percentage
  completedUnits: number
  workHours: number
  date: string
}

export interface CalendarEvent {
  id: string
  title: string
  date: string
  type: "holiday" | "meeting" | "deadline"
  description?: string
  roles?: string[]
}

export interface TodoItem {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  dueDate: string
  status: "pending" | "in-progress" | "completed"
  assignedTo: string
}

export interface WorkSubmission {
  id: string
  technicianId: string
  technicianName: string
  date: string
  tasksCompleted: string
  devicesCompleted: number
  serialNumbers: string[]
  notes: string
  hoursWorked: number
  status: "pending" | "approved" | "rejected"
}

export interface Notification {
  id: string
  type: "urgent" | "warning" | "info" | "success"
  title: string
  message: string
  timestamp: string
  read: boolean
  urgent: boolean
}

export const mockJobOrders: JobOrder[] = [
  {
    id: "1",
    jobNumber: "JO-2025-001",
    deviceType: "Sensor Module A",
    serialNumber: "SN-A-1001",
    quantity: 50,
    completed: 35,
    dueDate: "2025-01-30",
    priority: "high",
    status: "in-progress",
    assignedTo: "Mike Davis",
  },
  {
    id: "2",
    jobNumber: "JO-2025-002",
    deviceType: "Control Unit B",
    serialNumber: "SN-B-2001",
    quantity: 30,
    completed: 30,
    dueDate: "2025-01-28",
    priority: "medium",
    status: "completed",
    assignedTo: "Mike Davis",
  },
  {
    id: "3",
    jobNumber: "JO-2025-003",
    deviceType: "Display Panel C",
    serialNumber: "SN-C-3001",
    quantity: 40,
    completed: 10,
    dueDate: "2025-01-29",
    priority: "high",
    status: "delayed",
    assignedTo: "Emily Chen",
    notes: "Waiting for components",
  },
  {
    id: "4",
    jobNumber: "JO-2025-004",
    deviceType: "Power Supply D",
    serialNumber: "SN-D-4001",
    quantity: 25,
    completed: 0,
    dueDate: "2025-02-05",
    priority: "low",
    status: "pending",
  },
]

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Complete assembly for JO-2025-001",
    description: "Finish remaining 15 units of Sensor Module A",
    priority: "high",
    dueDate: "2025-01-30",
    status: "in-progress",
    assignedTo: "Mike Davis",
    jobOrderId: "1",
  },
  {
    id: "2",
    title: "Quality check for JO-2025-002",
    description: "Perform final quality inspection on Control Unit B",
    priority: "medium",
    dueDate: "2025-01-28",
    status: "completed",
    assignedTo: "David Lee",
    jobOrderId: "2",
  },
  {
    id: "3",
    title: "Test Display Panel C units",
    description: "Run functional tests on completed units",
    priority: "high",
    dueDate: "2025-01-29",
    status: "in-progress",
    assignedTo: "Emily Chen",
    jobOrderId: "3",
  },
]

export const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "warning",
    title: "Job Order Delayed",
    message: "JO-2025-003 is behind schedule. Only 25% completed with 2 days remaining.",
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: "2",
    type: "error",
    title: "Due Date Approaching",
    message: "JO-2025-001 is due in 3 days. Current progress: 70%",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "New Job Order Assigned",
    message: "JO-2025-005 has been assigned to your queue",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: true,
  },
]

export const mockPerformanceMetrics: PerformanceMetric[] = [
  {
    technicianId: "1",
    technicianName: "Mike Davis",
    productivity: 4.5,
    efficiency: 92,
    utilization: 88,
    completedUnits: 36,
    workHours: 8,
    date: "2025-01-27",
  },
  {
    technicianId: "2",
    technicianName: "Emily Chen",
    productivity: 3.8,
    efficiency: 85,
    utilization: 82,
    completedUnits: 30,
    workHours: 8,
    date: "2025-01-27",
  },
  {
    technicianId: "3",
    technicianName: "David Lee",
    productivity: 4.2,
    efficiency: 89,
    utilization: 85,
    completedUnits: 34,
    workHours: 8,
    date: "2025-01-27",
  },
]

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "New Year's Day",
    date: "2025-01-01",
    type: "holiday",
    description: "Company Holiday",
  },
  {
    id: "2",
    title: "Team Meeting",
    date: "2025-01-30",
    type: "meeting",
    description: "Monthly production review",
  },
  {
    id: "3",
    title: "JO-2025-001 Deadline",
    date: "2025-01-30",
    type: "deadline",
    description: "Sensor Module A completion",
  },
  {
    id: "4",
    title: "Safety Training",
    date: "2025-02-05",
    type: "meeting",
    description: "Mandatory safety training for all staff",
  },
  {
    id: "5",
    title: "JO-2025-004 Deadline",
    date: "2025-02-05",
    type: "deadline",
    description: "Power Supply D completion",
  },
]

export const mockTodoItems: TodoItem[] = [
  {
    id: "1",
    title: "Complete Sensor Module A assembly",
    description: "Finish remaining 15 units",
    priority: "high",
    dueDate: "2025-01-30",
    status: "in-progress",
    assignedTo: "Mike Davis",
  },
  {
    id: "2",
    title: "Quality inspection for Control Unit B",
    description: "Final QC check before shipment",
    priority: "medium",
    dueDate: "2025-01-28",
    status: "completed",
    assignedTo: "David Lee",
  },
  {
    id: "3",
    title: "Test Display Panel C",
    description: "Run functional tests on 10 units",
    priority: "high",
    dueDate: "2025-01-29",
    status: "in-progress",
    assignedTo: "Emily Chen",
  },
  {
    id: "4",
    title: "Prepare workstation for new job order",
    description: "Clean and organize tools",
    priority: "low",
    dueDate: "2025-01-31",
    status: "pending",
    assignedTo: "Mike Davis",
  },
]

export const mockWorkSubmissions: WorkSubmission[] = [
  {
    id: "1",
    technicianId: "1",
    technicianName: "Mike Davis",
    date: "2025-01-27",
    tasksCompleted: "Assembled 8 Sensor Module A units",
    devicesCompleted: 8,
    serialNumbers: ["SN-A-1001", "SN-A-1002", "SN-A-1003"],
    notes: "All units passed initial testing",
    hoursWorked: 8,
    status: "approved",
  },
  {
    id: "2",
    technicianId: "2",
    technicianName: "Emily Chen",
    date: "2025-01-27",
    tasksCompleted: "Tested Display Panel C units",
    devicesCompleted: 5,
    serialNumbers: ["SN-C-3001", "SN-C-3002"],
    notes: "2 units failed testing, need rework",
    hoursWorked: 8,
    status: "pending",
  },
]

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "urgent",
    title: "Critical Deadline Alert",
    message: "JO-2025-001 must be completed by end of day tomorrow!",
    timestamp: new Date().toISOString(),
    read: false,
    urgent: true,
  },
  {
    id: "2",
    type: "warning",
    title: "Job Order Delayed",
    message: "JO-2025-003 is behind schedule. Only 25% completed with 2 days remaining.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    urgent: false,
  },
  {
    id: "3",
    type: "info",
    title: "New Job Order Assigned",
    message: "JO-2025-005 has been assigned to your queue",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: true,
    urgent: false,
  },
  {
    id: "4",
    type: "success",
    title: "Task Completed",
    message: "JO-2025-002 has been successfully completed and approved",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true,
    urgent: false,
  },
]
