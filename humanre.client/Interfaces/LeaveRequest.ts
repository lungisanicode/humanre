export interface LeaveRequest {
  id: number;
  employeeId: number;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason?: string;
  isApproved: boolean;
  isRejected: boolean;
  isWithdrawn: boolean;
  createdDate: string;
  modifiedDate: string;
  approvedById?: number;
  approvalDate?: string;
  rejectionReason?: string;
}
