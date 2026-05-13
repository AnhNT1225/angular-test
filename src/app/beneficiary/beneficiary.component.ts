import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BeneficiaryService } from '../../app/services/beneficiary.service';
import { AuthenticationService } from '../../app/services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Account } from '../dto/types';
import {
  AppTheme,
  DarkThemeSelectorService,
} from '../services/themeToggle.service';

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.scss'],
})
export class BeneficiaryComponent {
  public isAuth: boolean = false;
  public account?: Account;
  public accountId!: number;
  public beneficiaryForm!: FormGroup;
  public beneficiaryList!: Array<any>;
  public beneficiaryIdList: Array<any> = []; // To store the beneficiary IDs for the dropdown
  public filteredBeneficiaryList: Array<any> = [];
  public showDropdown: boolean = false;
  public isDarkMode: boolean = false;

  constructor(
    private toastr: ToastrService,
    private beneficiaryService: BeneficiaryService,
    private authenticationService: AuthenticationService,
    private darkThemeSelectorService: DarkThemeSelectorService, // Injected here
  ) {
    this.authenticationService.isAuthenticate().subscribe((status: boolean) => {
      this.isAuth = status;
    });

    this.authenticationService.account().subscribe((account: Account) => {
      this.account = account;
      this.accountId = account.accountId;
    });
  }

  ngOnInit() {
    // Set isDarkMode to always false
    this.isDarkMode = false;

    this.beneficiaryForm = new FormGroup({
      beneficiaryAccountId: new FormControl(null, Validators.required),
    });

    this.getAllBeneficiaries();
    this.getBeneficiaryIds();
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
    });
  }

  getBeneficiaryIds() {
    this.beneficiaryService.getAllBeneficiaryIds().subscribe({
      next: (data: any) => {
        this.beneficiaryIdList = data;
        this.filteredBeneficiaryList = data;
      },
      error: (e: HttpErrorResponse) => {
        this.toastr.error(
          'Oops! Something went wrong while fetching beneficiary IDs.',
        );
      },
    });
  }

  filterDropdown(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredBeneficiaryList = this.beneficiaryIdList.filter((item: any) =>
      item.beneficiary.toLowerCase().includes(query),
    );
  }

  selectBeneficiary(beneficiary: any) {
    this.beneficiaryForm
      .get('beneficiaryAccountId')
      ?.setValue(beneficiary.beneficiary);
    this.showDropdown = false; // Hide dropdown after selection
  }

  onSubmit() {
    if (this.beneficiaryForm.invalid) {
      return;
    }

    const beneficiaryAccountId = this.beneficiaryForm.get(
      'beneficiaryAccountId',
    )!.value;
    this.beneficiaryService
      .storeBeneficiary(this.accountId, beneficiaryAccountId)
      .subscribe({
        next: (data: any) => {
          this.getAllBeneficiaries();

          this.beneficiaryForm.reset();
        },
        error: (e: HttpErrorResponse) => {
          this.toastr.error(
            'Oops! Something went wrong while adding beneficiary',
          );
        },
      });
  }
}
