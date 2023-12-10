import { of } from 'rxjs';
import { productMock } from './mocks/product.mock';

export const productsServiceMock = {
  getProducts: jest.fn().mockReturnValue(of([productMock])),

  createProduct: jest.fn().mockReturnValue(of(productMock)),

  idVerification: jest.fn().mockReturnValue(of(true)),
};
