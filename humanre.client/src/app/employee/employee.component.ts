import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../../services/leave';
import { LeaveRequest } from '../../../interfaces/LeaveRequest';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  leaveRequests: LeaveRequest[] = [];
  errorMessage: string | null = null;

  newStart = '';
  newEnd = '';
  newReason = '';

  constructor(private readonly leaveService: LeaveService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.errorMessage = null;
    this.leaveService.viewLeaveRequests().subscribe({
      next: reqs => this.leaveRequests = reqs,
      error: err => {
        console.error(err);
        this.errorMessage = 'Failed to load leave requests. Please try again.';
      }
    });
  }

  create(): void {
    const request: LeaveRequest = {
      id: 0,
      employeeId: 0,
      leaveTypeId: 1,
      startDate: this.newStart,
      endDate: this.newEnd,
      numberOfDays: 0,
      reason: 'Annual Leave',
      isApproved: false,
      isRejected: false,
      isWithdrawn: false,
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString()
    };
    this.leaveService.addLeaveRequest(request).subscribe({
      next: () => {
        this.newStart = this.newEnd = this.newReason = '';
        this.refresh();
      },
      error: err => {
        console.error(err);
        this.errorMessage = 'Failed to add leave request.';
      }
    });
  }

  retract(req: LeaveRequest): void {
    this.leaveService.retractLeaveRequest(req.id as unknown as string).subscribe({
      next: () => this.refresh(),
      error: err => {
        console.error(err);
        this.errorMessage = 'Failed to retract request.';
      }
    });
  }
}
