
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { ExeatService, ExeatRequest } from '@/services/ExeatService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, Clock, User } from 'lucide-react';
import ExeatStatusBadge from '@/components/ExeatStatusBadge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import QRCode from 'qrcode.react';

const RequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [request, setRequest] = useState<ExeatRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchRequest = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await ExeatService.getRequestById(id);
        setRequest(data);
      } catch (error) {
        console.error('Error fetching request:', error);
        toast.error('Failed to load request details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRequest();
  }, [id]);
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-exeat-primary mx-auto mb-4"></div>
            <p>Loading request details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!request) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/student/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Request Not Found</h1>
          </div>
          <p>The requested exeat permission could not be found.</p>
          <Button onClick={() => navigate('/student/dashboard')}>Return to Dashboard</Button>
        </div>
      </MainLayout>
    );
  }
  
  const formatDate = (date: Date) => {
    return format(date, 'PPP');
  };
  
  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/student/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Exeat Request Details</h1>
            <p className="text-muted-foreground">View your request information</p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Request Information</CardTitle>
                  <ExeatStatusBadge status={request.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-3">
                  <div className="flex items-start">
                    <User className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Student Information</p>
                      <p className="text-sm text-muted-foreground">{request.studentName} ({request.studentId})</p>
                      {request.department && (
                        <p className="text-sm text-muted-foreground">{request.department}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Destination</p>
                      <p className="text-sm text-muted-foreground">{request.destination}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Duration</p>
                      <div className="text-sm text-muted-foreground">
                        <p>Departure: {formatDate(request.departureDate)} at {formatTime(request.departureDate)}</p>
                        <p>Return: {formatDate(request.returnDate)} at {formatTime(request.returnDate)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Submitted on</p>
                      <p className="text-sm text-muted-foreground">{formatDate(request.createdAt)} at {formatTime(request.createdAt)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-2">Reason for Leave</h3>
                  <p className="mb-1 font-medium">{request.reason}</p>
                  <p className="text-muted-foreground">{request.reasonDetails}</p>
                </div>
                
                {request.comments && (
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-semibold mb-2">Admin Comments</h3>
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="text-muted-foreground">{request.comments}</p>
                    </div>
                    {request.reviewedBy && request.reviewedAt && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        <p>Reviewed by {request.reviewedBy} on {formatDate(request.reviewedAt)} at {formatTime(request.reviewedAt)}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {request.status === 'approved' && (
              <Card>
                <CardHeader>
                  <CardTitle>Exeat Pass</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="bg-white p-4 rounded-md inline-block mb-4 border">
                    <QRCode 
                      value={request.qrCode || request.id} 
                      size={180}
                      level="H"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Show this QR code to security at the campus exit gate</p>
                  <Button className="w-full">Download Pass</Button>
                </CardContent>
              </Card>
            )}
            
            {request.status === 'pending' && (
              <Card>
                <CardHeader>
                  <CardTitle>Request Status</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 mb-2">
                      <Clock className="h-8 w-8" />
                    </div>
                    <h3 className="font-medium">Awaiting Approval</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your request is being reviewed by the administration.
                    You will be notified once a decision has been made.
                  </p>
                </CardContent>
              </Card>
            )}
            
            {request.status === 'rejected' && (
              <Card>
                <CardHeader>
                  <CardTitle>Request Status</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </div>
                    <h3 className="font-medium">Request Denied</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your request has been denied. Please check the admin comments for more information.
                  </p>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => navigate('/student/dashboard')}
                >
                  Back to Dashboard
                </Button>
                
                {request.status === 'rejected' && (
                  <Button 
                    className="w-full bg-exeat-secondary hover:bg-exeat-secondary/90" 
                    onClick={() => navigate('/student/new-request')}
                  >
                    Create New Request
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RequestDetailsPage;
