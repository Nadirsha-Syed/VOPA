import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlayCircle, TrendingUp, Globe, User, X } from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Home', path: '/student/dashboard', icon: Home },
  { name: 'Practice', path: '/student/exercises/current', icon: PlayCircle },
  { name: 'Progress', path: '/student/progress', icon: TrendingUp },
  { name: 'Languages', path: '/student/languages', icon: Globe },
  { name: 'Profile', path: '#', icon: User },
];

export const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 shadow-sm
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
            <div className="text-2xl font-extrabold text-primary flex items-center gap-1 tracking-tight">
              <span className="text-blue-600">V</span>
              <span className="text-orange-500">O</span>
              <span className="text-primary">P</span>
              <span className="text-yellow-500">A</span>
            </div>
            <button 
              className="lg:hidden text-gray-400 hover:text-gray-600"
              onClick={onClose}
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors
                    ${isActive 
                      ? 'bg-pastel-purple text-primary-dark shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon size={20} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer Area */}
          <div className="p-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              "Every Voice Learns. Every Child Belongs."
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
