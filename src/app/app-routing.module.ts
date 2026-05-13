import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './login/login.component';
import { SendMoneyComponent } from './send-money/send-money.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionComponent } from './transaction/transaction.component';
import { CardsComponent } from './cards/cards.component';
import { AuthGuard } from './guards/auth.guard';
import { BeneficiaryComponent } from './beneficiary/beneficiary.component';
import { ProfileComponent } from './profile/profile.component';
import { RewardPointsComponent } from './reward-points/reward-points.component';
import { ApplyLoanComponent } from './apply-loan/apply-loan.component';

const routes: Routes = [
  { path: 'open-account', component: AccountComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'send-money',
    component: SendMoneyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'transaction',
    component: TransactionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'beneficiary',
    component: BeneficiaryComponent,
    canActivate: [AuthGuard],
  },
  { path: 'cards', component: CardsComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'reward-points',
    component: RewardPointsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'apply-loan',
    component: ApplyLoanComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
