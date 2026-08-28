import { AbstractControl, ValidatorFn } from '@angular/forms';

export function latitudValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const num = Number(value);
    if (Number.isNaN(num)) {
      return { noNumerico: true };
    }
    if (num < -90 || num > 90) {
      return { fueraRango: { min: -90, max: 90 } };
    }
    return null;
  };
}

export function longitudValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const num = Number(value);
    if (Number.isNaN(num)) {
      return { noNumerico: true };
    }
    if (num < -180 || num > 180) {
      return { fueraRango: { min: -180, max: 180 } };
    }
    return null;
  };
}
