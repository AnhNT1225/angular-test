import { Component } from '@angular/core';
import { MenuList, Account } from 'src/app/dto/types';
import { menuList } from 'src/app/menu';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { updateBalance } from 'src/app/state/balance.actions';
import {
  AppTheme,
  DarkThemeSelectorService,
} from 'src/app/services/themeToggle.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  public showMenu: Boolean = false;
  public menuList: MenuList[];
  public currentUrl?: string;
  public isAuth: boolean = false;
  public account?: Account;
  public balance: Number = 0;
  public isDarkMode: boolean = false;
  public themeText = '';

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private authenticationService: AuthenticationService,
    private store: Store<any>,
    protected darkThemeSelectorService: DarkThemeSelectorService,
  ) {
    this.menuList = menuList;
    this.authenticationService.isAuthenticate().subscribe((status: boolean) => {
      this.isAuth = status;
    });

    this.authenticationService.account().subscribe((account: Account) => {
      this.account = account;
      this.store.dispatch(updateBalance({ balance: Number(account.balance) }));
      this.balance = Number(account.balance);
    });
  }
  getBalance() {}

  ngOnInit() {
    // Always set to light theme
    this.isDarkMode = false;
    this.themeText = 'Light';
    this.darkThemeSelectorService.setLightTheme();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
    this.currentUrl = this.router.url;
  }

  toggleNavbar() {
    this.showMenu = !this.showMenu;
  }
  handleToggleTheme() {
    // Always ensure light theme
    this.darkThemeSelectorService.setLightTheme();
    this.isDarkMode = false;
  }

  logout() {
    const res = this.authService.logout().subscribe({
      next: (data: any) => {
        console.log(data);
        this.authenticationService.logout();
      },
      error: (e: HttpErrorResponse) => {
        this.toastr.error('Oops! Something went wrong while logout user');
      },
      complete: () => {
        this.toastr.success('Logout Successful');
        this.router.navigate(['login']);
      },
    });
  }
  numberFormat(value: any) {
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
