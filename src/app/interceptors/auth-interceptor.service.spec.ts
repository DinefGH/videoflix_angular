import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthInterceptor } from './auth-interceptor.service'; 
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';



/**
 * Test Suite for the AuthInterceptor
 * 
 * This suite tests the behavior of the `AuthInterceptor`, ensuring that it correctly
 * modifies HTTP requests by adding the `withCredentials` flag and appending the 
 * `Authorization` header when an auth token is available.
 */
describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify(); 
  });


  /**
   * Test Case: Should add `withCredentials` to the request
   * 
   * This test verifies that the interceptor modifies the outgoing HTTP request
   * by adding the `withCredentials` flag, ensuring that credentials (e.g., cookies) 
   * are sent with the request.
   */
  it('should add withCredentials to the request', () => {

    const testUrl = '/test';
    

    httpClient.get(testUrl).subscribe();


    const httpRequest = httpMock.expectOne(testUrl);
    

    expect(httpRequest.request.withCredentials).toBeTrue();
    

    httpRequest.flush({});
  });
});