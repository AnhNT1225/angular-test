import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { applicantFields, FormField } from './form-fields.helper';

@Component({
  selector: 'apply-loan',
  templateUrl: './apply-loan.component.html',
  styleUrls: ['./apply-loan.component.scss'],
})
export class ApplyLoanComponent {
  dynamicForm!: FormGroup;
  applicantFields = applicantFields;
  steps: any = [];
  currentStep = 0;
  categories = ['Personal Info', 'Contact Info', 'Loan Details'];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.dynamicForm = this.fb.group({});
  }

  createFormControls() {}

  getErrrorMessage(fieldName: string) {
    const control = this.dynamicForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('email')) {
      return 'Enter a valid email address';
    }
    if (control?.hasError('min')) {
      return 'Enter a valid number';
    }
    if (control?.hasError('panInvalid')) {
      return 'Enter a valid PAN number';
    }
    return '';
  }

  createSteps() {}

  getValidators(validatorNames: string[]) {}

  panValidator(control: any) {
    return { panInvalid: false };
  }

  nextStep() {
    // add login to take next step
  }

  previousStep() {
    // add logic to go to previous step
  }

  isStepComplete(stepIndex: number): boolean {
    const stepFields: FormField[] = this.steps[stepIndex].fields;
    return stepFields.every((field) => this.dynamicForm.get(field.name)?.valid);
  }

  onSubmit() {
    if (this.dynamicForm.valid) {
      console.log(this.dynamicForm.value);
    }
  }
  getOptions(optionType: string) {
    return [''];
  }
  getJson(value: any) {
    return JSON.stringify(value, null, 2);
  }
}
