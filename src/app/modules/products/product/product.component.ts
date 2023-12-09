import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/shared/models/product.mode';
import { ProductsService } from 'src/app/shared/services/products.service';
import { ProductValidator } from '../../../shared/validators/validator';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
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
          Validators.minLength(3),
          Validators.maxLength(10),
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

    this._productsService.createProduct(this.productForm.value).subscribe({
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
