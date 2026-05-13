import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from '../../app/environments/environment';
import { tap, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { updateBalance } from '../../app/state/balance.actions';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  public apiUrl: string;

  constructor(
    private httpService: HttpService,
    private store: Store<any>,
    private authenticationService: AuthenticationService,
  ) {
    this.apiUrl = environment.API_URL;
  }

  public sendMoney(
    fromAccountId: number,
    toAccountId: number,
    transferAmount: number,
  ) {
    return this.httpService
      .post(
        `${this.apiUrl}/api/core-banking/transaction`,
        {
          fromAccountId,
          toAccountId,
          transferAmount,
        },
        { withCredentials: true },
      )
      .pipe(
        switchMap((transactionResponse) => {
          // After transaction, get the latest account details
          return this.httpService
            .get(`${this.apiUrl}/api/core-banking/account/${fromAccountId}`, {
              withCredentials: true,
            })
            .pipe(
              tap((accountResponse: any) => {
                if (accountResponse && accountResponse.balance !== undefined) {
                  // Update both the authentication service and store
                  this.authenticationService.accountDetail.next(
                    accountResponse,
                  );
                  this.store.dispatch(
                    updateBalance({ balance: Number(accountResponse.balance) }),
                  );
                }
              }),
            );
        }),
      );
  }

  public transactionHistory(
    accountId: number,
    fromDate: string,
    toDate: string,
  ) {
    return this.httpService.get(
      `${this.apiUrl}/api/core-banking/transaction/transactionHistory?accountId=${accountId}&fromDate=${fromDate}&toDate=${toDate}`,
      { withCredentials: true },
    );
  }
}
