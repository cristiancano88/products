import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { productMock } from './../../../../test/services/mocks/product.mock';
import { productsServiceMock } from './../../../../test/services/products.service.mock';
import { ProductsService } from './../../../shared/services/products.service';
import { ProductComponent } from './product.component';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  const router = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: Router,
          useValue: router,
        },
        { provide: ProductsService, useValue: productsServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
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

  describe('#ngOnInit', () => {
    it('should create the subscriptions for the dateRelease control', () => {
      jest.spyOn<any, string>(component, '_dateRelaseSubscriptions');
      jest
        .spyOn<any, string>(component, '_updateDateRevison')
        .mockImplementation(() => {});

      component.ngOnInit();

      expect(component['_dateRelaseSubscriptions']).toHaveBeenCalled();
    });

    it('should update the value and disable the dateRevision control', () => {
      jest
        .spyOn<any, string>(component, '_updateDateRevison')
        .mockImplementation(() => {});

      component.ngOnInit();

      expect(component['_updateDateRevison']).toHaveBeenCalledWith(
        component.currentDate.toISOString().slice(0, 10)
      );
      expect(component.productForm.get('date_revision')?.disabled).toBe(true);
    });
  });

  it('should update #DateRevision when the dateRelease control changes', () => {
    jest
      .spyOn<any, string>(component, '_updateDateRevison')
      .mockImplementation(() => {});

    component['_dateRelaseSubscriptions']();
    component.productForm.get('date_release')?.setValue('2021-01-01');

    expect(component['_updateDateRevison']).toHaveBeenCalledWith('2021-01-01');
  });

  it('should update #DateRevision control with one more year', () => {
    const currentDate = '2023-12-30';
    const oneYearLater = '2024-12-30';

    component['_updateDateRevison'](currentDate);

    expect(component.productForm.get('date_revision')?.value).toBe(
      oneYearLater
    );
  });

  it('should reset the form', () => {
    jest.spyOn<any, string>(component.productForm, 'reset');

    component.productForm.get('id')?.setValue('abc');
    component.productForm.get('name')?.setValue('product 1');
    component.resetForm();

    expect(component.productForm.reset).toHaveBeenCalled();
    expect(component.productForm.get('id')?.value).toBe(null);
    expect(component.productForm.get('name')?.value).toBe(null);
  });

  describe('#onCreateProduct', () => {
    it('should not create product if the form is invalid', () => {
      jest.spyOn<any, string>(component['_router'], 'navigate');

      component.productForm.get('id')?.setValue('11');
      component.onCreateProduct();

      expect(
        component['_productsService'].createProduct
      ).not.toHaveBeenCalledWith(productMock);
      expect(component['_router'].navigate).not.toHaveBeenCalledWith([
        '/products',
      ]);
    });

    it('should create product', () => {
      jest.spyOn<any, string>(component['_router'], 'navigate');

      component.productForm.get('id')?.setValue(productMock.id);
      component.productForm.get('name')?.setValue(productMock.name);
      component.productForm
        .get('description')
        ?.setValue(productMock.description);
      component.productForm.get('logo')?.setValue(productMock.logo);
      component.productForm
        .get('date_release')
        ?.setValue(productMock.date_release);
      component.productForm
        .get('date_revision')
        ?.setValue(productMock.date_revision);
      component.onCreateProduct();

      expect(component['_productsService'].createProduct).toHaveBeenCalledWith(
        productMock
      );
      expect(component['_router'].navigate).toHaveBeenCalledWith(['/products']);
    });
  });
});
