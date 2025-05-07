
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExeatService, ExeatRequest } from '@/services/ExeatService';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScanBarcode, Search, CheckCircle2 } from 'lucide-react';

const SecurityCheckpoint: React.FC = () => {
  const [scanMode, setScanMode] = useState<'scan' | 'manual'>('scan');
  const [manualCode, setManualCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [verifiedRequest, setVerifiedRequest] = useState<ExeatRequest | null>(null);
  
  const toggleScanMode = () => {
    setScanning(false);
    setManualCode('');
    setVerifiedRequest(null);
    setScanMode(scanMode === 'scan' ? 'manual' : 'scan');
  };
  
  const startScanning = () => {
    setScanning(true);
    
    // Simulate a successful scan after a delay
    setTimeout(() => {
      setScanning(false);
      
      // For demo purposes, hardcode a valid QR code
      const demoCode = 'exeat-001-approved';
      handleVerifyQrCode(demoCode);
    }, 3000);
  };
  
  const handleManualVerify = async () => {
    if (!manualCode.trim()) {
      toast.error('Please enter an exeat code');
      return;
    }
    
    await handleVerifyQrCode(manualCode);
  };
  
  const handleVerifyQrCode = async (code: string) => {
    try {
      const request = await ExeatService.verifyQrCode(code);
      
      if (!request) {
        toast.error('Invalid or expired exeat code');
        setVerifiedRequest(null);
        return;
      }
      
      setVerifiedRequest(request);
      toast.success('Exeat verified successfully');
    } catch (error) {
      console.error('Error verifying exeat:', error);
      toast.error('Failed to verify exeat code');
      setVerifiedRequest(null);
    }
  };
  
  const formatDate = (date: Date) => {
    return format(date, 'EEEE, MMMM dd, yyyy');
  };
  
  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Security Checkpoint</h1>
        <p className="text-muted-foreground">Verify student exeat permissions before allowing campus exit</p>
        
        <Tabs defaultValue={scanMode} className="w-full" onValueChange={(value) => setScanMode(value as 'scan' | 'manual')}>
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="scan" className="px-8">
                <ScanBarcode className="mr-2 h-4 w-4" /> Scan QR Code
              </TabsTrigger>
              <TabsTrigger value="manual" className="px-8">
                <Search className="mr-2 h-4 w-4" /> Manual Entry
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="scan">
            <Card>
              <CardHeader>
                <CardTitle>Scan QR Code</CardTitle>
                <CardDescription>Scan the student's exeat QR code to verify their permission</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                {!scanning && !verifiedRequest && (
                  <>
                    <div className="w-64 h-64 bg-gray-100 rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
                      <ScanBarcode className="h-16 w-16 text-gray-400" />
                    </div>
                    <Button 
                      onClick={startScanning}
                      className="bg-exeat-primary hover:bg-exeat-primary/90"
                    >
                      Start Scanning
                    </Button>
                  </>
                )}
                
                {scanning && (
                  <div className="w-64 h-64 bg-gray-100 rounded-lg mb-4 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-pulse bg-blue-500/20 rounded-lg w-full h-full"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-bounce">
                        <ScanBarcode className="h-12 w-12 text-exeat-primary" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-0 right-0 text-center text-sm font-medium">
                      Scanning...
                    </div>
                  </div>
                )}
                
                {verifiedRequest && renderVerificationResult()}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="manual">
            <Card>
              <CardHeader>
                <CardTitle>Manual Code Entry</CardTitle>
                <CardDescription>Enter the exeat code or student ID to verify</CardDescription>
              </CardHeader>
              <CardContent>
                {!verifiedRequest ? (
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter exeat code or student ID"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                      />
                      <Button 
                        onClick={handleManualVerify}
                        className="bg-exeat-primary hover:bg-exeat-primary/90"
                      >
                        Verify
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Demo: Enter "exeat-001-approved" to see a valid result
                    </div>
                  </div>
                ) : (
                  renderVerificationResult()
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
  
  function renderVerificationResult() {
    if (!verifiedRequest) return null;
    
    const isValid = verifiedRequest.status === 'approved';
    const isExpired = new Date() > verifiedRequest.returnDate;
    
    // Check if the student is leaving or returning
    const currentDate = new Date();
    const isDeparting = currentDate >= verifiedRequest.departureDate && currentDate <= verifiedRequest.returnDate;
    
    return (
      <div className="w-full max-w-md mx-auto">
        <div className={`text-center p-4 rounded-md mb-6 ${isValid && !isExpired ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <div className="flex justify-center mb-2">
            {isValid && !isExpired ? (
              <div className="rounded-full bg-green-100 p-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            ) : (
              <div className="rounded-full bg-red-100 p-2">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-medium">
            {isValid && !isExpired ? 'Valid Exeat Pass' : 'Invalid Exeat Pass'}
          </h3>
          <p className="text-sm mt-1">
            {isValid && !isExpired 
              ? isDeparting 
                ? 'Student is authorized to leave campus'
                : 'Student is returning from approved leave'
              : isExpired 
                ? 'Exeat has expired' 
                : 'Exeat is not approved'}
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="border rounded-md p-4">
            <h3 className="font-medium text-lg mb-3">Student Information</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-2">
                <span className="text-sm text-muted-foreground">Name:</span>
                <span className="text-sm font-medium">{verifiedRequest.studentName}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-sm text-muted-foreground">ID Number:</span>
                <span className="text-sm font-medium">{verifiedRequest.studentId}</span>
              </div>
              {verifiedRequest.department && (
                <div className="grid grid-cols-2">
                  <span className="text-sm text-muted-foreground">Department:</span>
                  <span className="text-sm font-medium">{verifiedRequest.department}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="font-medium text-lg mb-3">Exeat Details</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-2">
                <span className="text-sm text-muted-foreground">Reason:</span>
                <span className="text-sm font-medium">{verifiedRequest.reason}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-sm text-muted-foreground">Destination:</span>
                <span className="text-sm font-medium">{verifiedRequest.destination}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-sm text-muted-foreground">Departure:</span>
                <span className="text-sm font-medium">
                  {formatDate(verifiedRequest.departureDate)} at {formatTime(verifiedRequest.departureDate)}
                </span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-sm text-muted-foreground">Return:</span>
                <span className="text-sm font-medium">
                  {formatDate(verifiedRequest.returnDate)} at {formatTime(verifiedRequest.returnDate)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between space-x-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setVerifiedRequest(null);
                setManualCode('');
              }}
            >
              Clear
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={!isValid || isExpired}
            >
              Record Exit/Entry
            </Button>
          </div>
        </div>
      </div>
    );
  }
};

export default SecurityCheckpoint;
