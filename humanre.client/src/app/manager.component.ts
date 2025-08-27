import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../services/leave';
import { LeaveRequest } from '../../interfaces/LeaveRequest';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="container">
    <h2>Team Leave Requests</h2>
    <button (click)="refresh()">Refresh</button>

    <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>

    <ul *ngIf="leaveRequests.length; else noRequests">
      <li *ngFor="let req of leaveRequests">
        <strong>{{ req.reason || 'No reason' }}</strong>
        ({{ req.startDate }} → {{ req.endDate }})
        <span *ngIf="req.isApproved">✅ Approved</span>
        <span *ngIf="req.isRejected">❌ Rejected</span>
        <span *ngIf="!req.isApproved && !req.isRejected && !req.isWithdrawn">⏳ Pending</span>
        <button *ngIf="!req.isApproved && !req.isRejected" (click)="approve(req)">Approve</button>
        <button *ngIf="!req.isApproved && !req.isRejected" (click)="reject(req)">Reject</button>
      </li>
    </ul>

    <ng-template #noRequests><p>No team requests.</p></ng-template>
  </div>
  `,
})
export class ManagerComponent implements OnInit {
  leaveRequests: LeaveRequest[] = [];
  errorMessage: string | null = null;

  constructor(private readonly leaveService: LeaveService, private readonly auth: AuthService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.errorMessage = null;
    const managerId = this.auth.currentUser?.id ?? 0;
    this.leaveService.viewManagerLeaveRequests(managerId).subscribe({
      next: reqs => this.leaveRequests = reqs,
      error: err => {
        console.error(err);
        this.errorMessage = 'Failed to load team requests.';
      }
    });
  }

  approve(req: LeaveRequest): void {
    const updated: LeaveRequest = { ...req, isApproved: true, isRejected: false };
    this.leaveService.actionLeaveRequest(updated).subscribe({
      next: () => this.refresh(),
      error: err => {
        console.error(err);
        this.errorMessage = 'Failed to approve request.';
      }
    });
  }

  reject(req: LeaveRequest): void {
    const updated: LeaveRequest = { ...req, isApproved: false, isRejected: true };
    this.leaveService.actionLeaveRequest(updated).subscribe({
      next: () => this.refresh(),
      error: err => {
        console.error(err);
        this.errorMessage = 'Failed to reject request.';
      }
    });
  }
} 