
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { ExeatService, LeaveReason } from '@/services/ExeatService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const NewRequestPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    reason: '',
    reasonDetails: '',
    destination: '',
  });
  
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [departureTime, setDepartureTime] = useState('');
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [returnTime, setReturnTime] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.reason) newErrors.reason = 'Please select a reason';
    if (!formData.reasonDetails) newErrors.reasonDetails = 'Please provide details';
    if (!formData.destination) newErrors.destination = 'Destination is required';
    if (!departureDate) newErrors.departureDate = 'Departure date is required';
    if (!departureTime) newErrors.departureTime = 'Departure time is required';
    if (!returnDate) newErrors.returnDate = 'Return date is required';
    if (!returnTime) newErrors.returnTime = 'Return time is required';
    
    if (departureDate && returnDate) {
      const fullDepartureDate = new Date(
        departureDate.getFullYear(),
        departureDate.getMonth(),
        departureDate.getDate(),
        parseInt(departureTime.split(':')[0] || '0'),
        parseInt(departureTime.split(':')[1] || '0')
      );
      
      const fullReturnDate = new Date(
        returnDate.getFullYear(),
        returnDate.getMonth(),
        returnDate.getDate(),
        parseInt(returnTime.split(':')[0] || '0'),
        parseInt(returnTime.split(':')[1] || '0')
      );
      
      if (fullReturnDate <= fullDepartureDate) {
        newErrors.returnDate = 'Return date/time must be after departure date/time';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!user?.studentId) {
      toast.error('Student information missing');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Combine date and time
      const fullDepartureDate = new Date(
        departureDate!.getFullYear(),
        departureDate!.getMonth(),
        departureDate!.getDate(),
        parseInt(departureTime.split(':')[0]),
        parseInt(departureTime.split(':')[1])
      );
      
      const fullReturnDate = new Date(
        returnDate!.getFullYear(),
        returnDate!.getMonth(),
        returnDate!.getDate(),
        parseInt(returnTime.split(':')[0]),
        parseInt(returnTime.split(':')[1])
      );
      
      await ExeatService.createRequest({
        studentId: user.studentId,
        studentName: user.name,
        department: user.department,
        reason: formData.reason as LeaveReason,
        reasonDetails: formData.reasonDetails,
        destination: formData.destination,
        departureDate: fullDepartureDate,
        returnDate: fullReturnDate,
      });
      
      toast.success('Exeat request submitted successfully');
      navigate('/student/dashboard');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
            <h1 className="text-2xl font-bold tracking-tight">New Exeat Request</h1>
            <p className="text-muted-foreground">Submit a request to leave campus temporarily</p>
          </div>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
              <CardDescription>Provide information about your exeat request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <Label htmlFor="reason">Reason for Leave</Label>
                <Select 
                  onValueChange={(value) => setFormData({...formData, reason: value})}
                  value={formData.reason}
                >
                  <SelectTrigger id="reason" className={errors.reason ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select reason for leave" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={LeaveReason.MEDICAL}>Medical Appointment</SelectItem>
                    <SelectItem value={LeaveReason.FAMILY}>Family Emergency</SelectItem>
                    <SelectItem value={LeaveReason.PERSONAL}>Personal Reasons</SelectItem>
                    <SelectItem value={LeaveReason.ACADEMIC}>Academic Event</SelectItem>
                    <SelectItem value={LeaveReason.OTHER}>Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="reasonDetails">Details</Label>
                <Textarea 
                  id="reasonDetails" 
                  placeholder="Please provide additional details about your request" 
                  className={`min-h-[100px] ${errors.reasonDetails ? 'border-red-500' : ''}`}
                  value={formData.reasonDetails}
                  onChange={(e) => setFormData({...formData, reasonDetails: e.target.value})}
                />
                {errors.reasonDetails && <p className="text-red-500 text-xs mt-1">{errors.reasonDetails}</p>}
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="destination">Destination</Label>
                <Input 
                  id="destination" 
                  placeholder="Where are you going?" 
                  className={errors.destination ? 'border-red-500' : ''}
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                />
                {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="departureDate">Departure Date</Label>
                  <div className="flex space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !departureDate && "text-muted-foreground",
                            errors.departureDate && "border-red-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {departureDate ? format(departureDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={departureDate}
                          onSelect={setDepartureDate}
                          initialFocus
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Input 
                      type="time"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      className={`w-[140px] ${errors.departureTime ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.departureDate && <p className="text-red-500 text-xs mt-1">{errors.departureDate}</p>}
                  {errors.departureTime && <p className="text-red-500 text-xs mt-1">{errors.departureTime}</p>}
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="returnDate">Return Date</Label>
                  <div className="flex space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !returnDate && "text-muted-foreground",
                            errors.returnDate && "border-red-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {returnDate ? format(returnDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={returnDate}
                          onSelect={setReturnDate}
                          initialFocus
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Input 
                      type="time"
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className={`w-[140px] ${errors.returnTime ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.returnDate && <p className="text-red-500 text-xs mt-1">{errors.returnDate}</p>}
                  {errors.returnTime && <p className="text-red-500 text-xs mt-1">{errors.returnTime}</p>}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/student/dashboard')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-exeat-primary hover:bg-exeat-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default NewRequestPage;
