import { Component } from '@angular/core';

import { AuthenticationService } from '../services/authentication.service';
import { Account } from 'src/app/dto/types';
import * as dayjs from 'dayjs';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  public isAuth: boolean = false;
  public account?: Account;
  public accountId!: number;
  public formatedDob?: string;
  public copyState: boolean = false;
  // public formatedAccountId?: string;

  constructor(
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private clipboardService: ClipboardService,
  ) {}

  ngOnInit(): void {
    this.authenticationService.isAuthenticate().subscribe((status: boolean) => {
      this.isAuth = status;
    });

    this.authenticationService.account().subscribe((account: Account) => {
      this.account = account;
      this.accountId = account.accountId;
      this.formatedDob = dayjs(this.account?.dob).format('DD-MM-YYYY');
      // this.formatedAccountId = "xxxxxx" + this.account?.accountId.toString().slice(-4)
    });
  }

  copyAccountId() {
    console.log('test');
    this.clipboardService.copyFromContent(this.accountId.toString());
    this.copyState = true;
    setTimeout(() => {
      this.copyState = false;
    }, 1000);
    this.toastr.success('Account Number Copied Successfully');
  }
}
