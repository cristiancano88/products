import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/product.mode';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  constructor(private _productsService: ProductsService) {}

  products: Product[] = [];

  ngOnInit(): void {
    this._getProducts();
  }

  private _getProducts(): void {
    this._productsService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }
}
