import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FileText,
  Stethoscope,
  Syringe,
  MessageSquare,
  Bell,
  ShieldAlert,
  LogOut,
  Leaf,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, title: 'My Farms', roles: ['Farmer', 'Extension Worker', 'Branch Coordinator', 'Expert'] },
  { to: '/profile', icon: User, title: 'Profile', roles: ['all'] },
  { to: '/reports', icon: FileText, title: 'Reports', roles: ['all'] },
  { to: '/diagnosis', icon: Stethoscope, title: 'Diagnosis', roles: ['Extension Worker', 'Branch Coordinator'] },
  { to: '/treatment', icon: Syringe, title: 'Final Diagnosis', roles: ['Branch Coordinator'] },
  { to: '/clinic', icon: MessageSquare, title: 'Online Clinic', roles: ['Expert'] },
  { to: '/notifications', icon: Bell, title: 'Notifications', roles: ['all'] },
  { to: '/admin', icon: ShieldAlert, title: 'Admin Dashboard', roles: ['Administrator'] },
];

const NavLink = ({ to, title, icon: Icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      title={title}
      className={`p-2 rounded-lg hover:bg-green-700 ${isActive ? 'bg-green-700' : ''}`}
    >
      <Icon className="w-6 h-6" />
    </Link>
  );
};

const Layout = ({ children }) => {
  // In a real app, the user's role would come from context
  const userRole = 'Farmer'; // Placeholder

  const handleLogout = () => {
    // Firebase logout logic will go here
    console.log('Logout');
  };

  const filteredNavItems = navItems.filter(item =>
    item.roles.includes('all') || item.roles.includes(userRole)
  );

  return (
    <div className="flex h-screen bg-green-50">
      <aside className="w-16 bg-green-800 text-white p-4 flex flex-col items-center">
        <div className="mb-10">
          <Leaf className="w-8 h-8 text-green-400" />
        </div>
        <nav className="flex-1 flex flex-col items-center space-y-4">
          {filteredNavItems.map(item => (
            <NavLink key={item.to} to={item.to} title={item.title} icon={item.icon} />
          ))}
        </nav>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-700"
            title="Logout"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </aside>
      <main className="flex-1 h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
