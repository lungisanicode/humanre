import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveRequest } from './../interfaces/LeaveRequest';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  private readonly apiUrl = 'http://localhost:5132/api';

  constructor(private readonly http: HttpClient) {}

  // Employees
  addLeaveRequest(request: LeaveRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/employees/leave-requests`, request);
  }

  updateLeaveRequest(request: LeaveRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/employees/leave-requests`, request);
  }

  retractLeaveRequest(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/employees/leave-requests/${id}`);
  }

  viewLeaveRequests(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.apiUrl}/employees/leave-requests`);
  }

  // Managers
  viewManagerLeaveRequests(managerId: number): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.apiUrl}/managers/${managerId}/leave-requests`);
  }

  actionLeaveRequest(request: LeaveRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/managers/leave-requests/action`, request);
  }
}
