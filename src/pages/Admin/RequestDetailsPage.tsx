
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { ExeatService, ExeatRequest, ExeatStatus } from '@/services/ExeatService';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calendar, MapPin, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import ExeatStatusBadge from '@/components/ExeatStatusBadge';
import { format } from 'date-fns';
import { toast } from 'sonner';

const AdminRequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [request, setRequest] = useState<ExeatRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const fetchRequest = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await ExeatService.getRequestById(id);
        setRequest(data);
        // Pre-fill comment if it exists
        if (data?.comments) {
          setComment(data.comments);
        }
      } catch (error) {
        console.error('Error fetching request:', error);
        toast.error('Failed to load request details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRequest();
  }, [id]);
  
  const handleApprove = async () => {
    if (!request || !user) return;
    
    setIsProcessing(true);
    try {
      const updatedRequest = await ExeatService.updateRequestStatus(
        request.id,
        'approved',
        user.name,
        comment
      );
      
      setRequest(updatedRequest);
      toast.success('Request approved successfully');
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleReject = async () => {
    if (!request || !user) return;
    
    if (!comment.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    
    setIsProcessing(true);
    try {
      const updatedRequest = await ExeatService.updateRequestStatus(
        request.id,
        'rejected',
        user.name,
        comment
      );
      
      setRequest(updatedRequest);
      toast.success('Request rejected');
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    } finally {
      setIsProcessing(false);
    }
  };
  
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
              onClick={() => navigate('/admin/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Request Not Found</h1>
          </div>
          <p>The requested exeat permission could not be found.</p>
          <Button onClick={() => navigate('/admin/dashboard')}>Return to Dashboard</Button>
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
            onClick={() => navigate('/admin/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Exeat Request Details</h1>
            <p className="text-muted-foreground">Review request #{request.id}</p>
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
              </CardContent>
            </Card>
            
            {/* Review Section */}
            {request.status === 'pending' && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Request</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="comment">Admin Comments</Label>
                      <Textarea
                        id="comment"
                        placeholder="Add any comments, instructions, or reasons for approval/rejection"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-6">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/admin/dashboard')}
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={isProcessing || !comment.trim()}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      {isProcessing ? 'Processing...' : 'Reject Request'}
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleApprove}
                      disabled={isProcessing}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {isProcessing ? 'Processing...' : 'Approve Request'}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )}
            
            {/* Review History */}
            {(request.status === 'approved' || request.status === 'rejected') && (
              <Card>
                <CardHeader>
                  <CardTitle>Review History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Status</p>
                      <div className="mt-1">
                        <ExeatStatusBadge status={request.status} />
                      </div>
                    </div>
                    
                    {request.comments && (
                      <div>
                        <p className="font-medium">Comments</p>
                        <p className="text-muted-foreground mt-1">{request.comments}</p>
                      </div>
                    )}
                    
                    {request.reviewedBy && request.reviewedAt && (
                      <div>
                        <p className="font-medium">Reviewed by</p>
                        <p className="text-muted-foreground mt-1">
                          {request.reviewedBy} on {formatDate(request.reviewedAt)} at {formatTime(request.reviewedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => navigate('/admin/dashboard')}
                >
                  Back to Dashboard
                </Button>
                
                {request.status !== 'pending' && (
                  <Button 
                    className="w-full"
                    onClick={() => {
                      // Re-open the request (set to pending)
                      setIsProcessing(true);
                      
                      ExeatService.updateRequestStatus(
                        request.id,
                        'pending',
                        user?.name || 'Admin',
                        'Request reopened for review'
                      )
                        .then((updatedRequest) => {
                          setRequest(updatedRequest);
                          toast.success('Request reopened for review');
                        })
                        .catch((error) => {
                          console.error('Error reopening request:', error);
                          toast.error('Failed to reopen request');
                        })
                        .finally(() => {
                          setIsProcessing(false);
                        });
                    }}
                    disabled={isProcessing}
                  >
                    Reopen Request
                  </Button>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">{request.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Student ID</p>
                    <p className="text-sm text-muted-foreground">{request.studentId}</p>
                  </div>
                  {request.department && (
                    <div>
                      <p className="text-sm font-medium">Department</p>
                      <p className="text-sm text-muted-foreground">{request.department}</p>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                  >
                    View Student Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminRequestDetailsPage;
