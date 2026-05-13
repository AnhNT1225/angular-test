import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public loginForm!: FormGroup;
  private isAuth: boolean = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private accountService: AccountService,
  ) {}

  ngOnInit() {
    this.authenticationService.isAuthenticate().subscribe((status) => {
      this.isAuth = status;
      if (this.isAuth) {
        this.router.navigate(['']);
      }
    });

    this.loginForm = new FormGroup({
      emailAddress: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.toastr.error('Please fill in all the required fields.');
      return;
    }
    const res = this.authService
      .login(
        this.loginForm.get('emailAddress')!.value,
        this.loginForm!.get('password')!.value,
      )
      .subscribe({
        next: (data: any) => {
          this.authenticationService.setToken(data.name, data.value);
          this.getUserAccount();
        },
        error: (e: HttpErrorResponse) => {
          if (e.status === 401) {
            this.toastr.error(
              'Invalid credentials. Please enter a valid email address and password.',
            );
          } else {
            this.toastr.error('Oops! Something went wrong while logging in.');
          }
        },
        complete: () => {
          this.toastr.success('Login Successful');
          this.router.navigate(['']);
          this.loginForm.reset();
        },
      });
  }

  getUserAccount() {
    this.accountService.getUserAsAccount().subscribe({
      next: (data: any) => {
        this.authenticationService.setAccount(data);
      },
      error: (e: HttpErrorResponse) => {
        this.toastr.error(
          'Oops! Something went wrong while geting user account info.',
        );
      },
      complete: () => {},
    });
  }
  getFormControlError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field && field.touched && field.invalid) {
      if (field.errors?.['required']) {
        if (fieldName === 'emailAddress') {
          return 'Please enter an email address.';
        }
        if (fieldName === 'password') {
          return 'Please enter your password.';
        }
      }
      if (field.errors?.['minlength']) {
        if (fieldName === 'password') {
          return `Password must be at least ${field.errors['minlength'].requiredLength} characters long.`;
        }
      }

      if (field.errors?.['email']) {
        return 'Please enter a valid email address.';
      }
    }
    return '';
  }
}
