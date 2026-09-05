import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Topbar = ({ onOpenSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden text-gray-500 hover:text-gray-700"
          onClick={onOpenSidebar}
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-gray-600 relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
          <img 
            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=D1F2D9&color=2E8C5C`} 
            alt="Profile avatar" 
            className="w-8 h-8 rounded-full border border-gray-200"
          />
          <div className="hidden sm:block text-sm font-medium text-gray-700">
            {user?.name || 'Student'}
          </div>
        </div>
      </div>
    </header>
  );
};
