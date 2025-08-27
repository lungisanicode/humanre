import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveRequest } from './../interfaces/LeaveRequest';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  private readonly apiUrl: string = 'https://localhost:7000/api';

  constructor(private readonly http: HttpClient) { }

  addLeaveRequest(request: LeaveRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/employee/addleaverequest`, request);
  }

  updateLeaveRequest(request: LeaveRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/employee/updateleaverequest`, request);
  }

  retractLeaveRequest(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/employee/retractleaverequest/${id}`, {});
  }

  viewLeaveRequests(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.apiUrl}/employee/viewleaverequests`);
  }

  viewManagerLeaveRequests(managerId: number): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.apiUrl}/manager/viewleaverequests/${managerId}`);
  }

  actionLeaveRequest(request: LeaveRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/manager/actionleaverequest`, request);
  }
}
