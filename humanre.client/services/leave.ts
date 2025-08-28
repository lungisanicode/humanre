import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LeaveRequest } from '../interfaces/LeaveRequest';
import { AddLeaveRequestObject } from '../interfaces/AddLeaveRequestObject';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  private readonly apiUrl = 'http://localhost:5132/api/Employees';

  constructor(private readonly http: HttpClient) {}

  // Employees

  addLeaveRequest(request: AddLeaveRequestObject): Observable<any> {
    return this.http.post(`${this.apiUrl}/addleaverequest`, request)
      .pipe(
        catchError(err => {
          console.error('Error adding leave request', err);
          return throwError(() => err);
        })
      );
  }

  updateLeaveRequest(request: LeaveRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/leave-requests`, request)
      .pipe(
        catchError(err => {
          console.error('Error updating leave request', err);
          return throwError(() => err);
        })
      );
  }

  viewLeaveRequests(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.apiUrl}/leave-requests`)
      .pipe(
        catchError(err => {
          console.error('Error fetching leave requests', err);
          return throwError(() => err);
        })
      );
  }

  // Managers

  viewManagerLeaveRequests(managerId: number): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`http://localhost:5132/api/managers/${managerId}/leave-requests`)
      .pipe(
        catchError(err => {
          console.error('Error fetching manager leave requests', err);
          return throwError(() => err);
        })
      );
  }

  actionLeaveRequest(request: LeaveRequest): Observable<any> {
    return this.http.post(`http://localhost:5132/api/managers/leave-requests/action`, request)
      .pipe(
        catchError(err => {
          console.error('Error acting on leave request', err);
          return throwError(() => err);
        })
      );
  }
}
