import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Observable, map, of } from 'rxjs';
import { ProductsService } from 'src/app/shared/services/products.service';
import { MAX_LENGTH_ID, MIN_LENGTH_ID } from '../constants/lengths';

export class ProductValidator {
  static idValidator(productsService: ProductsService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (
        control.value.length >= MIN_LENGTH_ID &&
        control.value.length <= MAX_LENGTH_ID
      ) {
        return productsService
          .idVerification(control.value)
          .pipe(map((result: boolean) => (result ? { idExists: true } : null)));
      } else {
        return of(null);
      }
    };
  }

  static minDateValidator(minDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const date = new Date(control.value);
      const minimumDate = new Date(minDate.toISOString().slice(0, 10));

      if (date.getTime() >= minimumDate.getTime()) {
        return null;
      } else {
        return { min: { value: control.value, expected: minDate } };
      }
    };
  }
}
