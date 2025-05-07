
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export type UserRole = 'student' | 'admin' | 'security' | 'superadmin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole, studentId?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users for demo
const DEMO_USERS: User[] = [
  {
    id: '1',
    name: 'John Student',
    email: 'student@veritas.edu',
    role: 'student',
    studentId: 'VU123456',
    department: 'Computer Science'
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@veritas.edu',
    role: 'admin'
  },
  {
    id: '3',
    name: 'Security Officer',
    email: 'security@veritas.edu',
    role: 'security'
  },
  {
    id: '4',
    name: 'Super Admin',
    email: 'superadmin@veritas.edu',
    role: 'superadmin'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem('exeat_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user by email (demo only)
      const foundUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser && password === 'password') { // For demo, any password works as long as it's "password"
        setUser(foundUser);
        localStorage.setItem('exeat_user', JSON.stringify(foundUser));
        
        // Navigate based on role
        switch (foundUser.role) {
          case 'student':
            navigate('/student/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'security':
            navigate('/security/check');
            break;
          case 'superadmin':
            navigate('/admin/users');
            break;
          default:
            navigate('/');
        }
        
        toast.success(`Welcome back, ${foundUser.name}!`);
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole, studentId?: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if email already exists
      const existingUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        toast.error('Email already registered');
        return;
      }
      
      // Create new user (for demo)
      const newUser: User = {
        id: `demo-${Date.now()}`,
        name,
        email,
        role,
        studentId: role === 'student' ? studentId : undefined,
      };
      
      // In a real app, you would save this to a database
      DEMO_USERS.push(newUser);
      
      setUser(newUser);
      localStorage.setItem('exeat_user', JSON.stringify(newUser));
      
      toast.success('Registration successful!');
      navigate('/student/dashboard');
      
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('exeat_user');
    navigate('/login');
    toast.success('You have been logged out');
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
