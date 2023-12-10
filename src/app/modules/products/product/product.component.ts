import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MAX_LENGTH_ID, MIN_LENGTH_ID } from 'src/app/shared/constants/lengths';
import { Product } from 'src/app/shared/models/product.mode';
import { ProductsService } from 'src/app/shared/services/products.service';
import { ProductValidator } from '../../../shared/validators/validator';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {
  private takeUntil$ = new Subject<boolean>();

  productForm: FormGroup;

  constructor(
    private _productsService: ProductsService,
    private _formBuilder: FormBuilder,
    private _router: Router
  ) {
    this.productForm = this._formBuilder.group({
      id: [
        null,
        [
          Validators.required,
          Validators.minLength(MIN_LENGTH_ID),
          Validators.maxLength(MAX_LENGTH_ID),
        ],
        [ProductValidator.idValidator(this._productsService)],
      ],
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: [null, [Validators.required]],
      date_release: [null, [Validators.required]],
      date_revision: [null, [Validators.required]],
    });
  }

  ngOnDestroy() {
    this.takeUntil$.next(false);
    this.takeUntil$.complete();
  }

  ngOnInit(): void {}

  get id() {
    return this.productForm.get('id');
  }

  get name() {
    return this.productForm.get('name');
  }

  get description() {
    return this.productForm.get('description');
  }

  get logo() {
    return this.productForm.get('logo');
  }

  get dateRelease() {
    return this.productForm.get('date_release');
  }

  get dateRevision() {
    return this.productForm.get('date_revision');
  }

  resetForm(): void {
    this.productForm.reset();
  }

  onCreateProduct(): void {
    if (this.productForm.invalid) {
      return;
    }

    console.log(this.productForm.value);

    this._productsService
      .createProduct(this.productForm.value)
      .pipe(takeUntil(this.takeUntil$))
      .subscribe({
        next: (product: Product) => {
          console.log(product);
          this._router.navigate(['/products']);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
