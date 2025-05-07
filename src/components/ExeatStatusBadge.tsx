
import React from 'react';
import { cn } from '@/lib/utils';
import { ExeatStatus } from '@/services/ExeatService';

interface ExeatStatusBadgeProps {
  status: ExeatStatus;
  className?: string;
}

const ExeatStatusBadge: React.FC<ExeatStatusBadgeProps> = ({ status, className }) => {
  const getStatusClass = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        getStatusClass(),
        className
      )}
    >
      {getStatusText()}
    </span>
  );
};

export default ExeatStatusBadge;
