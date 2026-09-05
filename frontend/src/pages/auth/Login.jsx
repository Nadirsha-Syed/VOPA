import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { PasswordInput } from '../../components/common/PasswordInput';
import { Button } from '../../components/common/Button';
import { AuthLayout } from '../../layouts/AuthLayout';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    if (validate()) {
      setIsLoading(true);
      try {
        const user = await login(email, password);
        if (user.role === 'STUDENT') {
          navigate('/student/dashboard');
        } else {
          navigate('/unauthorized'); // I only own student experience
        }
      } catch (err) {
        setAuthError(err.message || 'Failed to sign in. Please check your credentials.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <AuthLayout>
      <Card className="px-4 py-8 sm:px-10 border-t-4 border-t-primary">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
          <p className="text-sm text-gray-600 mt-2">Sign in to continue your learning journey</p>
        </div>

        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            disabled={isLoading}
          />
          
          <div className="space-y-1">
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              disabled={isLoading}
            />
            <div className="flex justify-end">
              <a href="#" className="text-sm font-medium text-primary hover:text-primary-dark">
                Forgot password?
              </a>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full mt-2" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
            Sign up
          </Link>
        </div>
      </Card>
    </AuthLayout>
  );
};
