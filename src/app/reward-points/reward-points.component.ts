import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { updateBalance } from 'src/app/state/balance.actions';
import { RewardPointsService } from '../services/rewardPoints.services';

@Component({
  selector: 'app-reward-points',
  templateUrl: './reward-points.component.html',
  styleUrls: ['./reward-points.component.scss'],
})
export class RewardPointsComponent {
  rewardPoints: number = 0;
  redemptionAmount: number = 0;
  balance: number = 0;

  constructor(
    private store: Store<any>,
    private rewardPointsService: RewardPointsService,
  ) {
    this.store.select('balance').subscribe((store) => {
      this.balance = this.rewardPointsService.getBalanceFromStore(store);
    });

    this.getRewardPoints();
  }

  getRewardPoints() {
    this.rewardPointsService.getRewardPoints().then((rewardPoints: number) => {
      this.rewardPoints = rewardPoints;
    });
  }

  getErrorMessage() {
    //  redemptionAmount only accept multiples of 200
    if (this.redemptionAmount % 200 !== 0) {
      return 'Amount must be a multiple of 200';
    }
    //  redemptionAmount must be less than rewardPoints
    if (this.redemptionAmount > this.rewardPoints) {
      return 'Amount must be less than reward points';
    }
    return '';
  }

  redeemPoints() {
    //  redemptionAmount only accept multiples of 200
    if (this.redemptionAmount % 200 !== 0) {
      return;
    }
    //  redemptionAmount must be less than rewardPoints
    if (this.redemptionAmount > this.rewardPoints) {
      return;
    }
    const newBalance = this.rewardPointsService.updateBalance(
      this.balance,
      this.redemptionAmount,
    );
    this.store.dispatch(updateBalance({ balance: newBalance }));
    this.redemptionAmount = 0;
    this.getRewardPoints();
  }
}
