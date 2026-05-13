import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './login/login.component';
import { SendMoneyComponent } from './send-money/send-money.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionComponent } from './transaction/transaction.component';
import { BeneficiaryComponent } from './beneficiary/beneficiary.component';
import { DragDropDirective } from './services/drag-drop.directive'; // drag-drop directive for beneficiary component list
import { CardsComponent } from './cards/cards.component';
import { AuthGuard } from './guards/auth.guard';
import { CookieService } from 'ngx-cookie-service';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from './profile/profile.component';
import { ClipboardModule } from 'ngx-clipboard';
import { StoreModule } from '@ngrx/store';
import { balanceReducer } from './state/balance.reducer';
import { RewardPointsComponent } from './reward-points/reward-points.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { ApplyLoanComponent } from './apply-loan/apply-loan.component';
import { DonationsComponent } from './donations/donations.component';

@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    LoginComponent,
    SendMoneyComponent,
    NavbarComponent,
    DashboardComponent,
    TransactionComponent,
    CardsComponent,
    BeneficiaryComponent,
    DragDropDirective,
    ProfileComponent,
    RewardPointsComponent,
    ApplyLoanComponent,
    DonationsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgbCollapseModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      enableHtml: true,
    }),
    NgbDatepickerModule,
    ClipboardModule,
    StoreModule.forRoot({ balance: balanceReducer }, {}),
  ],
  providers: [
    AuthGuard,
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent, BeneficiaryComponent],
  // bootstrap:[BeneficiaryComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
