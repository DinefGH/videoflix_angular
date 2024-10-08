import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';  
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { CsrfInterceptor } from './csrf-interceptor.service';  



/**
 * Test Suite for CsrfInterceptor
 *
 * This suite tests the behavior of the `CsrfInterceptor`, ensuring that it adds
 * the `X-CSRFToken` header to outgoing HTTP requests (like POST) when required,
 * and that it doesn't add the header for requests like GET or when the CSRF token
 * is missing from the cookies.
 */
describe('CsrfInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  const mockCsrfToken = 'mock-csrf-token';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: CsrfInterceptor,
          multi: true
        }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);

    Object.defineProperty(document, 'cookie', {
      value: `csrftoken=${mockCsrfToken}`,
      writable: true, 
    });
  });

  afterEach(() => {
    httpMock.verify();  
  });


  /**
   * Test Case: Should add X-CSRFToken header for POST requests
   * 
   * This test verifies that when a POST request is made, the interceptor adds 
   * the `X-CSRFToken` header to the request and that the correct CSRF token from 
   * the cookie is attached.
   */
  it('should add X-CSRFToken header for POST requests', () => {
    httpClient.post('/test', {}).subscribe();

    const httpRequest = httpMock.expectOne('/test');

    expect(httpRequest.request.headers.has('X-CSRFToken')).toBeTrue();
    expect(httpRequest.request.headers.get('X-CSRFToken')).toBe(mockCsrfToken);

    httpRequest.flush({});
  });



  /**
   * Test Case: Should not add X-CSRFToken header for GET requests
   * 
   * This test ensures that the CSRF token header is not added to GET requests,
   * as the interceptor should only attach the header to state-changing requests (e.g., POST).
   */
  it('should not add X-CSRFToken header for GET requests', () => {
    httpClient.get('/test').subscribe();

    const httpRequest = httpMock.expectOne('/test');

    expect(httpRequest.request.headers.has('X-CSRFToken')).toBeFalse();

    httpRequest.flush({});
  });



  /**
   * Test Case: Should not add X-CSRFToken header if CSRF token is missing
   * 
   * This test verifies that if the CSRF token is missing from the cookies,
   * the interceptor will not add the `X-CSRFToken` header to the request.
   */
  it('should not add X-CSRFToken header if csrf token is missing', () => {
    Object.defineProperty(document, 'cookie', {
      value: '',
      writable: true,
    });

    httpClient.post('/test', {}).subscribe();

    const httpRequest = httpMock.expectOne('/test');

    expect(httpRequest.request.headers.has('X-CSRFToken')).toBeFalse();

    httpRequest.flush({});
  });
});
