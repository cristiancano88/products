import { HttpClient, HttpParams } from '@angular/common/http';
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

  createProduct(product: Product): Observable<Product> {
    return this._http.post<Product>(`${this.productsUrl}/bp/products`, product);
  }

  idVerification(id: string): Observable<boolean> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('id', id);

    return this._http.get<boolean>(
      `${this.productsUrl}/bp/products/verification`,
      { params: queryParams }
    );
  }
}
