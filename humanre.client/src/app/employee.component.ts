import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../services/leave';
import { LeaveRequest } from '../../interfaces/LeaveRequest';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="container">
    <h2>My Leave Requests</h2>
    <button (click)="refresh()">Refresh</button>

    <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>

    <form (ngSubmit)="create()" style="margin: 1rem 0;">
      <label>Start</label>
      <input type="date" [(ngModel)]="newStart" name="start" required />
      <label>End</label>
      <input type="date" [(ngModel)]="newEnd" name="end" required />
      <input type="text" [(ngModel)]="newReason" name="reason" placeholder="Reason" />
      <button type="submit">Add</button>
    </form>

    <ul *ngIf="leaveRequests.length; else noRequests">
      <li *ngFor="let req of leaveRequests">
        <strong>{{ req.reason || 'No reason' }}</strong>
        ({{ req.startDate }} → {{ req.endDate }})
        <span *ngIf="req.isApproved">✅ Approved</span>
        <span *ngIf="req.isRejected">❌ Rejected</span>
        <span *ngIf="!req.isApproved && !req.isRejected && !req.isWithdrawn">⏳ Pending</span>
        <span *ngIf="req.isWithdrawn">🚫 Withdrawn</span>
        <button *ngIf="!req.isApproved && !req.isRejected && !req.isWithdrawn" (click)="retract(req)">
          Retract
        </button>
      </li>
    </ul>

    <ng-template #noRequests><p>No leave requests.</p></ng-template>
  </div>
  `,
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
      reason: this.newReason,
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
    this.leaveService.retractLeaveRequest(req.id).subscribe({
      next: () => this.refresh(),
      error: err => {
        console.error(err);
        this.errorMessage = 'Failed to retract request.';
      }
    });
  }
} 