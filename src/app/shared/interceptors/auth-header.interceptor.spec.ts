import { HTTP_INTERCEPTORS, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { amplifySharedServiceMock } from './../../../test/mocks/services/amplify-shared.service.mock';
import { AmplifySharedService } from './../service/amplify-shared.service';
import { AuthHeaderInterceptor } from './auth-header.interceptor';

describe('AuthHeaderInterceptor', () => {
  let interceptor: AuthHeaderInterceptor;
  let request: any;
  let next: any;

  const router = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthHeaderInterceptor,
        { provide: Router, useValue: router },
        { provide: AmplifySharedService, useValue: amplifySharedServiceMock },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthHeaderInterceptor,
          multi: true,
        },
      ],
    });

    interceptor = TestBed.inject(AuthHeaderInterceptor);
    request = new HttpRequest<any>(
      'GET',
      'http://api.orchestractor.com/apiurlget'
    );
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
