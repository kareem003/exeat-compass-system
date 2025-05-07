
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { ExeatService, ExeatRequest, ExeatStatus } from '@/services/ExeatService';
import ExeatStatusBadge from '@/components/ExeatStatusBadge';
import { Search, CheckCircle, XCircle, Info, CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [requests, setRequests] = useState<ExeatRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ExeatRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Request action states
  const [selectedRequest, setSelectedRequest] = useState<ExeatRequest | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [actionComment, setActionComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const data = await ExeatService.getAllRequests();
        setRequests(data);
        setFilteredRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast.error('Failed to load exeat requests');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRequests();
  }, []);
  
  useEffect(() => {
    // Apply filters
    let filtered = [...requests];
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req => 
        req.studentName.toLowerCase().includes(query) ||
        req.studentId.toLowerCase().includes(query) ||
        req.department?.toLowerCase().includes(query) ||
        req.reason.toLowerCase().includes(query) ||
        req.destination.toLowerCase().includes(query)
      );
    }
    
    setFilteredRequests(filtered);
  }, [requests, statusFilter, searchQuery]);
  
  const handleViewDetails = (requestId: string) => {
    navigate(`/admin/request/${requestId}`);
  };
  
  const handleApproveRequest = (request: ExeatRequest) => {
    setSelectedRequest(request);
    setActionType('approve');
    setActionComment('');
    setActionDialogOpen(true);
  };
  
  const handleRejectRequest = (request: ExeatRequest) => {
    setSelectedRequest(request);
    setActionType('reject');
    setActionComment('');
    setActionDialogOpen(true);
  };
  
  const handleProcessAction = async () => {
    if (!selectedRequest || !actionType || !user) return;
    
    setIsProcessing(true);
    
    try {
      const status: ExeatStatus = actionType === 'approve' ? 'approved' : 'rejected';
      const updatedRequest = await ExeatService.updateRequestStatus(
        selectedRequest.id,
        status,
        user.name,
        actionComment
      );
      
      // Update the requests in state
      setRequests(prev => 
        prev.map(req => req.id === updatedRequest.id ? updatedRequest : req)
      );
      
      toast.success(`Request ${status} successfully`);
      setActionDialogOpen(false);
    } catch (error) {
      console.error('Error processing request:', error);
      toast.error(`Failed to ${actionType} request`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const formatDate = (date: Date) => {
    return format(date, 'MMM dd, yyyy');
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage student exeat requests</p>
          </div>
        </div>
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.filter(r => r.status === 'pending').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Processed Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.filter(r => r.reviewedAt && 
                  r.reviewedAt.toDateString() === new Date().toDateString()).length}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Exeat Requests</CardTitle>
            <CardDescription>Review and manage student exeat requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, or department..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">All Requests</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {renderRequestsTable(filteredRequests)}
              </TabsContent>
              
              <TabsContent value="pending">
                {renderRequestsTable(filteredRequests.filter(r => r.status === 'pending'))}
              </TabsContent>
              
              <TabsContent value="approved">
                {renderRequestsTable(filteredRequests.filter(r => r.status === 'approved'))}
              </TabsContent>
              
              <TabsContent value="rejected">
                {renderRequestsTable(filteredRequests.filter(r => r.status === 'rejected'))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' 
                ? 'The student will be notified that their request has been approved.'
                : 'Please provide a reason for rejecting this request.'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-medium">Student</p>
                  <p className="text-muted-foreground">{selectedRequest.studentName}</p>
                </div>
                <div>
                  <p className="font-medium">Student ID</p>
                  <p className="text-muted-foreground">{selectedRequest.studentId}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium">Reason</p>
                  <p className="text-muted-foreground">{selectedRequest.reason}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium">Duration</p>
                  <p className="text-muted-foreground">
                    {formatDate(selectedRequest.departureDate)} - {formatDate(selectedRequest.returnDate)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comment">Comments</Label>
                <Textarea
                  id="comment"
                  placeholder={actionType === 'approve' 
                    ? "Add any instructions or notes (optional)"
                    : "Please provide a reason for rejection"}
                  value={actionComment}
                  onChange={(e) => setActionComment(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setActionDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              variant={actionType === 'approve' ? 'default' : 'destructive'}
              onClick={handleProcessAction}
              disabled={isProcessing || (actionType === 'reject' && !actionComment.trim())}
              className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {isProcessing 
                ? 'Processing...' 
                : actionType === 'approve' 
                  ? 'Approve Request' 
                  : 'Reject Request'
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
  
  function renderRequestsTable(requests: ExeatRequest[]) {
    if (isLoading) {
      return (
        <div className="h-[200px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-exeat-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading requests...</p>
          </div>
        </div>
      );
    }
    
    if (requests.length === 0) {
      return (
        <div className="py-12 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <Info className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No requests found</h3>
          <p className="text-muted-foreground mt-1">
            {statusFilter !== 'all' 
              ? `There are no ${statusFilter} requests matching your criteria.`
              : searchQuery 
                ? 'No requests match your search criteria.' 
                : 'No exeat requests have been submitted yet.'}
          </p>
        </div>
      );
    }
    
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Departure Date</TableHead>
              <TableHead>Return Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">
                  <div>
                    {request.studentName}
                    <div className="text-xs text-muted-foreground">{request.studentId}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="line-clamp-1">{request.reason}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <CalendarIcon className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span>{formatDate(request.departureDate)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <CalendarIcon className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span>{formatDate(request.returnDate)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <ExeatStatusBadge status={request.status} />
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleViewDetails(request.id)}
                    >
                      <Info className="h-4 w-4" />
                      <span className="sr-only">View Details</span>
                    </Button>
                    
                    {request.status === 'pending' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-green-600 hover:text-green-800 hover:bg-green-100"
                          onClick={() => handleApproveRequest(request)}
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span className="sr-only">Approve</span>
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-600 hover:text-red-800 hover:bg-red-100"
                          onClick={() => handleRejectRequest(request)}
                        >
                          <XCircle className="h-4 w-4" />
                          <span className="sr-only">Reject</span>
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
};

export default AdminDashboard;
