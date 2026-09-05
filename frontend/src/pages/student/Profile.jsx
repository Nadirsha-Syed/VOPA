import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, BookOpen, Settings } from 'lucide-react';
import { Card } from '../../components/common/Card';
import studentService from '../../services/studentService';

export const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ storiesRead: 0, level: 'Beginner' });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const dashboard = await studentService.getDashboard();
        // progress is formatted as "X/10", extract X
        const count = parseInt(dashboard.metrics.progress.value.split('/')[0], 10) || 0;
        setStats({
          storiesRead: count,
          level: count >= 10 ? 'Advanced' : count >= 5 ? 'Intermediate' : 'Beginner'
        });
      } catch (e) {
        console.warn("Could not load stats for profile:", e);
      }
    };
    loadStats();
  }, []);

  const name = user?.name || 'Student';
  const email = user?.email || 'student@vopa.org';
  const role = user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()) : 'Student';
  const primaryLanguage = user?.preferredLanguage || 'English';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Profile Info */}
        <div className="md:col-span-2 space-y-6">
          <Card className="flex flex-col md:flex-row items-center gap-6" padding="p-8">
            <div className="w-24 h-24 bg-pastel-yellow rounded-full flex items-center justify-center flex-shrink-0">
              <User size={48} className="text-orange-500" />
            </div>
            <div className="text-center md:text-left space-y-2 flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
              <div className="flex flex-col md:flex-row gap-4 text-gray-500">
                <span className="flex items-center gap-2 justify-center md:justify-start">
                  <Mail size={18} />
                  {email}
                </span>
                <span className="flex items-center gap-2 justify-center md:justify-start">
                  <Shield size={18} />
                  {role}
                </span>
              </div>
            </div>
          </Card>

          <Card title="Learning Preferences" padding="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-bold text-gray-900">Primary Language</h4>
                  <p className="text-sm text-gray-500">The language you learn most often</p>
                </div>
                <span className="px-4 py-2 bg-pastel-blue text-blue-700 rounded-full font-medium text-sm">
                  {primaryLanguage}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-bold text-gray-900">Proficiency Level</h4>
                  <p className="text-sm text-gray-500">Calculated based on reading practice</p>
                </div>
                <span className="px-4 py-2 bg-pastel-green text-green-700 rounded-full font-medium text-sm">
                  {stats.level}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <Card padding="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-pastel-purple rounded-2xl flex items-center justify-center mx-auto">
                <BookOpen size={32} className="text-primary-dark" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-gray-900">{stats.storiesRead}</h3>
                <p className="text-gray-500 font-medium">Stories Read</p>
              </div>
            </div>
          </Card>
          
          <Card padding="p-6">
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900">Membership</h4>
              <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                <p className="text-green-800 font-medium text-sm">Active Student Account</p>
                <p className="text-green-600 text-xs mt-1">Status: Verified</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
