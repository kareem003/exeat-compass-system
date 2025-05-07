
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { ExeatService, ExeatRequest } from '@/services/ExeatService';
import ExeatStatusBadge from '@/components/ExeatStatusBadge';
import { CalendarIcon, ChevronRight, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exeatRequests, setExeatRequests] = useState<ExeatRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExeats = async () => {
      if (user?.studentId) {
        setIsLoading(true);
        try {
          const requests = await ExeatService.getStudentRequests(user.studentId);
          setExeatRequests(requests);
        } catch (error) {
          console.error('Error fetching exeat requests:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    fetchExeats();
  }, [user]);

  // Filter requests by status
  const pendingRequests = exeatRequests.filter(req => req.status === 'pending');
  const approvedRequests = exeatRequests.filter(req => req.status === 'approved');
  const rejectedRequests = exeatRequests.filter(req => req.status === 'rejected');

  const formatDate = (date: Date) => {
    return format(date, 'MMM dd, yyyy');
  };

  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome, {user?.name}</h1>
            <p className="text-muted-foreground">{user?.studentId} - Student Dashboard</p>
          </div>
          <Button 
            className="mt-4 md:mt-0 bg-exeat-secondary hover:bg-exeat-secondary/90"
            onClick={() => navigate('/student/new-request')}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> New Exeat Request
          </Button>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedRequests.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rejected Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedRequests.length}</div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">Loading requests...</div>
              ) : exeatRequests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You haven't made any exeat requests yet.</p>
                  <Button 
                    className="mt-4 bg-exeat-secondary hover:bg-exeat-secondary/90"
                    onClick={() => navigate('/student/new-request')}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Create your first request
                  </Button>
                </div>
              ) : (
                exeatRequests.map(request => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardHeader className="pb-3 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{request.reason}</div>
                        <ExeatStatusBadge status={request.status} />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid gap-2">
                        <div className="flex items-center text-sm">
                          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(request.departureDate)} {formatTime(request.departureDate)} - {formatDate(request.returnDate)} {formatTime(request.returnDate)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{request.reasonDetails}</p>
                        {request.comments && (
                          <div className="mt-2 p-2 bg-muted/60 rounded-md text-sm">
                            <p className="font-medium">Comments:</p>
                            <p className="text-muted-foreground">{request.comments}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-gray-50/50 py-2 px-6">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-auto text-xs" 
                        onClick={() => navigate(`/student/request/${request.id}`)}
                      >
                        View Details <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-4">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You don't have any pending requests.</p>
                </div>
              ) : (
                pendingRequests.map(request => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardHeader className="pb-3 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{request.reason}</div>
                        <ExeatStatusBadge status={request.status} />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid gap-2">
                        <div className="flex items-center text-sm">
                          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(request.departureDate)} {formatTime(request.departureDate)} - {formatDate(request.returnDate)} {formatTime(request.returnDate)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{request.reasonDetails}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-gray-50/50 py-2 px-6">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-auto text-xs" 
                        onClick={() => navigate(`/student/request/${request.id}`)}
                      >
                        View Details <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="approved" className="space-y-4">
              {approvedRequests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You don't have any approved requests.</p>
                </div>
              ) : (
                approvedRequests.map(request => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardHeader className="pb-3 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{request.reason}</div>
                        <ExeatStatusBadge status={request.status} />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid gap-2">
                        <div className="flex items-center text-sm">
                          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(request.departureDate)} {formatTime(request.departureDate)} - {formatDate(request.returnDate)} {formatTime(request.returnDate)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{request.reasonDetails}</p>
                        {request.comments && (
                          <div className="mt-2 p-2 bg-muted/60 rounded-md text-sm">
                            <p className="font-medium">Comments:</p>
                            <p className="text-muted-foreground">{request.comments}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-gray-50/50 py-2 px-6">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-auto text-xs" 
                        onClick={() => navigate(`/student/request/${request.id}`)}
                      >
                        View Details <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="rejected" className="space-y-4">
              {rejectedRequests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You don't have any rejected requests.</p>
                </div>
              ) : (
                rejectedRequests.map(request => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardHeader className="pb-3 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{request.reason}</div>
                        <ExeatStatusBadge status={request.status} />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid gap-2">
                        <div className="flex items-center text-sm">
                          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(request.departureDate)} {formatTime(request.departureDate)} - {formatDate(request.returnDate)} {formatTime(request.returnDate)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{request.reasonDetails}</p>
                        {request.comments && (
                          <div className="mt-2 p-2 bg-muted/60 rounded-md text-sm">
                            <p className="font-medium">Comments:</p>
                            <p className="text-muted-foreground">{request.comments}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-gray-50/50 py-2 px-6">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-auto text-xs" 
                        onClick={() => navigate(`/student/request/${request.id}`)}
                      >
                        View Details <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;
