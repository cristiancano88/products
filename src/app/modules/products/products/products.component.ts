import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  startWith,
  takeUntil,
} from 'rxjs';
import { Product } from './../../../shared/models/product.mode';
import { ProductsService } from './../../../shared/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  private _takeUntil$ = new Subject<boolean>();

  private _initialProducts: Product[] = [];

  products: Product[] = [];

  searchByNameControl = new FormControl('');

  selectedAmount: number = 5;

  constructor(private _productsService: ProductsService) {}

  ngOnDestroy() {
    this._takeUntil$.next(false);
    this._takeUntil$.complete();
  }

  ngOnInit(): void {
    this._searchProductByName();
    this._getProducts();
  }

  private _searchProductByName(): void {
    const DEBOUNCE_TIME = 500;

    this.searchByNameControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(DEBOUNCE_TIME),
        distinctUntilChanged(),
        takeUntil(this._takeUntil$)
      )
      .subscribe((criteria: any) => {
        this.products = [...this._initialProducts].filter(
          (producto: Product) =>
            JSON.stringify(producto)
              .toLowerCase()
              .indexOf(criteria.toLowerCase()) !== -1
        );
        this.onShowElementsBySelectedAmount(this.products);
      });
  }

  private _getProducts(): void {
    this._productsService
      .getProducts()
      .pipe(takeUntil(this._takeUntil$))
      .subscribe((products: Product[]) => {
        this._initialProducts = products;
      });
  }

  onShowElementsBySelectedAmount(products?: Product[]): void {
    const items = products ?? [...this._initialProducts];
    this.products = [...items].slice(0, Number(this.selectedAmount));
  }
}
