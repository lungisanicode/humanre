export interface AddLeaveRequestObject {
    employeeId: number;
    startDate: string; 
    endDate: string; 
    numberOfDays: number;
    reason: string;
    isApproved?: boolean;
    isRejected?: boolean;
    isWithdrawn?: boolean;
    createdDate?: string; 
    modifiedDate?: string; 
    approvedById?: number | null;
    approvalDate?: string | null;
    rejectionReason?: string;
  }
