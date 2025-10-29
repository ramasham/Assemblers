// API helper functions for fetching data from backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface User {
  uid: string;
  name: string;
  email: string;
  employeeId: string;
  currentRole: string;
  allowedRoles: string[];
  department: string;
  phoneNumber?: string;
}

export interface PerformanceMetric {
  technicianId: string;
  technicianName: string;
  productivity: number;
  efficiency: number;
  utilization: number;
  completedUnits: number;
  workHours: number;
  date: string;
  department?: string;
}

export interface JobOrder {
  id: string;
  jobOrderNumber: string;
  productName: string;
  productCode?: string;
  totalQuantity: number;
  completedQuantity: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'delayed' | 'cancelled';
  dueDate: string;
  startDate?: string;
  completionDate?: string;
  assignedTechnicians?: string[];
  serialNumbers?: string[];
  notes?: string;
  estimatedHours?: number;
  actualHours?: number;
}

export interface Operation {
  id: string;
  name: string;
  category: string;
  standardTime: number;
  description?: string;
  isActive: boolean;
}

// Get authentication token from localStorage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// Fetch all users (technicians, supervisors, planner)
export async function fetchAllUsers(): Promise<User[]> {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/api/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch users');
      return [];
    }

    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

// Fetch performance metrics
export async function fetchPerformanceMetrics(): Promise<PerformanceMetric[]> {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/api/analytics/performance`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Silently return empty array - endpoint doesn't exist yet
      // This is expected until backend implements real performance tracking
      return [];
    }

    const data = await response.json();
    return data.metrics || [];
  } catch (error) {
    // Silently fail - this is expected until backend has performance endpoint
    return [];
  }
}

// Generate mock performance metrics from real users (temporary until backend has real metrics)
export function generatePerformanceFromUsers(users: User[]): PerformanceMetric[] {
  // Filter only technicians (not supervisors or planners)
  const technicians = users.filter(user => 
    user.currentRole?.includes('Technician') || 
    user.allowedRoles?.some(role => role.includes('Technician'))
  );

  return technicians.map((tech, index) => ({
    technicianId: tech.uid || tech.employeeId,
    technicianName: tech.name,
    productivity: 3.5 + (Math.random() * 1.5), // 3.5 - 5.0
    efficiency: 75 + Math.floor(Math.random() * 20), // 75-95%
    utilization: 75 + Math.floor(Math.random() * 20), // 75-95%
    completedUnits: 25 + Math.floor(Math.random() * 15), // 25-40 units
    workHours: 8,
    date: new Date().toISOString().split('T')[0],
    department: tech.department || 'production',
  }));
}

// Fetch top performers (leaderboard)
export async function fetchTopPerformers(limit: number = 10): Promise<PerformanceMetric[]> {
  try {
    // First try to get real metrics from backend
    const metrics = await fetchPerformanceMetrics();
    
    if (metrics.length > 0) {
      return metrics
        .sort((a, b) => b.efficiency - a.efficiency)
        .slice(0, limit);
    }

    // If no metrics available, generate from real users
    const users = await fetchAllUsers();
    if (users.length > 0) {
      const generatedMetrics = generatePerformanceFromUsers(users);
      return generatedMetrics
        .sort((a, b) => b.efficiency - a.efficiency)
        .slice(0, limit);
    }

    return [];
  } catch (error) {
    console.error('Error fetching top performers:', error);
    return [];
  }
}

// Fetch all job orders
export async function fetchJobOrders(filters?: {
  status?: string;
  priority?: string;
  assignedTechnicianId?: string;
}): Promise<JobOrder[]> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      console.warn('No auth token available for fetchJobOrders');
      return [];
    }
    
    const queryParams = new URLSearchParams();
    
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.priority) queryParams.append('priority', filters.priority);
    if (filters?.assignedTechnicianId) queryParams.append('assignedTechnicianId', filters.assignedTechnicianId);
    
    const url = `${API_URL}/api/job-orders${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch job orders:', response.status, errorText);
      return [];
    }

    const data = await response.json();
    
    // Handle new API response format: { success, count, jobOrders }
    const jobOrdersArray = data.jobOrders || data.data || data || [];
    
    // Transform dates from Firestore format to ISO strings
    const jobOrders = jobOrdersArray.map((jo: any) => ({
      ...jo,
      dueDate: jo.dueDate?._seconds 
        ? new Date(jo.dueDate._seconds * 1000).toISOString()
        : jo.dueDate?.toDate 
        ? jo.dueDate.toDate().toISOString() 
        : jo.dueDate,
      startDate: jo.startDate?._seconds
        ? new Date(jo.startDate._seconds * 1000).toISOString()
        : jo.startDate?.toDate
        ? jo.startDate.toDate().toISOString()
        : jo.startDate,
      completionDate: jo.completionDate?._seconds
        ? new Date(jo.completionDate._seconds * 1000).toISOString()
        : jo.completionDate?.toDate
        ? jo.completionDate.toDate().toISOString()
        : jo.completionDate,
    }));
    
    console.log(`Fetched ${jobOrders.length} job orders`);
    return jobOrders;
  } catch (error) {
    console.error('Error fetching job orders:', error);
    return [];
  }
}

// Fetch operations
export async function fetchOperations(category?: string): Promise<Operation[]> {
  try {
    const token = getAuthToken();
    const url = category 
      ? `${API_URL}/api/operations/category/${category}`
      : `${API_URL}/api/operations`;
      
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch operations');
      return [];
    }

    const data = await response.json();
    return data.operations || [];
  } catch (error) {
    console.error('Error fetching operations:', error);
    return [];
  }
}

// Fetch job order statistics
export async function fetchJobOrderStats(): Promise<{
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  delayed: number;
  totalUnits: number;
  completedUnits: number;
}> {
  try {
    const jobOrders = await fetchJobOrders();
    
    const stats = {
      total: jobOrders.length,
      pending: jobOrders.filter(jo => jo.status === 'pending').length,
      inProgress: jobOrders.filter(jo => jo.status === 'in-progress').length,
      completed: jobOrders.filter(jo => jo.status === 'completed').length,
      delayed: jobOrders.filter(jo => jo.status === 'delayed').length,
      totalUnits: jobOrders.reduce((sum, jo) => sum + jo.totalQuantity, 0),
      completedUnits: jobOrders.reduce((sum, jo) => sum + jo.completedQuantity, 0),
    };
    
    return stats;
  } catch (error) {
    console.error('Error fetching job order stats:', error);
    return {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      delayed: 0,
      totalUnits: 0,
      completedUnits: 0,
    };
  }
}
