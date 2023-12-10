import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
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
}
