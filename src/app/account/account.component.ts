import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../app/services/account.service';
import { AuthenticationService } from '../../app/services/authentication.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';

interface OpenAccount {
  firstName: string;
  lastName: string;
  dob: NgbDateStruct;
  gender: string;
  address: string;
  city: string;
  emailAddress: string;
  password: string;
  privacyPolicy: boolean;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  public errorMessages: any = {
    firstName: [{ type: 'required', message: 'First name is required.' }],
    lastName: [{ type: 'required', message: 'Last name is required.' }],
    dob: [{ type: 'required', message: 'Date of birth is required.' }],
    emailAddress: [
      { type: 'required', message: 'Email address is required.' },
      { type: 'email', message: 'Enter a valid email address.' },
    ],
    password: [{ type: 'required', message: 'Password is required.' }],
    gender: [{ type: 'required', message: 'Gender is required.' }],
    address: [{ type: 'required', message: 'Address is required.' }],
    city: [{ type: 'required', message: 'City is required.' }],
    privacyPolicy: [
      { type: 'required', message: 'You must accept the privacy policy.' },
    ],
  };

  getFormControlError(fieldName: string): string {
    const field = this.openAccountForm.get(fieldName);
    if (field && field.touched && field.invalid) {
      const fieldErrors = this.errorMessages[fieldName];
      for (let error of fieldErrors) {
        if (field.errors?.[error.type]) {
          return error.message;
        }
      }
    }
    return '';
  }

  public openAccountForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    dob: new FormControl(null, [Validators.required]),
    gender: new FormControl('male', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    privacyPolicy: new FormControl(false, [Validators.requiredTrue]),
  });
  public isAuth: boolean = false;
  public todayDate: NgbDateStruct = this.getCurrentDate();
  public openAccount: OpenAccount = {
    firstName: '',
    lastName: '',
    dob: this.todayDate,
    gender: 'male',
    address: '',
    city: '',
    emailAddress: '',
    password: '',
    privacyPolicy: false,
  };

  getCurrentDate(): NgbDateStruct {
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1, // NgbDatepicker months are 1-based
      day: today.getDate(),
    };
  }

  constructor(
    private toastr: ToastrService,
    private accountService: AccountService,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.authenticationService.isAuthenticate().subscribe((status: boolean) => {
      this.isAuth = status;
    });

    if (this.isAuth) {
      this.router.navigate(['']);
    }
  }

  onSubmit() {
    if (this.openAccountForm.invalid) {
      this.openAccountForm.markAllAsTouched();
      this.toastr.error('Please fill in all the required fields.');
      return ;
    }

    const dateOfBirth = new Date(
      this.openAccount.dob.year,
      this.openAccount.dob.month - 1,
      this.openAccount.dob.day,
    );

    this.accountService
      .openAccount(
        this.openAccount.firstName,
        this.openAccount.lastName,
        dateOfBirth,
        this.openAccount.gender,
        this.openAccount.address,
        this.openAccount.city,
        this.openAccount.emailAddress,
        this.openAccount.password,
      )
      .subscribe({
        next: (data: any) => {
          this.router.navigate(['login']);
          this.toastr.success('Account Opened Successfully');
        },
        error: (e: HttpErrorResponse) => {
          this.toastr.error(
            'Oops! Something went wrong while creating account.',
          );
        },
      });
  }
}
