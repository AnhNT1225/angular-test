import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RewardPointsService {
  public apiUrl: string;
  private rewardPoints: number = 2540;

  constructor(private httpService: HttpService) {
    this.apiUrl = environment.API_URL;
  }

  public getRewardPoints(): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.rewardPoints);
      }, 1000);
    });
  }

  public redeemPoints(amount: number) {}

  public getErrorMessage(amount: number, rewardPoints: number) {
    //  redemptionAmount only accept multiples of 200
    if (amount % 200 !== 0) {
      return 'Amount must be a multiple of 200';
    }
    //  redemptionAmount must be less than rewardPoints
    if (amount > rewardPoints) {
      return 'Amount must be less than reward points';
    }
    return '';
  }

  public updateBalance(balance: number, redemptionAmount: number) {
    this.rewardPoints = this.rewardPoints - redemptionAmount;
    return balance + redemptionAmount / 200;
  }

  public getRewardPointsFromStore(store: any) {
    return store.rewardPoints;
  }

  public getBalanceFromStore(store: any) {
    return store.balance;
  }

  public updateRewardPoints(rewardPoints: number, redemptionAmount: number) {
    return rewardPoints - redemptionAmount;
  }
}
