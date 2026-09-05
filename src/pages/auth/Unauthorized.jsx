import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { AuthLayout } from '../../layouts/AuthLayout';
import { useAuth } from '../../context/AuthContext';

export const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoHome = () => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'STUDENT') {
      navigate('/student/dashboard');
    } else if (user.role === 'TEACHER') {
      navigate('/teacher/dashboard'); // For the other dev
    } else if (user.role === 'ADMIN') {
      navigate('/admin/dashboard'); // For the other dev
    } else {
      navigate('/login');
    }
  };

  return (
    <AuthLayout>
      <Card className="px-4 py-12 sm:px-10 text-center border-t-4 border-t-orange-400">
        <div className="flex justify-center mb-6">
          <div className="bg-pastel-purple p-4 rounded-full">
            <Lock className="w-12 h-12 text-primary-dark" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        
        <p className="text-sm text-gray-600 mb-8">
          You don't have permission to access this page. 
          If you believe this is a mistake, please contact your administrator.
        </p>
        
        <Button onClick={handleGoHome} className="w-full">
          Go to Home
        </Button>
      </Card>
    </AuthLayout>
  );
};
