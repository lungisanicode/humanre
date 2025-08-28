import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="container">
    <form (ngSubmit)="onSubmit()" class="login-form">
      <h2 class="title">Human Resource Management System</h2>
      <label>Please use company email to login</label>
      
      <input type="email" [(ngModel)]="email" name="email" required />

      <div *ngIf="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <button type="submit" [disabled]="!email || isLoading">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
  </div>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  errorMessage = '';
  isLoading = false;

  constructor(private readonly auth: AuthService, private readonly router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.isLoading = true;
    
    this.auth.login(this.email).subscribe({
      next: (user) => {
        this.isLoading = false;
        if (user.isManager) {
          this.router.navigate(['/manager']);
        } else {
          this.router.navigate(['/employee']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Login failed. Please try again.';
      }
    });
  }
}
