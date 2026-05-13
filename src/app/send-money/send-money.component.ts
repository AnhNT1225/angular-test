import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TransactionService } from 'src/app/services/transaction.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Account } from '../dto/types';
import { AuthenticationService } from '../services/authentication.service';
import { BeneficiaryService } from 'src/app/services/beneficiary.service';
import { Store } from '@ngrx/store';
import { updateBalance } from 'src/app/state/balance.actions';

@Component({
  selector: 'app-send-money',
  templateUrl: './send-money.component.html',
  styleUrls: ['./send-money.component.scss'],
})
export class SendMoneyComponent {
  public isAuth: boolean = false;
  public account?: Account;
  public accountId!: number;
  public sendMoneyForm!: FormGroup;
  public beneficiaryList!: Array<any>;
  public loader: boolean = false;

  constructor(
    private toastr: ToastrService,
    private transactionService: TransactionService,
    private authenticationService: AuthenticationService,
    private beneficiaryService: BeneficiaryService,
    private store: Store<any>,
  ) {
    this.authenticationService.isAuthenticate().subscribe((status: boolean) => {
      this.isAuth = status;
    });

    this.authenticationService.account().subscribe((account: Account) => {
      this.account = account;
      this.accountId = account.accountId;
      this.store.dispatch(updateBalance({ balance: Number(account.balance) }));
    });
  }

  ngOnInit() {
    this.sendMoneyForm = new FormGroup({
      toAccountId: new FormControl('', Validators.required),
      transferAmount: new FormControl(null, Validators.required),
    });
    this.getAllBeneficiaries();
  }

  getAllBeneficiaries() {
    this.beneficiaryService.getAllBeneficiaries().subscribe({
      next: (data: any) => {
        const uniqueBeneficiaries = Array.from(
          new Map(
            data.map((item: any) => [item['beneficiaryAccountId'], item]),
          ).values(),
        );
        this.beneficiaryList = uniqueBeneficiaries;
      },
      error: (e: HttpErrorResponse) => {
        this.toastr.error(
          'Oops! Something went wrong while fetching all beneficiaries.',
        );
      },
      complete: () => {},
    });
  }

  onBeneficiarySelectChange(event: Event) {
    const selectedBeneficiaryAccount = (event.target as HTMLSelectElement)
      .value;
    this.sendMoneyForm
      .get('toAccountId')
      ?.setValue(Number(selectedBeneficiaryAccount));
  }

  getFormControlError(fieldName: string): string {
    const field = this.sendMoneyForm.get(fieldName);
    if (field && field.touched && field.invalid) {
      if (field.errors?.['required']) {
        if (fieldName === 'toAccountId') {
          return 'Please add account number. it is required.';
        }
        if (fieldName === 'transferAmount') {
          return 'Please add transfer amount. It is required.';
        }
      }
    }
    return '';
  }

  onSubmit() {
    if (this.sendMoneyForm.invalid) {
      this.toastr.error('Please fill in all the required fields.');
      return;
    }
    this.loader = true;

    const delayInMilliseconds = 2000;

    setTimeout(() => {
      this.transactionService
        .sendMoney(
          this.accountId,
          this.sendMoneyForm.get('toAccountId')!.value,
          this.sendMoneyForm.get('transferAmount')!.value,
        )
        .subscribe({
          next: (data: any) => {
            console.log(data);
          },
          error: (e: HttpErrorResponse) => {
            if (e.status === 401) {
              this.toastr.error(
                'Invalid account number. Please enter valid account number.',
              );
            } else {
              this.toastr.error(
                'Oops! Something went wrong while sending money.',
              );
            }
            this.loader = false;
          },
          complete: () => {
            const balance =
              Number(this.account?.balance) -
              this.sendMoneyForm.get('transferAmount')!.value;
            this.store.dispatch(updateBalance({ balance: balance }));

            this.loader = false;
            this.toastr.success('Money Sent Successfully');
            this.sendMoneyForm.reset();
          },
        });
    }, delayInMilliseconds);
  }
}
