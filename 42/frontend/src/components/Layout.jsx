import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.simple';
import { Button } from './ui/button';
import { 
  LayoutDashboard, 
  ClipboardList, 
  CheckSquare, 
  Bell, 
  Users, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['technician', 'supervisor', 'planner', 'admin'] },
    { name: 'Job Orders', href: '/job-orders', icon: ClipboardList, roles: ['technician', 'supervisor', 'planner', 'admin'] },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare, roles: ['technician', 'supervisor', 'planner', 'admin'] },
    { name: 'Alerts', href: '/alerts', icon: Bell, roles: ['technician', 'supervisor', 'planner', 'admin'] },
    { name: 'Technicians', href: '/technicians', icon: Users, roles: ['supervisor', 'planner', 'admin'] },
  ];

  const filteredNavigation = navigation.filter(item => item.roles.includes(currentUser?.role));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-30 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <ClipboardList className="h-8 w-8 text-primary" />
              <span className="font-bold text-lg">Task Manager</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User info */}
          <div className="p-4 border-b bg-gray-50">
            <p className="font-medium text-sm">{currentUser?.name}</p>
            <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
            <p className="text-xs text-primary mt-1 capitalize">{currentUser?.role}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            <span className="font-bold">Task Manager</span>
          </div>
          <div className="w-6" />
        </header>

        {/* Page content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
