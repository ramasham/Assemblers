import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.simple';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Users,
  TrendingUp,
  Activity
} from 'lucide-react';
import api from '../config/api.simple';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [overview, setOverview] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (currentUser.role === 'technician') {
        // Technician view
        const perfResponse = await api.get('/analytics/my-performance?period=7days');
        setPerformance(perfResponse.data.data);
      } else {
        // Supervisor/Planner/Admin view
        const [overviewRes, perfRes, trendsRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/technician-performance?period=7days'),
          api.get('/analytics/productivity-trends?days=7')
        ]);
        
        setOverview(overviewRes.data.data);
        setPerformance(perfRes.data.data || []);
        setTrends(trendsRes.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Technician Dashboard
  if (currentUser.role === 'technician') {
    const { summary, dailyBreakdown } = performance || {};
    
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {currentUser.name}!</h1>
          <p className="text-muted-foreground">Here's your performance overview for the past 7 days</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.totalTasks || 0}</div>
              <p className="text-xs text-muted-foreground">Completed this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Units Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.totalUnits || 0}</div>
              <p className="text-xs text-muted-foreground">Total units assembled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Productivity</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.avgProductivity || 0}</div>
              <p className="text-xs text-muted-foreground">Units per hour</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.totalHours || 0}</div>
              <p className="text-xs text-muted-foreground">Hours worked</p>
            </CardContent>
          </Card>
        </div>

        {dailyBreakdown && dailyBreakdown.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Daily Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="units" fill="#3b82f6" name="Units Completed" />
                  <Bar dataKey="tasks" fill="#10b981" name="Tasks" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Supervisor/Planner/Admin Dashboard
  const jobOrderData = overview?.jobOrders ? [
    { name: 'Pending', value: overview.jobOrders.pending },
    { name: 'In Progress', value: overview.jobOrders.inProgress },
    { name: 'Completed', value: overview.jobOrders.completed },
    { name: 'Delayed', value: overview.jobOrders.delayed },
  ] : [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Monitor production line performance and job orders</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Job Orders</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.jobOrders?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {overview?.jobOrders?.inProgress || 0} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Technicians</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.technicians?.active || 0}</div>
            <p className="text-xs text-muted-foreground">
              of {overview?.technicians?.total || 0} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.tasks?.todayCompleted || 0}</div>
            <p className="text-xs text-muted-foreground">
              of {overview?.tasks?.today || 0} total
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overview?.alerts?.critical || 0}</div>
            <p className="text-xs text-muted-foreground">
              {overview?.alerts?.unread || 0} unread
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Job Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={jobOrderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {jobOrderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {trends && trends.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Productivity Trends (7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="totalUnits" stroke="#3b82f6" name="Total Units" />
                  <Line type="monotone" dataKey="avgProductivity" stroke="#10b981" name="Avg Productivity" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {performance && performance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Technicians (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performance.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalUnits" fill="#3b82f6" name="Total Units" />
                <Bar dataKey="avgProductivity" fill="#10b981" name="Avg Productivity" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
