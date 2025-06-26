
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  const getDashboardLink = () => {
    if (!user) return '/login';
    
    switch(user.role) {
      case 'student':
        return '/student/dashboard';
      case 'admin':
      case 'superadmin':
        return '/admin/dashboard';
      case 'security':
        return '/security/check';
      default:
        return '/login';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-exeat-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-exeat-primary">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold">Veritas</span>
              <span className="text-sm block -mt-1 font-light">Exeat System</span>
            </div>
          </div>
          
          <div>
            {isAuthenticated ? (
              <Link to={getDashboardLink()}>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-exeat-primary">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-exeat-primary">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-white text-exeat-primary hover:bg-white/90">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-exeat-primary/90 to-exeat-primary text-white py-20 flex-grow flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Veritas University Exeat System
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Secure and efficient campus exit permission management for students and staff
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to={isAuthenticated ? getDashboardLink() : '/login'}>
                <Button size="lg" className="bg-white text-exeat-primary hover:bg-white/90 px-8 py-4 text-lg">
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/register">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-exeat-primary px-8 py-4 text-lg">
                    Register Now
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Key Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our System?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-exeat-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-exeat-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure</h3>
                <p className="text-gray-600">Multi-level approval with QR verification</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-exeat-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-exeat-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast</h3>
                <p className="text-gray-600">Quick approval and instant notifications</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-exeat-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-exeat-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Mobile Ready</h3>
                <p className="text-gray-600">Access anywhere, anytime on any device</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-exeat-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-white/90 mb-8">
              Join the secure exeat permission system today
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/login">
                <Button size="lg" className="bg-white text-exeat-primary hover:bg-white/90 px-8 py-4">
                  Log In Now
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-exeat-primary px-8 py-4">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <span className="text-base font-bold text-white">Veritas Exeat System</span>
              </div>
            </div>
            
            <div className="text-sm text-center">
              <p>&copy; {new Date().getFullYear()} Veritas University. All rights reserved.</p>
            </div>
            
            <div className="flex space-x-6 text-sm mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Support</a>
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
