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

  isEditing = false;
  editingRequest: LeaveRequest | null = null;
  rectractiontRequest: LeaveRequest | null = null;

  constructor(
    private readonly leaveService: LeaveService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.errorMessage = null;
    const employeeId = this.authService.currentUser?.id ?? 0;
  
    this.leaveService.viewLeaveRequests().subscribe({
      next: reqs => {
        this.leaveRequests = reqs.filter(r => r.employeeId === employeeId);
      },
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
      if (day !== 0 && day !== 6) count++;
      current.setDate(current.getDate() + 1);
    }

    return count;
  }

  create(): void {
    const currentUser = this.authService.currentUser;
    if (!currentUser) {
      this.errorMessage = 'You must be logged in to create a leave request.';
      return;
    }

    const numberOfDays = this.calculateWeekdays(this.newStart, this.newEnd);
    const request: AddLeaveRequestObject = {
      employeeId: currentUser.id,
      startDate: new Date(this.newStart).toISOString(),
      endDate: new Date(this.newEnd).toISOString(),
      numberOfDays,
      reason: this.newReason,
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
    
    this.rectractiontRequest = { ...req };
    this.rectractiontRequest.isWithdrawn = true;
    this.rectractiontRequest.status = 'Cancelled';

    this.leaveService.updateLeaveRequest(this.rectractiontRequest).subscribe({
      next: () => this.refresh(),
      error: err => {
        console.error(err);
        this.errorMessage = 'Failed to retract the request.';
      }
    });
  }

  edit(req: LeaveRequest): void {
    this.isEditing = true;
    this.editingRequest = { ...req }; 
    this.newStart = this.editingRequest.startDate.split('T')[0];
    this.newEnd = this.editingRequest.endDate.split('T')[0];
  }

  saveEdit(): void {
    if (!this.editingRequest) return;

    const numberOfDays = this.calculateWeekdays(this.newStart, this.newEnd);
    this.editingRequest.startDate = new Date(this.newStart).toISOString();
    this.editingRequest.endDate = new Date(this.newEnd).toISOString();
    this.editingRequest.numberOfDays = numberOfDays;
    this.editingRequest.reason = this.newReason;
    this.editingRequest.modifiedDate = new Date().toISOString();

    this.leaveService.updateLeaveRequest(this.editingRequest).subscribe({
      next: () => {
        this.isEditing = false;
        this.editingRequest = null;
        this.newStart = this.newEnd = '';
        this.refresh();
      },
      error: err => {
        console.error(err);
        this.errorMessage = 'Failed to update the leave request.';
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingRequest = null;
    this.newStart = this.newEnd = '';
    this.newReason = 'Annual Leave';
  }
}
