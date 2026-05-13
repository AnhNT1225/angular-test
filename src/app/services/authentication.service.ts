import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { Account } from '../../app/dto/types';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public loggedIn = new BehaviorSubject<boolean>(false);
  public accountDetail = new BehaviorSubject<any>(null);

  private ACCOUNT_KEY = 'account';
  private AUTH_KEY = 'token';

  constructor(private cookieService: CookieService) {
    this.loggedIn.next(this.getToken() ? true : false);
    this.accountDetail.next(this.getAccount());
  }

  public getToken() {
    return localStorage.getItem(this.AUTH_KEY);
  }

  public setToken(name: string, token: string) {
    localStorage.setItem(this.AUTH_KEY, token);
    this.loggedIn.next(true);
  }

  public setAccount(account: Account) {
    this.cookieService.set(this.ACCOUNT_KEY, JSON.stringify(account));
    this.accountDetail.next(account);
  }

  public getAccount() {
    let account = this.cookieService.get(this.ACCOUNT_KEY);
    return account ? JSON.parse(account) : null;
  }

  public account() {
    return this.accountDetail.asObservable();
  }

  public isAuthenticate() {
    return this.loggedIn.asObservable();
  }

  public logout() {
    localStorage.removeItem(this.AUTH_KEY);
    this.loggedIn.next(false);
  }
}
