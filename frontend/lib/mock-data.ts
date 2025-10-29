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
  department?: "production" | "test" | "quality"
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
  department?: "production" | "test" | "quality"
  destination?: "technician" | "supervisor" | "planner"
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
  department?: "production" | "test" | "quality"
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
  minutesWorked: number
  status: "pending" | "approved" | "rejected"
  reviewReason?: string
  reviewedBy?: string
  reviewedAt?: string
  department: "production" | "test" | "quality"
}

export interface Notification {
  id: string
  type: "urgent" | "warning" | "info" | "success"
  title: string
  message: string
  timestamp: string
  read: boolean
  urgent: boolean
  department?: "production" | "test" | "quality"
  destination?: "technician" | "supervisor" | "planner"
}

export interface Device {
  id: string
  serialNumber: string
  model: string
  jobOrderId: string
  currentOperation: string
  status: "in-progress" | "completed" | "waiting" | "testing" | "failed" | "approved"
  assignedTo: string
  startTime: string
  completionTime?: string
  failureReason?: string
  stationHistory: {
    station: string
    startTime: string
    endTime?: string
    duration?: number
  }[]
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
    department: "production",
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
    department: "production",
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
    department: "test",
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
    department: "quality",
  },
  {
    id: "5",
    jobNumber: "JO-2025-005",
    deviceType: "Circuit Board E",
    serialNumber: "SN-E-5001",
    quantity: 60,
    completed: 0,
    dueDate: "2025-02-08",
    priority: "high",
    status: "pending",
    notes: "Urgent order from Test Department",
    department: "test",
  },
  {
    id: "6",
    jobNumber: "JO-2025-006",
    deviceType: "LED Assembly F",
    serialNumber: "SN-F-6001",
    quantity: 45,
    completed: 0,
    dueDate: "2025-02-10",
    priority: "medium",
    status: "pending",
    notes: "Quality Department request",
    department: "quality",
  },
  {
    id: "7",
    jobNumber: "JO-2025-007",
    deviceType: "Motor Unit G",
    serialNumber: "SN-G-7001",
    quantity: 35,
    completed: 0,
    dueDate: "2025-02-12",
    priority: "medium",
    status: "pending",
    department: "production",
  },
  {
    id: "8",
    jobNumber: "JO-2025-008",
    deviceType: "Battery Pack H",
    serialNumber: "SN-H-8001",
    quantity: 80,
    completed: 0,
    dueDate: "2025-02-15",
    priority: "low",
    status: "pending",
    notes: "Production Department standard order",
    department: "production",
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
    title: "Production Job Order Delayed",
    message: "JO-2025-003 is behind schedule. Only 25% completed with 2 days remaining.",
    timestamp: new Date().toISOString(),
    read: false,
    department: "production",
    destination: "supervisor",
  },
  {
    id: "2",
    type: "error",
    title: "Production Due Date Approaching",
    message: "JO-2025-001 is due in 3 days. Current progress: 70%",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    department: "production",
    destination: "planner",
  },
  {
    id: "3",
    type: "info",
    title: "New Production Job Order Assigned",
    message: "JO-2025-005 has been assigned to your queue",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: true,
    department: "production",
    destination: "technician",
  },
  {
    id: "4",
    type: "warning",
    title: "Test Department - Low Efficiency Alert",
    message: "Testing efficiency dropped to 78% in the last hour",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    read: false,
    department: "test",
    destination: "supervisor",
  },
  {
    id: "5",
    type: "error",
    title: "Quality Inspection Overdue",
    message: "5 units awaiting quality inspection for over 24 hours",
    timestamp: new Date(Date.now() - 5400000).toISOString(),
    read: false,
    department: "quality",
    destination: "supervisor",
  },
  {
    id: "6",
    type: "info",
    title: "Test Equipment Calibration Due",
    message: "Unit testing equipment requires calibration by end of week",
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    read: true,
    department: "test",
    destination: "technician",
  },
  {
    id: "7",
    type: "success",
    title: "Quality Batch Approved",
    message: "Batch QA-2025-012 passed all quality checks - 45 units approved",
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    read: true,
    department: "quality",
    destination: "planner",
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
    department: "production",
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
    department: "test",
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
    department: "quality",
  },
  {
    technicianId: "4",
    technicianName: "Sarah Martinez",
    productivity: 4.8,
    efficiency: 94,
    utilization: 91,
    completedUnits: 38,
    workHours: 8,
    date: "2025-01-27",
    department: "production",
  },
  {
    technicianId: "5",
    technicianName: "James Wilson",
    productivity: 3.5,
    efficiency: 78,
    utilization: 75,
    completedUnits: 28,
    workHours: 8,
    date: "2025-01-27",
    department: "test",
  },
  {
    technicianId: "6",
    technicianName: "Lisa Anderson",
    productivity: 4.1,
    efficiency: 87,
    utilization: 84,
    completedUnits: 33,
    workHours: 8,
    date: "2025-01-27",
    department: "quality",
  },
  {
    technicianId: "7",
    technicianName: "Robert Taylor",
    productivity: 4.6,
    efficiency: 91,
    utilization: 89,
    completedUnits: 37,
    workHours: 8,
    date: "2025-01-27",
    department: "production",
  },
  {
    technicianId: "8",
    technicianName: "Jennifer Brown",
    productivity: 3.9,
    efficiency: 83,
    utilization: 80,
    completedUnits: 31,
    workHours: 8,
    date: "2025-01-27",
    department: "test",
  },
  {
    technicianId: "9",
    technicianName: "Michael Johnson",
    productivity: 4.3,
    efficiency: 88,
    utilization: 86,
    completedUnits: 34,
    workHours: 8,
    date: "2025-01-27",
    department: "quality",
  },
  {
    technicianId: "10",
    technicianName: "Amanda White",
    productivity: 4.7,
    efficiency: 93,
    utilization: 90,
    completedUnits: 38,
    workHours: 8,
    date: "2025-01-27",
    department: "production",
  },
  {
    technicianId: "11",
    technicianName: "Christopher Garcia",
    productivity: 3.6,
    efficiency: 79,
    utilization: 76,
    completedUnits: 29,
    workHours: 8,
    date: "2025-01-27",
    department: "test",
  },
  {
    technicianId: "12",
    technicianName: "Jessica Martinez",
    productivity: 4.4,
    efficiency: 90,
    utilization: 87,
    completedUnits: 35,
    workHours: 8,
    date: "2025-01-27",
    department: "quality",
  },
  {
    technicianId: "13",
    technicianName: "Daniel Rodriguez",
    productivity: 3.7,
    efficiency: 81,
    utilization: 78,
    completedUnits: 30,
    workHours: 8,
    date: "2025-01-27",
    department: "production",
  },
  {
    technicianId: "14",
    technicianName: "Michelle Lee",
    productivity: 4.0,
    efficiency: 86,
    utilization: 83,
    completedUnits: 32,
    workHours: 8,
    date: "2025-01-27",
    department: "test",
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
    minutesWorked: 35,
    status: "approved",
    reviewReason: "Excellent work! All units meet quality standards and documentation is complete.",
    reviewedBy: "Sarah Johnson",
    reviewedAt: "2025-01-27T18:30:00",
    department: "production",
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
    minutesWorked: 28,
    status: "pending",
    department: "test",
  },
  {
    id: "3",
    technicianId: "1",
    technicianName: "Mike Davis",
    date: "2025-01-26",
    tasksCompleted: "Assembled 6 Control Unit B units",
    devicesCompleted: 6,
    serialNumbers: ["SN-B-2001", "SN-B-2002"],
    notes: "Completed ahead of schedule",
    minutesWorked: 22,
    status: "rejected",
    reviewReason: "Serial numbers do not match the job order. Please verify and resubmit with correct serial numbers.",
    reviewedBy: "Sarah Johnson",
    reviewedAt: "2025-01-26T17:45:00",
    department: "production",
  },
  {
    id: "4",
    technicianId: "3",
    technicianName: "David Lee",
    date: "2025-01-27",
    tasksCompleted: "Quality inspection on LED Assembly F",
    devicesCompleted: 12,
    serialNumbers: ["SN-F-6001", "SN-F-6002", "SN-F-6003"],
    notes: "All units passed quality standards",
    minutesWorked: 40,
    status: "pending",
    department: "quality",
  },
  {
    id: "5",
    technicianId: "1",
    technicianName: "Mike Davis",
    date: "2025-01-28",
    tasksCompleted: "Assembled 10 Sensor Module A units - Final Touch Cleaning & Packing",
    devicesCompleted: 10,
    serialNumbers: ["SN-A-1004", "SN-A-1005", "SN-A-1006", "SN-A-1007"],
    notes: "Completed final assembly stage. Ready for quality inspection.",
    minutesWorked: 38,
    status: "pending",
    department: "production",
  },
  {
    id: "6",
    technicianId: "2",
    technicianName: "Emily Chen",
    date: "2025-01-28",
    tasksCompleted: "Unit Test on Circuit Board E",
    devicesCompleted: 15,
    serialNumbers: ["SN-E-5001", "SN-E-5002", "SN-E-5003", "SN-E-5004", "SN-E-5005"],
    notes: "All units passed unit testing. One unit required minor adjustment on photoresistor.",
    minutesWorked: 45,
    status: "pending",
    department: "test",
  },
  {
    id: "7",
    technicianId: "3",
    technicianName: "David Lee",
    date: "2025-01-28",
    tasksCompleted: "Quality Assemblage II on Power Supply D",
    devicesCompleted: 8,
    serialNumbers: ["SN-D-4001", "SN-D-4002", "SN-D-4003"],
    notes: "Final quality check completed. All units meet specifications.",
    minutesWorked: 32,
    status: "pending",
    department: "quality",
  },
  {
    id: "8",
    technicianId: "4",
    technicianName: "Sarah Martinez",
    date: "2025-01-28",
    tasksCompleted: "Assemblage I and II on Motor Unit G",
    devicesCompleted: 12,
    serialNumbers: ["SN-G-7001", "SN-G-7002", "SN-G-7003", "SN-G-7004"],
    notes: "Completed both assembly stages. No issues encountered.",
    minutesWorked: 36,
    status: "pending",
    department: "production",
  },
  {
    id: "9",
    technicianId: "5",
    technicianName: "James Wilson",
    date: "2025-01-28",
    tasksCompleted: "Adjustment and Immersion testing on Display Panel C",
    devicesCompleted: 6,
    serialNumbers: ["SN-C-3003", "SN-C-3004", "SN-C-3005"],
    notes: "Immersion testing completed successfully. All units waterproof certified.",
    minutesWorked: 30,
    status: "pending",
    department: "test",
  },
  {
    id: "10",
    technicianId: "6",
    technicianName: "Lisa Anderson",
    date: "2025-01-28",
    tasksCompleted: "Final inspection and Packing on Battery Pack H",
    devicesCompleted: 20,
    serialNumbers: ["SN-H-8001", "SN-H-8002", "SN-H-8003", "SN-H-8004", "SN-H-8005", "SN-H-8006"],
    notes: "Large batch completed. All units inspected and packed for shipment.",
    minutesWorked: 42,
    status: "pending",
    department: "quality",
  },
  {
    id: "11",
    technicianId: "1",
    technicianName: "Mike Davis",
    date: "2025-01-29",
    tasksCompleted: "Sub-Assemblies - Battery Contact Assembly and Cover Assembly",
    devicesCompleted: 14,
    serialNumbers: ["SN-A-1008", "SN-A-1009", "SN-A-1010", "SN-A-1011"],
    notes: "Completed sub-assembly work. Battery contacts installed and tested.",
    minutesWorked: 34,
    status: "pending",
    department: "production",
  },
  {
    id: "12",
    technicianId: "4",
    technicianName: "Sarah Martinez",
    date: "2025-01-29",
    tasksCompleted: "Troubleshooting and Reticle Assembly on Sensor Module A",
    devicesCompleted: 4,
    serialNumbers: ["SN-A-1012", "SN-A-1013"],
    notes: "Fixed reticle alignment issues on 2 units. Cleaned beam and tube assemblies.",
    minutesWorked: 25,
    status: "pending",
    department: "production",
  },
]

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "urgent",
    title: "Critical Production Deadline Alert",
    message: "JO-2025-001 must be completed by end of day tomorrow!",
    timestamp: new Date().toISOString(),
    read: false,
    urgent: true,
    department: "production",
    destination: "supervisor",
  },
  {
    id: "2",
    type: "warning",
    title: "Production Job Order Delayed",
    message: "JO-2025-003 is behind schedule. Only 25% completed with 2 days remaining.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    urgent: false,
    department: "production",
    destination: "planner",
  },
  {
    id: "3",
    type: "info",
    title: "New Production Assignment",
    message: "JO-2025-005 has been assigned to your queue",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: true,
    urgent: false,
    department: "production",
    destination: "technician",
  },
  {
    id: "4",
    type: "success",
    title: "Production Task Completed",
    message: "JO-2025-002 has been successfully completed and approved",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true,
    urgent: false,
    department: "production",
    destination: "technician",
  },
  {
    id: "5",
    type: "urgent",
    title: "Test Department - Equipment Failure",
    message: "Unit testing station #3 is offline. Immediate attention required!",
    timestamp: new Date(Date.now() - 900000).toISOString(),
    read: false,
    urgent: true,
    department: "test",
    destination: "supervisor",
  },
  {
    id: "6",
    type: "warning",
    title: "Test Results Pending Review",
    message: "12 units completed testing and awaiting supervisor approval",
    timestamp: new Date(Date.now() - 5400000).toISOString(),
    read: false,
    urgent: false,
    department: "test",
    destination: "supervisor",
  },
  {
    id: "7",
    type: "info",
    title: "Test Schedule Updated",
    message: "Display Panel C testing rescheduled to tomorrow morning",
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    read: true,
    urgent: false,
    department: "test",
    destination: "technician",
  },
  {
    id: "8",
    type: "success",
    title: "Test Batch Passed",
    message: "All 15 Circuit Board E units passed unit testing",
    timestamp: new Date(Date.now() - 18000000).toISOString(),
    read: true,
    urgent: false,
    department: "test",
    destination: "planner",
  },
  {
    id: "9",
    type: "urgent",
    title: "Quality - Failed Inspection Alert",
    message: "8 units failed final quality inspection. Immediate review needed!",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    read: false,
    urgent: true,
    department: "quality",
    destination: "supervisor",
  },
  {
    id: "10",
    type: "warning",
    title: "Quality Standards Update",
    message: "New quality inspection criteria effective next week",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: false,
    urgent: false,
    department: "quality",
    destination: "technician",
  },
  {
    id: "11",
    type: "info",
    title: "Quality Inspection Scheduled",
    message: "Battery Pack H batch scheduled for final inspection tomorrow",
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    read: true,
    urgent: false,
    department: "quality",
    destination: "planner",
  },
  {
    id: "12",
    type: "success",
    title: "Quality Milestone Achieved",
    message: "Quality department achieved 98% approval rate this week!",
    timestamp: new Date(Date.now() - 21600000).toISOString(),
    read: true,
    urgent: false,
    department: "quality",
    destination: "supervisor",
  },
]

export const mockDevices: Device[] = [
  {
    id: "1",
    serialNumber: "SN-A-1001",
    model: "Sensor Module A",
    jobOrderId: "1",
    currentOperation: "Final Touch - Cleaning&Packing",
    status: "in-progress",
    assignedTo: "Mike Davis",
    startTime: "2025-01-27T08:00:00",
    stationHistory: [
      {
        station: "Assemblage I",
        startTime: "2025-01-27T08:00:00",
        endTime: "2025-01-27T09:30:00",
        duration: 90,
      },
      {
        station: "Assemblage II",
        startTime: "2025-01-27T09:30:00",
        endTime: "2025-01-27T11:00:00",
        duration: 90,
      },
      {
        station: "Final Touch - Cleaning&Packing",
        startTime: "2025-01-27T11:00:00",
      },
    ],
  },
  {
    id: "2",
    serialNumber: "SN-B-2001",
    model: "Control Unit B",
    jobOrderId: "2",
    currentOperation: "Quality Assemblage II",
    status: "approved",
    assignedTo: "David Lee",
    startTime: "2025-01-26T08:00:00",
    completionTime: "2025-01-27T16:00:00",
    stationHistory: [
      {
        station: "Assemblage I",
        startTime: "2025-01-26T08:00:00",
        endTime: "2025-01-26T10:00:00",
        duration: 120,
      },
      {
        station: "Assemblage II",
        startTime: "2025-01-26T10:00:00",
        endTime: "2025-01-26T12:00:00",
        duration: 120,
      },
      {
        station: "Quality Assemblage I",
        startTime: "2025-01-27T08:00:00",
        endTime: "2025-01-27T14:00:00",
        duration: 360,
      },
      {
        station: "Quality Assemblage II",
        startTime: "2025-01-27T14:00:00",
        endTime: "2025-01-27T16:00:00",
        duration: 120,
      },
    ],
  },
  {
    id: "3",
    serialNumber: "SN-C-3001",
    model: "Display Panel C",
    jobOrderId: "3",
    currentOperation: "Unit Test",
    status: "testing",
    assignedTo: "Emily Chen",
    startTime: "2025-01-27T13:00:00",
    stationHistory: [
      {
        station: "Assemblage I",
        startTime: "2025-01-27T08:00:00",
        endTime: "2025-01-27T10:30:00",
        duration: 150,
      },
      {
        station: "Unit Test",
        startTime: "2025-01-27T13:00:00",
      },
    ],
  },
  {
    id: "4",
    serialNumber: "SN-A-1002",
    model: "Sensor Module A",
    jobOrderId: "1",
    currentOperation: "Assemblage II",
    status: "in-progress",
    assignedTo: "Mike Davis",
    startTime: "2025-01-28T08:00:00",
    stationHistory: [
      {
        station: "Assemblage I",
        startTime: "2025-01-28T08:00:00",
        endTime: "2025-01-28T09:45:00",
        duration: 105,
      },
      {
        station: "Assemblage II",
        startTime: "2025-01-28T09:45:00",
      },
    ],
  },
  {
    id: "5",
    serialNumber: "SN-D-4001",
    model: "Power Supply D",
    jobOrderId: "4",
    currentOperation: "Unit Test",
    status: "failed",
    assignedTo: "Emily Chen",
    startTime: "2025-01-28T10:00:00",
    failureReason: "Power output below specification - requires component replacement",
    stationHistory: [
      {
        station: "Assemblage I",
        startTime: "2025-01-28T08:00:00",
        endTime: "2025-01-28T09:30:00",
        duration: 90,
      },
      {
        station: "Unit Test",
        startTime: "2025-01-28T10:00:00",
        endTime: "2025-01-28T10:45:00",
        duration: 45,
      },
    ],
  },
  {
    id: "6",
    serialNumber: "SN-E-5001",
    model: "Circuit Board E",
    jobOrderId: "5",
    currentOperation: "Assemblage I",
    status: "in-progress",
    assignedTo: "Sarah Martinez",
    startTime: "2025-01-29T08:00:00",
    stationHistory: [
      {
        station: "Assemblage I",
        startTime: "2025-01-29T08:00:00",
      },
    ],
  },
  {
    id: "7",
    serialNumber: "SN-B-2002",
    model: "Control Unit B",
    jobOrderId: "2",
    currentOperation: "Final inspection",
    status: "approved",
    assignedTo: "David Lee",
    startTime: "2025-01-27T08:00:00",
    completionTime: "2025-01-28T15:30:00",
    stationHistory: [
      {
        station: "Assemblage I",
        startTime: "2025-01-27T08:00:00",
        endTime: "2025-01-27T10:15:00",
        duration: 135,
      },
      {
        station: "Assemblage II",
        startTime: "2025-01-27T10:15:00",
        endTime: "2025-01-27T12:30:00",
        duration: 135,
      },
      {
        station: "Quality Assemblage I",
        startTime: "2025-01-28T08:00:00",
        endTime: "2025-01-28T13:00:00",
        duration: 300,
      },
      {
        station: "Final inspection",
        startTime: "2025-01-28T13:00:00",
        endTime: "2025-01-28T15:30:00",
        duration: 150,
      },
    ],
  },
  {
    id: "8",
    serialNumber: "SN-C-3002",
    model: "Display Panel C",
    jobOrderId: "3",
    currentOperation: "Immersion",
    status: "failed",
    assignedTo: "James Wilson",
    startTime: "2025-01-28T09:00:00",
    failureReason: "Failed waterproof test - seal integrity compromised",
    stationHistory: [
      {
        station: "Assemblage I",
        startTime: "2025-01-28T08:00:00",
        endTime: "2025-01-28T10:00:00",
        duration: 120,
      },
      {
        station: "Unit Test",
        startTime: "2025-01-28T10:30:00",
        endTime: "2025-01-28T11:15:00",
        duration: 45,
      },
      {
        station: "Immersion",
        startTime: "2025-01-28T13:00:00",
        endTime: "2025-01-28T14:00:00",
        duration: 60,
      },
    ],
  },
  {
    id: "9",
    serialNumber: "SN-F-6001",
    model: "LED Assembly F",
    jobOrderId: "6",
    currentOperation: "Quality Assemblage I",
    status: "in-progress",
    assignedTo: "David Lee",
    startTime: "2025-01-29T08:00:00",
    stationHistory: [
      {
        station: "Assemblage I",
        startTime: "2025-01-28T13:00:00",
        endTime: "2025-01-28T15:00:00",
        duration: 120,
      },
      {
        station: "Assemblage II",
        startTime: "2025-01-28T15:00:00",
        endTime: "2025-01-28T17:00:00",
        duration: 120,
      },
      {
        station: "Quality Assemblage I",
        startTime: "2025-01-29T08:00:00",
      },
    ],
  },
  {
    id: "10",
    serialNumber: "SN-A-1003",
    model: "Sensor Module A",
    jobOrderId: "1",
    currentOperation: "Packing",
    status: "approved",
    assignedTo: "Lisa Anderson",
    startTime: "2025-01-27T08:00:00",
    completionTime: "2025-01-28T16:00:00",
    stationHistory: [
      {
        station: "Assemblage I",
        startTime: "2025-01-27T08:00:00",
        endTime: "2025-01-27T09:30:00",
        duration: 90,
      },
      {
        station: "Assemblage II",
        startTime: "2025-01-27T09:30:00",
        endTime: "2025-01-27T11:00:00",
        duration: 90,
      },
      {
        station: "Final Touch - Cleaning&Packing",
        startTime: "2025-01-27T13:00:00",
        endTime: "2025-01-27T14:30:00",
        duration: 90,
      },
      {
        station: "Quality Assemblage I",
        startTime: "2025-01-28T08:00:00",
        endTime: "2025-01-28T14:00:00",
        duration: 360,
      },
      {
        station: "Packing",
        startTime: "2025-01-28T14:00:00",
        endTime: "2025-01-28T16:00:00",
        duration: 120,
      },
    ],
  },
  {
    id: "11",
    serialNumber: "SN-G-7001",
    model: "Motor Unit G",
    jobOrderId: "7",
    currentOperation: "Reticle Assy.",
    status: "failed",
    assignedTo: "Sarah Martinez",
    startTime: "2025-01-29T08:00:00",
    failureReason: "Reticle alignment out of tolerance - requires recalibration",
    stationHistory: [
      {
        station: "Assemblage I",
        startTime: "2025-01-29T08:00:00",
        endTime: "2025-01-29T10:00:00",
        duration: 120,
      },
      {
        station: "Reticle Assy.",
        startTime: "2025-01-29T10:00:00",
        endTime: "2025-01-29T11:30:00",
        duration: 90,
      },
    ],
  },
  {
    id: "12",
    serialNumber: "SN-H-8001",
    model: "Battery Pack H",
    jobOrderId: "8",
    currentOperation: "Unit Test",
    status: "in-progress",
    assignedTo: "Emily Chen",
    startTime: "2025-01-29T09:00:00",
    stationHistory: [
      {
        station: "Assemblage I",
        startTime: "2025-01-29T08:00:00",
        endTime: "2025-01-29T09:30:00",
        duration: 90,
      },
      {
        station: "Unit Test",
        startTime: "2025-01-29T09:30:00",
      },
    ],
  },
  {
    id: "13",
    serialNumber: "SN-B-2003",
    model: "Control Unit B",
    jobOrderId: "2",
    currentOperation: "Packing",
    status: "approved",
    assignedTo: "Lisa Anderson",
    startTime: "2025-01-26T08:00:00",
    completionTime: "2025-01-27T17:00:00",
    stationHistory: [
      {
        station: "Assemblage I",
        startTime: "2025-01-26T08:00:00",
        endTime: "2025-01-26T10:00:00",
        duration: 120,
      },
      {
        station: "Assemblage II",
        startTime: "2025-01-26T10:00:00",
        endTime: "2025-01-26T12:00:00",
        duration: 120,
      },
      {
        station: "Quality Assemblage I",
        startTime: "2025-01-27T08:00:00",
        endTime: "2025-01-27T14:00:00",
        duration: 360,
      },
      {
        station: "Quality Assemblage II",
        startTime: "2025-01-27T14:00:00",
        endTime: "2025-01-27T16:00:00",
        duration: 120,
      },
      {
        station: "Packing",
        startTime: "2025-01-27T16:00:00",
        endTime: "2025-01-27T17:00:00",
        duration: 60,
      },
    ],
  },
  {
    id: "14",
    serialNumber: "SN-E-5002",
    model: "Circuit Board E",
    jobOrderId: "5",
    currentOperation: "Soldering Card Blue Wire",
    status: "in-progress",
    assignedTo: "Mike Davis",
    startTime: "2025-01-29T10:00:00",
    stationHistory: [
      {
        station: "Assemblage I",
        startTime: "2025-01-29T08:00:00",
        endTime: "2025-01-29T09:45:00",
        duration: 105,
      },
      {
        station: "Soldering Card Blue Wire",
        startTime: "2025-01-29T10:00:00",
      },
    ],
  },
  {
    id: "15",
    serialNumber: "SN-D-4002",
    model: "Power Supply D",
    jobOrderId: "4",
    currentOperation: "Quality Assemblage II",
    status: "approved",
    assignedTo: "David Lee",
    startTime: "2025-01-28T08:00:00",
    completionTime: "2025-01-29T15:00:00",
    stationHistory: [
      {
        station: "Assemblage I",
        startTime: "2025-01-28T08:00:00",
        endTime: "2025-01-28T09:30:00",
        duration: 90,
      },
      {
        station: "Assemblage II",
        startTime: "2025-01-28T09:30:00",
        endTime: "2025-01-28T11:00:00",
        duration: 90,
      },
      {
        station: "Unit Test",
        startTime: "2025-01-28T13:00:00",
        endTime: "2025-01-28T14:00:00",
        duration: 60,
      },
      {
        station: "Quality Assemblage I",
        startTime: "2025-01-29T08:00:00",
        endTime: "2025-01-29T13:00:00",
        duration: 300,
      },
      {
        station: "Quality Assemblage II",
        startTime: "2025-01-29T13:00:00",
        endTime: "2025-01-29T15:00:00",
        duration: 120,
      },
    ],
  },
]

export const PRODUCTION_OPERATIONS = [
  "Assemblage I",
  "Assemblage II",
  "Assemblage II tubeless",
  "Final Touch - Cleaning&Packing",
  "Final Touch - Paint&Labeling",
  "Final Touch - Purge Vulve&Cleaning",
  "FocusA340",
  "FocusA360",
  "Lens Cleaning",
  "Objective and Doublet",
  "Nitrogen",
  "Sub-Assemblies",
  "Battery Contact Assy.",
  "Battery Cover Assy.",
  "Beam Combiner Assy.",
  "Cover Assy.",
  "Eyepiece Assy.",
  "Focus Assy.A340",
  "Focus Assy.A360",
  "Reticle Assy.",
  "Tube Assy.",
  "Troubleshooting",
  "Adaptors Installation",
  "Add Tube Spacers",
  "Adjust the Fiber Optic",
  "Adjusters",
  "Attaching Label",
  "Bushing Installation",
  "Change Battery contact",
  "Change Beam",
  "Change Eye Piece",
  "Change Power Card",
  "Change Reticle",
  "Change Reticle-Assy.II",
  "Clean the Reticle",
  "Clean Assemblage 1",
  "Clean Assemblage 2",
  "Contact Battery Installation",
  "Cover Assembly Only",
  "Cover Lacing",
  "Cover lacing and macaroon",
  "Cover Silicon",
  "Dirt on Beam-Assy.I",
  "Dirt on Beam-Assy.II",
  "Dirt on Eye Piece",
  "Dirt on Objective Lens",
  "Dirt on Tube",
  "Dirt on Tube- Air blow gun",
  "Disassemble Assemblage I",
  "Epoxy on Blue Wire",
  "ESD Line Test",
  "Eyepiece Friction",
  "Filing Doublet",
  "Focus Dirt and reassembly",
  "Focus Shaft and Hub",
  "Focus Knob",
  "Focus Movement",
  "Focus Sub-Assembly Filling",
  "Housing Cleaning",
  "Install Cover Assy.",
  "Label Printing",
  "Nitrogen Leakage",
  "Objective Lens Leakage",
  "Objective Lens Reassemblage",
  "Photoresistor Cover Installation",
  "Photoresistor Plug Replacement",
  "Power Card Installation",
  "Power Card not Working",
  "Quality tube check",
  "Reassemblage II",
  "Repaint and Device Cleaning",
  "Reticle Assembly Only",
  "Reticle Label",
  "Reticle Label and cleaning Troubeshooting",
  "Reticle Lens Cleaning",
  "Reticle Soldering",
  "Troubleshooting reticle (410)",
  "RTV",
  "Soldering Card Blue Wire",
  "Soldering Cover Assy.",
  "Soldering Tube Housing",
  "Stamp Traveller Forms",
  "Threading",
  "Tight Main Body- Focus",
  "Wire Stripping",
  "Clean beam and tube",
  "Return to Assy 1",
]

export const QUALITY_OPERATIONS = ["Quality Assemblage I", "Quality Assemblage II", "Final inspection", "Packing"]

export const TESTER_OPERATIONS = ["Adjustment", "Unit Test", "Immersion"]
