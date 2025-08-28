import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Employee } from './../interfaces/Employee';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

export interface AuthUser extends Pick<Employee, 'id' | 'fullName' | 'emailAddress' | 'isManager'> {}

const AUTH_STORAGE_KEY = 'hr_current_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(this.readFromStorage());
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
        this.persist(authUser);
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
    localStorage.removeItem(AUTH_STORAGE_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/']); 
  }

  private persist(user: AuthUser): void {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }

  private readFromStorage(): AuthUser | null {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }
}
