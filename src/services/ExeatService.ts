
import { User } from '../contexts/AuthContext';

export type ExeatStatus = 'pending' | 'approved' | 'rejected';

export enum LeaveReason {
  MEDICAL = 'Medical Appointment',
  FAMILY = 'Family Emergency',
  PERSONAL = 'Personal Reasons',
  ACADEMIC = 'Academic Event',
  OTHER = 'Other'
}

export interface ExeatRequest {
  id: string;
  studentId: string;
  studentName: string;
  department?: string;
  reason: LeaveReason;
  reasonDetails: string;
  destination: string;
  departureDate: Date;
  returnDate: Date;
  status: ExeatStatus;
  comments?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  qrCode?: string;
}

// Sample data for demo purposes
let EXEAT_REQUESTS: ExeatRequest[] = [
  {
    id: 'exeat-001',
    studentId: 'VU123456',
    studentName: 'John Student',
    department: 'Computer Science',
    reason: LeaveReason.MEDICAL,
    reasonDetails: 'Dental appointment in the city',
    destination: 'City Dental Clinic, Downtown',
    departureDate: new Date(2025, 4, 10, 9, 0),
    returnDate: new Date(2025, 4, 10, 16, 0),
    status: 'approved',
    comments: 'Approved. Please return on time.',
    reviewedBy: 'Admin User',
    reviewedAt: new Date(2025, 4, 8, 14, 30),
    createdAt: new Date(2025, 4, 7, 10, 0),
    qrCode: 'exeat-001-approved'
  },
  {
    id: 'exeat-002',
    studentId: 'VU123456',
    studentName: 'John Student',
    department: 'Computer Science',
    reason: LeaveReason.FAMILY,
    reasonDetails: 'Sister\'s wedding',
    destination: 'Family home, 123 Main St, Hometown',
    departureDate: new Date(2025, 4, 15, 8, 0),
    returnDate: new Date(2025, 4, 17, 18, 0),
    status: 'pending',
    createdAt: new Date(2025, 4, 7, 14, 20),
  },
  {
    id: 'exeat-003',
    studentId: 'VU789012',
    studentName: 'Jane Student',
    department: 'Business Administration',
    reason: LeaveReason.ACADEMIC,
    reasonDetails: 'Business conference',
    destination: 'Grand Conference Hotel',
    departureDate: new Date(2025, 4, 12, 7, 30),
    returnDate: new Date(2025, 4, 13, 19, 0),
    status: 'rejected',
    comments: 'Insufficient details provided. Please reapply with conference invitation.',
    reviewedBy: 'Admin User',
    reviewedAt: new Date(2025, 4, 8, 9, 15),
    createdAt: new Date(2025, 4, 7, 8, 45),
  },
  {
    id: 'exeat-004',
    studentId: 'VU456789',
    studentName: 'Robert Student',
    department: 'Engineering',
    reason: LeaveReason.PERSONAL,
    reasonDetails: 'Visiting family',
    destination: 'Family residence',
    departureDate: new Date(2025, 4, 9, 16, 0),
    returnDate: new Date(2025, 4, 11, 12, 0),
    status: 'pending',
    createdAt: new Date(2025, 4, 7, 12, 30),
  }
];

// Service methods
export const ExeatService = {
  // Get all exeat requests (with optional filters)
  getAllRequests: async (
    filters?: { 
      status?: ExeatStatus;
      studentId?: string;
      departmentId?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<ExeatRequest[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredRequests = [...EXEAT_REQUESTS];
    
    if (filters) {
      if (filters.status) {
        filteredRequests = filteredRequests.filter(req => req.status === filters.status);
      }
      
      if (filters.studentId) {
        filteredRequests = filteredRequests.filter(req => req.studentId === filters.studentId);
      }
      
      if (filters.departmentId) {
        filteredRequests = filteredRequests.filter(req => req.department === filters.departmentId);
      }
      
      if (filters.startDate) {
        filteredRequests = filteredRequests.filter(req => req.departureDate >= filters.startDate);
      }
      
      if (filters.endDate) {
        filteredRequests = filteredRequests.filter(req => req.departureDate <= filters.endDate);
      }
    }
    
    // Sort by created date (newest first)
    return filteredRequests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },
  
  // Get requests for a specific student
  getStudentRequests: async (studentId: string): Promise<ExeatRequest[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const studentRequests = EXEAT_REQUESTS.filter(req => req.studentId === studentId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return studentRequests;
  },
  
  // Get a single request by ID
  getRequestById: async (requestId: string): Promise<ExeatRequest | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const request = EXEAT_REQUESTS.find(req => req.id === requestId);
    return request || null;
  },
  
  // Create a new exeat request
  createRequest: async (request: Omit<ExeatRequest, 'id' | 'status' | 'createdAt' | 'qrCode'>): Promise<ExeatRequest> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newRequest: ExeatRequest = {
      ...request,
      id: `exeat-${Date.now().toString().slice(-6)}`,
      status: 'pending',
      createdAt: new Date(),
    };
    
    EXEAT_REQUESTS.push(newRequest);
    return newRequest;
  },
  
  // Update request status
  updateRequestStatus: async (
    requestId: string, 
    status: ExeatStatus, 
    reviewedBy: string, 
    comments?: string
  ): Promise<ExeatRequest> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const requestIndex = EXEAT_REQUESTS.findIndex(req => req.id === requestId);
    
    if (requestIndex === -1) {
      throw new Error('Request not found');
    }
    
    const updatedRequest = {
      ...EXEAT_REQUESTS[requestIndex],
      status,
      comments,
      reviewedBy,
      reviewedAt: new Date(),
    };
    
    // Generate QR code if approved
    if (status === 'approved') {
      updatedRequest.qrCode = `${requestId}-approved`;
    } else {
      updatedRequest.qrCode = undefined;
    }
    
    EXEAT_REQUESTS[requestIndex] = updatedRequest;
    return updatedRequest;
  },
  
  // Delete an exeat request
  deleteRequest: async (requestId: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const initialLength = EXEAT_REQUESTS.length;
    EXEAT_REQUESTS = EXEAT_REQUESTS.filter(req => req.id !== requestId);
    
    if (EXEAT_REQUESTS.length === initialLength) {
      throw new Error('Request not found');
    }
  },
  
  // Verify a QR code for security checkpoint
  verifyQrCode: async (qrCode: string): Promise<ExeatRequest | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const request = EXEAT_REQUESTS.find(req => req.qrCode === qrCode);
    return request || null;
  }
};
