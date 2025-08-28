import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../../services/leave';
import { LeaveRequest } from '../../../interfaces/LeaveRequest';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {
  leaveRequests: LeaveRequest[] = [];
  errorMessage: string | null = null;
  view: 'all' | 'actions' = 'all'; 

  constructor(
    private readonly leaveService: LeaveService,
    private readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  switchView(view: 'all' | 'actions'): void {
    this.view = view;
  }

  refresh(): void {
    this.errorMessage = null;
    const managerId = this.auth.currentUser?.id ?? 0;
    this.leaveService.viewManagerLeaveRequests(managerId).subscribe({
      next: reqs => (this.leaveRequests = reqs),
      error: err => {
        console.error(err);
        this.errorMessage = 'Failed to load team requests.';
      }
    });
  }

  approve(req: LeaveRequest): void {
    const updated: LeaveRequest = { ...req, isApproved: true, isRejected: false, status: 'Approved' };
    this.leaveService.actionLeaveRequest(updated).subscribe({
      next: () => this.refresh(),
      error: err => {
        console.error(err);
        this.errorMessage = 'Failed to approve request.';
      }
    });
  }

  reject(req: LeaveRequest): void {
    const updated: LeaveRequest = { ...req, isApproved: false, isRejected: true, status: 'Rejected' };
    this.leaveService.actionLeaveRequest(updated).subscribe({
      next: () => this.refresh(),
      error: err => {
        console.error(err);
        this.errorMessage = 'Failed to reject request.';
      }
    });
  }
}
