
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError('');
    setPasswordError('');
    
    // Email validation
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
    }
    
    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }
    
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-exeat-primary">Veritas University</h1>
          <h2 className="mt-1 text-xl font-semibold text-exeat-secondary">Exeat Permission System</h2>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Log in to your account</CardTitle>
            <CardDescription>
              Enter your credentials below to access the system
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@veritas.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={emailError ? 'border-red-500' : ''}
                />
                {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a 
                    href="#" 
                    className="text-xs text-exeat-secondary hover:text-exeat-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('For demo purposes, the password is "password"');
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={passwordError ? 'border-red-500' : ''}
                />
                {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
              </div>

              <div className="text-sm text-gray-500">
                <p>Demo accounts:</p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>Student: student@veritas.edu</li>
                  <li>Admin: admin@veritas.edu</li>
                  <li>Security: security@veritas.edu</li>
                </ul>
                <p className="mt-1">All accounts use password: "password"</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-exeat-primary hover:bg-exeat-primary/90" 
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Sign In'}
              </Button>
              <div className="text-sm text-center">
                Don't have an account?{' '}
                <Link to="/register" className="text-exeat-secondary hover:text-exeat-primary font-medium">
                  Register here
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
