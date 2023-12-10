import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Product } from '../models/product.mode';
import { environment } from './../../../environments/environment';
import { productMock } from './../../../test/services/mocks/product.mock';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpTestingController: HttpTestingController;
  const productsUrl = environment.productsUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ProductsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get products', (done) => {
    service.getProducts().subscribe((response: Product[]) => {
      expect(response).toStrictEqual([productMock]);
      done();
    });

    const request = httpTestingController.expectOne(
      `${productsUrl}/bp/products`
    );
    expect(request.request.method).toEqual('GET');

    request.flush([productMock]);
  });

  it('should create product', (done) => {
    service.createProduct(productMock).subscribe((response: Product) => {
      expect(response).toStrictEqual(productMock);
      done();
    });

    const request = httpTestingController.expectOne(
      `${productsUrl}/bp/products`
    );
    expect(request.request.method).toEqual('POST');

    request.flush(productMock);
  });

  it('should validate id', (done) => {
    const id = '123456';
    service.idVerification(id).subscribe((response: boolean) => {
      expect(response).toBe(false);
      done();
    });

    const request = httpTestingController.expectOne(
      `${productsUrl}/bp/products/verification?id=${id}`
    );
    expect(request.request.method).toEqual('GET');

    request.flush(false);
  });
});
