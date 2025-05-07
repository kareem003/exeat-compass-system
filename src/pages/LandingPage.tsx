
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
      <section className="bg-gradient-to-b from-exeat-primary/90 to-exeat-primary/100 text-white py-16 md:py-24 flex-grow">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Veritas University Exeat Permission System
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-md">
                A secure and efficient system for managing student exit permissions from campus
              </p>
              <div className="pt-6">
                <Link to={isAuthenticated ? getDashboardLink() : '/login'}>
                  <Button size="lg" className="bg-white text-exeat-primary hover:bg-white/90 mr-4">
                    {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-exeat-primary">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-white/20 max-w-md mx-auto">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-12 bg-white/20 rounded-md"></div>
                    <div className="h-32 bg-white/20 rounded-md"></div>
                    <div className="flex space-x-2">
                      <div className="h-10 bg-white/20 rounded-md w-1/2"></div>
                      <div className="h-10 bg-exeat-secondary/70 rounded-md w-1/2"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-exeat-secondary/30 rounded-full blur-2xl -z-10"></div>
                <div className="absolute -top-6 -left-6 w-40 h-40 bg-exeat-accent/20 rounded-full blur-2xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-exeat-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-exeat-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Permissions</h3>
              <p className="text-gray-600">Multi-level approval process ensures proper authorization for campus exits.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-exeat-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-exeat-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Mobile Friendly</h3>
              <p className="text-gray-600">Access the system on any device, perfect for students and security on the go.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-exeat-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-exeat-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">QR Code Exit Pass</h3>
              <p className="text-gray-600">Digital exit passes with QR verification for easy and secure campus gate checking.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Our system streamlines the exeat application and approval process
          </p>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-exeat-secondary/10 text-exeat-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-semibold mb-2">Student Request</h3>
              <p className="text-sm text-gray-600">Students submit exeat requests with required details</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-exeat-secondary/10 text-exeat-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-semibold mb-2">Admin Review</h3>
              <p className="text-sm text-gray-600">Staff reviews and approves or denies the request</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-exeat-secondary/10 text-exeat-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-semibold mb-2">QR Code Generated</h3>
              <p className="text-sm text-gray-600">Approved requests receive a secure QR code pass</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-exeat-secondary/10 text-exeat-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="font-semibold mb-2">Security Verification</h3>
              <p className="text-sm text-gray-600">Security scans QR at exit/entry points</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-exeat-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-white/90">
            Join Veritas University's secure and efficient exeat permission system today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="bg-white text-exeat-primary hover:bg-white/90">
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-exeat-primary">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <span className="text-base font-bold text-white">Veritas</span>
                  <span className="text-xs block -mt-1 font-light">Exeat System</span>
                </div>
              </div>
              <p className="text-sm text-gray-400">A secure and efficient system for managing student exit permissions from campus.</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-white uppercase tracking-wider mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-white uppercase tracking-wider mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">User Guides</a></li>
                <li><a href="#" className="hover:text-white">FAQs</a></li>
                <li><a href="#" className="hover:text-white">System Status</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-white uppercase tracking-wider mb-4">Contact Us</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@exeat.veritas.edu</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+234 (0) 123 456 7890</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Veritas University, Abuja, Nigeria</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Veritas University Exeat System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
