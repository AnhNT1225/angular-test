import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { Account, Transaction } from 'src/app/dto/types';
import * as dayjs from 'dayjs';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  public account?: Account;
  public accountId!: number;
  public formatedDob?: string;
  public formatedAccountId?: string;
  public transactionsList: Transaction[] = [];
  public fromDate!: string;
  public toDate!: string;

  constructor(
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private transactionService: TransactionService,
  ) {}

  ngOnInit(): void {
    this.getUserAccount();
  }

  getUserAccount() {
    this.authenticationService.account().subscribe((account: Account) => {
      this.account = account;
      this.accountId = account.accountId;
      this.formatedDob = dayjs(this.account?.dob).format('DD-MM-YYYY');
      this.formatedAccountId =
        'xxxxxx' + this.account?.accountId.toString().slice(-4);
      this.fromDate = dayjs().subtract(7, 'day').format('YYYY-MM-DD'); // Set default value to 7 days ago
      this.toDate = dayjs().format('YYYY-MM-DD'); //
      this.getTransactions();
    });
  }

  getTransactions() {
    this.transactionService
      .transactionHistory(this.accountId, this.fromDate, this.toDate)
      .subscribe({
        next: (data: any) => {
          this.transactionsList = [];
          setTimeout(() => {
            // Using the same sorting logic as the transaction history page
            this.transactionsList = data.sort(
              (a: Transaction, b: Transaction) => {
                return (
                  new Date(b.dateCreated).getTime() -
                  new Date(a.dateCreated).getTime()
                );
              },
            );
          }, 100);
        },
        error: (e: HttpErrorResponse) => {
          this.toastr.error(
            'Oops! Something went wrong while fetching all transactions.',
          );
        },
        complete: () => {},
      });
  }
  numberFormat(value: string | number | undefined) {
    if (!value) return '0.00';
    if (typeof value === 'string') {
      return Number(value).toFixed(2);
    }
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return '0.00';
  }
}
