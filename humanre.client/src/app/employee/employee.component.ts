import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../../services/leave';
import { LeaveRequest } from '../../../interfaces/LeaveRequest';
import { AddLeaveRequestObject } from './../../../interfaces/AddLeaveRequestObject';
import { AuthService } from '../../../services/auth';

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
  newReason = 'Annual Leave'; 

  constructor(
    private readonly leaveService: LeaveService,
    private readonly authService: AuthService
  ) {}

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

  private calculateWeekdays(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
  
    if (endDate < startDate) return 0;
  
    let count = 0;
    let current = new Date(startDate);
  
    while (current <= endDate) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) { 
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
  
    return count;
  }
  
  create(): void {
    const currentUser = this.authService.currentUser;
    console.log(currentUser);
    if (!currentUser) {
      this.errorMessage = 'You must be logged in to create a leave request.';
      return;
    }

    const numberOfDays = this.calculateWeekdays(this.newStart, this.newEnd);
    const request: AddLeaveRequestObject = {
      employeeId: currentUser.id,
      startDate: new Date(this.newStart).toISOString(),
      endDate: new Date(this.newEnd).toISOString(),
      numberOfDays: numberOfDays,
      reason: 'Annual Leave',
      isApproved: false,
      isRejected: false,
      isWithdrawn: false,
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
      approvedById: null,
      approvalDate: null,
      rejectionReason: ''
    };
    

    this.leaveService.addLeaveRequest(request).subscribe({
      next: () => {
        this.newStart = this.newEnd = '';
        this.refresh();
      },
      error: err => console.error('Failed to add leave request', err)
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
