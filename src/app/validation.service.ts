import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  checkPhone(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const phoneRegex = /^[0-9]{10}$/;
      const valid = phoneRegex.test(control.value);
      return valid ? null : { invalidPhone: true };
    };
  }
  
  checkEmail(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const valid = emailRegex.test(control.value);
      return valid ? null : { invalidEmail: true };
    };
  }
}
