import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.mode';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private productsUrl = environment.productsUrl;

  constructor(private _http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this._http.get<Product[]>(`${this.productsUrl}/bp/products`);
  }
}
