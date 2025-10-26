import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.simple';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login.simple';
import Dashboard from './pages/Dashboard';
import './index.css';

// Placeholder components for other pages
const JobOrders = () => <div className="p-6"><h1 className="text-3xl font-bold">Job Orders</h1><p className="text-muted-foreground mt-2">Job orders management coming soon...</p></div>;
const Tasks = () => <div className="p-6"><h1 className="text-3xl font-bold">Tasks</h1><p className="text-muted-foreground mt-2">Task management coming soon...</p></div>;
const Alerts = () => <div className="p-6"><h1 className="text-3xl font-bold">Alerts</h1><p className="text-muted-foreground mt-2">Alerts and notifications coming soon...</p></div>;
const Technicians = () => <div className="p-6"><h1 className="text-3xl font-bold">Technicians</h1><p className="text-muted-foreground mt-2">Technician management coming soon...</p></div>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/job-orders" element={
            <ProtectedRoute>
              <Layout>
                <JobOrders />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/tasks" element={
            <ProtectedRoute>
              <Layout>
                <Tasks />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/alerts" element={
            <ProtectedRoute>
              <Layout>
                <Alerts />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/technicians" element={
            <ProtectedRoute allowedRoles={['supervisor', 'planner', 'admin']}>
              <Layout>
                <Technicians />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
