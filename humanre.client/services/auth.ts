import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Employee } from './../interfaces/Employee';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

export interface AuthUser extends Pick<Employee, 'id' | 'fullName' | 'emailAddress' | 'isManager'> {}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  readonly currentUser$: Observable<AuthUser | null> = this.currentUserSubject.asObservable();

  constructor(private readonly router: Router, private readonly http: HttpClient) {}

  get currentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  login(emailAddress: string): Observable<AuthUser> {
    return this.http.post<Employee>(
      `http://localhost:5132/api/System/login`,
      `"${emailAddress}"`, 
      { headers: { 'Content-Type': 'application/json' } }
    ).pipe(
      map((employee: Employee) => {
        const authUser: AuthUser = {
          id: employee.id,
          fullName: employee.fullName,
          emailAddress: employee.emailAddress,
          isManager: employee.isManager
        };
        this.currentUserSubject.next(authUser);
        return authUser;
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError(() => new Error('Login failed. Please check your email and try again.'));
      })
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.router.navigate(['/']); // optional: redirect to login
  }
}
