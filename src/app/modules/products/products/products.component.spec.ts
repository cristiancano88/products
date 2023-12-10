import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { productMock } from './../../../../test/services/mocks/product.mock';
import { productsServiceMock } from './../../../../test/services/products.service.mock';
import { ProductsService } from './../../../shared/services/products.service';
import { ProductsComponent } from './products.component';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [{ provide: ProductsService, useValue: productsServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should destroy the component and subscriptions', () => {
    jest.spyOn<any, string>(component['_takeUntil$'], 'next');
    jest.spyOn<any, string>(component['_takeUntil$'], 'complete');

    component.ngOnDestroy();

    expect(component['_takeUntil$'].next).toHaveBeenCalledWith(false);
    expect(component['_takeUntil$'].complete).toHaveBeenCalled();
  });

  it('should get products from the beginning', () => {
    jest.spyOn<any, string>(component, '_getProducts');
    component.ngOnInit();
    expect(component['_getProducts']).toHaveBeenCalled();
  });

  it('should execute #_searchProductByName from the beginning', () => {
    jest
      .spyOn<any, string>(component, '_searchProductByName')
      .mockImplementation(() => {});

    component.ngOnInit();

    expect(component['_searchProductByName']).toHaveBeenCalled();
  });

  it('should search products by criteria of name', fakeAsync(() => {
    jest.spyOn<any, string>(component, 'onShowElementsBySelectedAmount');
    component['_initialProducts'] = [
      { ...productMock, name: 'aaa' },
      { ...productMock, name: 'bbb' },
      { ...productMock, name: 'ccc' },
    ];
    component.products = [...component['_initialProducts']];
    component['_searchProductByName']();

    const criteriaProduct = 'aa';
    component.searchByNameControl.setValue(criteriaProduct);
    tick(500);

    expect(component.products.length).toBe(1);
    expect(component.products[0].name).toBe('aaa');
    expect(component.onShowElementsBySelectedAmount).toHaveBeenCalled();
  }));

  it('should get products from the service', () => {
    component['_getProducts']();

    expect(component['_productsService'].getProducts).toHaveBeenCalled();
    expect(component['_initialProducts'].length).toBe(1);
  });

  it('should show N elements of products', () => {
    component['_initialProducts'] = [productMock, productMock, productMock];
    component.products = [...component['_initialProducts']];
    component.selectedAmount = 1;
    component.onShowElementsBySelectedAmount();

    expect(component.products.length).toBe(1);
    expect(component['_initialProducts'].length).toBe(3);
  });
});
