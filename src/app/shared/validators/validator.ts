import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, map } from 'rxjs';
import { ProductsService } from 'src/app/shared/services/products.service';

export class ProductValidator {
  static idValidator(productsService: ProductsService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return productsService
        .idVerification(control.value)
        .pipe(map((result: boolean) => (result ? { idExists: true } : null)));
    };
  }
}
