import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductValidator } from '../../../shared/validators/validator';
import {
  MAX_LENGTH_ID,
  MIN_LENGTH_ID,
} from './../../../shared/constants/lengths';
import { Product } from './../../../shared/models/product.mode';
import { ProductsService } from './../../../shared/services/products.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {
  private _takeUntil$ = new Subject<boolean>();

  productForm: FormGroup;

  currentDate = new Date();

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
      date_release: [
        this.currentDate.toISOString().slice(0, 10),
        [
          Validators.required,
          ProductValidator.minDateValidator(this.currentDate),
        ],
      ],
      date_revision: [this.currentDate, [Validators.required]],
    });
  }

  ngOnDestroy() {
    this._takeUntil$.next(false);
    this._takeUntil$.complete();
  }

  ngOnInit(): void {
    this._dateRelaseSubscriptions();
    this._updateDateRevison(this.currentDate.toISOString().slice(0, 10));
    this.productForm.get('date_revision')?.disable();
  }

  private _dateRelaseSubscriptions(): void {
    this.productForm
      .get('date_release')
      ?.valueChanges.pipe(takeUntil(this._takeUntil$))
      .subscribe((date: string) => {
        if (date) {
          this._updateDateRevison(date);
        }
      });
  }

  private _updateDateRevison(date: string) {
    const oneYearLater = new Date(date);
    oneYearLater.setFullYear(this.currentDate.getFullYear() + 1);

    this.productForm
      .get('date_revision')
      ?.setValue(oneYearLater.toISOString().slice(0, 10));
  }

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

    this.productForm.get('date_revision')?.enable();

    this._productsService
      .createProduct(this.productForm.value)
      .pipe(takeUntil(this._takeUntil$))
      .subscribe((product: Product) => {
        this._router.navigate(['/products']);
      });

    this.productForm.get('date_revision')?.disable();
  }
}
