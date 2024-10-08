import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginService } from './login.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


/**
 * Test suite for `LoginService`, which handles user authentication processes such as login, token refresh, logout, and session checks.
 * 
 * The suite tests the core functionalities:
 * - Storing tokens after login.
 * - Refreshing the access token.
 * - Logging out and clearing tokens from storage.
 * - Checking if a user is logged in.
 */
describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;
  let store: { [key: string]: string } = {};

  const apiUrl = 'http://127.0.0.1:8000';


  /**
   * Set up the test environment, initializing the service and mocking localStorage methods to simulate token storage.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService],
    });

    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);

    store = {};

    spyOn(localStorage, 'getItem').and.callFake((key: string): string | null => {
      return store[key] || null;
    });

    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): void => {
      store[key] = value;
    });

    spyOn(localStorage, 'removeItem').and.callFake((key: string): void => {
      delete store[key];
    });
  });


  /**
   * Verify there are no pending HTTP requests and reset spies after each test.
   */
  afterEach(() => {
    httpMock.verify();

    (localStorage.getItem as jasmine.Spy).calls.reset();
    (localStorage.setItem as jasmine.Spy).calls.reset();
    (localStorage.removeItem as jasmine.Spy).calls.reset();
  });


  /**
   * Test that the login function stores tokens in localStorage after successful login.
   */
  describe('#login', () => {
    it('should login and store tokens in localStorage', () => {
      const email = 'test@example.com';
      const password = 'password';
      const mockResponse = {
        access: 'access-token',
        refresh: 'refresh-token',
      };

      service.login(email, password).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'access-token');
        expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'refresh-token');
      });

      const req = httpMock.expectOne(`${apiUrl}/login/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email, password });

      req.flush(mockResponse);
    });


    /**
     * Test that an error is logged when tokens are missing from the response.
     */
    it('should handle login response without tokens', () => {
      const email = 'test@example.com';
      const password = 'password';
      const mockResponse = {}; 

      spyOn(console, 'error');

      service.login(email, password).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.setItem).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith('Access or refresh token not found in response');
      });

      const req = httpMock.expectOne(`${apiUrl}/login/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email, password });

      req.flush(mockResponse);
    });
  });


  /**
   * Test that the refresh token function updates the access token in localStorage.
   */
  describe('#refreshToken', () => {
    it('should refresh token and update accessToken in localStorage', () => {
      const refreshToken = 'refresh-token';
      const mockResponse = {
        access: 'new-access-token',
      };

      store['refreshToken'] = refreshToken;

      service.refreshToken().subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'new-access-token');
      });

      const req = httpMock.expectOne(`${apiUrl}/api/token/refresh/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ refresh: refreshToken });

      req.flush(mockResponse);
    });
  });


  /**
   * Test that the logout function removes tokens from localStorage.
   */
  describe('#logout', () => {
    it('should logout and remove tokens from localStorage', () => {
      service.logout().subscribe(() => {
        expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken');
        expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
      });

      const req = httpMock.expectOne(`${apiUrl}/logout/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});

      req.flush({});
    });
  });



  describe('#isLoggedIn', () => {

    /**
   * Test that the isLoggedIn function returns false when no valid tokens exist.
   */
    it('should return false when accessToken does not exist', (done) => {
      delete store['accessToken'];
      service.isLoggedIn().subscribe((result) => {
        expect(result).toBeFalse();
        done();
      });
    });




    /**
     * Test that `isLoggedIn` returns false when the refresh token exists but the token refresh process fails.
     */
    it('should return false when refreshToken exists but refreshToken() fails', (done) => {
      const refreshToken = 'invalid-refresh-token';
      store['refreshToken'] = refreshToken;

      service.isLoggedIn().subscribe((result) => {
        expect(result).toBeFalse();
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/api/token/refresh/`);
      expect(req.request.method).toBe('POST');

      req.flush({ detail: 'Invalid token' }, { status: 401, statusText: 'Unauthorized' });
    });


    /**
     * Test that `isLoggedIn` returns false when no refresh token exists in localStorage.
     */
    it('should return false when refreshToken does not exist', (done) => {
      delete store['refreshToken'];
      spyOn(console, 'log');
      service.isLoggedIn().subscribe((result) => {
        expect(result).toBeFalse();
        expect(console.log).toHaveBeenCalledWith('No valid tokens found, user is not logged in.');
        done();
      });
      httpMock.expectNone(`${apiUrl}/api/token/refresh/`);
    });
  });


  /**
   * Test the behavior of isLoggedIn with different responses and token states.
   */
  describe('#isLoggedIn mapping function', () => {
    beforeEach(() => {
      store = {};
    });


    /**
     * Test that `isLoggedIn` returns true when a valid response is received and an access token is stored.
     */
    it('should return true when response is truthy and accessToken exists', fakeAsync(() => {
      const refreshToken = 'valid-refresh-token';
      const newAccessToken = 'new-access-token';
      store['refreshToken'] = refreshToken;
      delete store['accessToken'];

      let result: boolean | undefined;
      service.isLoggedIn().subscribe((res) => {
        result = res;
      });

      tick();

      const req = httpMock.expectOne(`${apiUrl}/api/token/refresh/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ refresh: refreshToken });

      req.flush({ access: newAccessToken });

      tick();

      expect(result).toBeTrue();
      expect(store['accessToken']).toBe(newAccessToken);
    }));


    /**
     * Test that `isLoggedIn` returns false when the response is valid but the access token is missing.
     */
    it('should return false when response is truthy but accessToken does not exist', fakeAsync(() => {
      const refreshToken = 'valid-refresh-token';
      store['refreshToken'] = refreshToken;
      delete store['accessToken']; 

      (localStorage.setItem as jasmine.Spy).and.callFake((key: string, value: string) => {
        if (key !== 'accessToken') {
          store[key] = value;
        }
      });

      let result: boolean | undefined;
      service.isLoggedIn().subscribe((res) => {
        result = res;
      });

      tick();

      const req = httpMock.expectOne(`${apiUrl}/api/token/refresh/`);
      expect(req.request.method).toBe('POST');

      req.flush({});

      tick();

      expect(result).toBeFalse();
      expect(store['accessToken']).toBeUndefined();
    }));



    /**
     * Test that `isLoggedIn` returns false when the response is falsy.
     */
    it('should return false when response is falsy', fakeAsync(() => {
      const refreshToken = 'valid-refresh-token';
      store['refreshToken'] = refreshToken;
      delete store['accessToken']; 

      let result: boolean | undefined;
      service.isLoggedIn().subscribe((res) => {
        result = res;
      });

      tick();

      const req = httpMock.expectOne(`${apiUrl}/api/token/refresh/`);
      expect(req.request.method).toBe('POST');

      req.flush(null);

      tick();

      expect(result).toBeFalse();
    }));
  });
});
