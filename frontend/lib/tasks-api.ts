// API helper functions for tasks

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Get authentication token from localStorage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export interface Task {
  id: string;
  jobOrderId: string;
  jobOrderNumber: string;
  productName: string;
  operationId: string;
  operationName: string;
  category: string;
  quantity: number;
  standardTime: number;
  estimatedHours: number;
  actualTime: number;
  completedUnits: number;
  assignedTo: string | null;
  assignedToName: string;
  assignedToEmail: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'submitted' | 'approved' | 'rejected' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  serialNumbers: string[];
  notes: string;
  feedback: string;
  createdBy: string;
  createdByName: string;
  department: string;
  assignedAt?: any;
  startedAt?: any;
  submittedAt?: any;
  approvedAt?: any;
  rejectedAt?: any;
  completedAt?: any;
  approvedBy?: string;
  rejectedBy?: string;
  createdAt?: any;
  updatedAt?: any;
}

// Fetch tasks with filters
export async function fetchTasks(filters?: {
  status?: string;
  assignedTo?: string;
  jobOrderId?: string;
  department?: string;
}): Promise<Task[]> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      console.warn('No auth token available for fetchTasks');
      return [];
    }
    
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.assignedTo) queryParams.append('assignedTo', filters.assignedTo);
    if (filters?.jobOrderId) queryParams.append('jobOrderId', filters.jobOrderId);
    if (filters?.department) queryParams.append('department', filters.department);
    
    const url = `${API_URL}/api/tasks${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch tasks:', response.status, errorText);
      return [];
    }

    const data = await response.json();
    const tasksArray = data.tasks || data.data || data || [];
    
    console.log(`Fetched ${tasksArray.length} tasks`);
    return tasksArray;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

// Create a new task
export async function createTask(taskData: Partial<Task>): Promise<Task | null> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      console.error('No auth token available');
      return null;
    }
    
    const response = await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to create task:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    return data.task;
  } catch (error) {
    console.error('Error creating task:', error);
    return null;
  }
}

// Assign task to technician
export async function assignTask(taskId: string, technicianId: string, technicianName?: string, technicianEmail?: string): Promise<boolean> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      console.error('No auth token available');
      return false;
    }
    
    const response = await fetch(`${API_URL}/api/tasks/${taskId}/assign`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ technicianId, technicianName, technicianEmail }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to assign task:', response.status, errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error assigning task:', error);
    return false;
  }
}

// Submit task for review
export async function submitTask(taskId: string, submissionData: {
  actualTime: number;
  completedUnits: number;
  serialNumbers?: string[];
  notes?: string;
}): Promise<boolean> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      console.error('No auth token available');
      return false;
    }
    
    const response = await fetch(`${API_URL}/api/tasks/${taskId}/submit`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to submit task:', response.status, errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error submitting task:', error);
    return false;
  }
}

// Approve task
export async function approveTask(taskId: string, feedback?: string): Promise<boolean> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      console.error('No auth token available');
      return false;
    }
    
    const response = await fetch(`${API_URL}/api/tasks/${taskId}/approve`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ feedback }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to approve task:', response.status, errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error approving task:', error);
    return false;
  }
}

// Reject task
export async function rejectTask(taskId: string, reason: string): Promise<boolean> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      console.error('No auth token available');
      return false;
    }
    
    const response = await fetch(`${API_URL}/api/tasks/${taskId}/reject`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to reject task:', response.status, errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error rejecting task:', error);
    return false;
  }
}

// Start work on task
export async function startTask(taskId: string): Promise<boolean> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      console.error('No auth token available');
      return false;
    }
    
    const response = await fetch(`${API_URL}/api/tasks/${taskId}/start`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to start task:', response.status, errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error starting task:', error);
    return false;
  }
}
