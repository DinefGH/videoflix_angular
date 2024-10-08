import { TestBed } from '@angular/core/testing';
import { PasswordResetService } from './password-reset.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


/**
 * Test suite for the `PasswordResetService` to verify functionality for sending password reset emails
 * and resetting passwords through the backend API.
 */
describe('PasswordResetService', () => {
  let service: PasswordResetService;
  let httpMock: HttpTestingController;


  /**
   * Before each test, the service and mock HTTP client are set up.
   * This configuration uses `HttpClientTestingModule` to simulate backend API calls.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PasswordResetService]
    });

    service = TestBed.inject(PasswordResetService);
    httpMock = TestBed.inject(HttpTestingController);
  });


  /**
   * After each test, verify that there are no outstanding HTTP requests.
   */
  afterEach(() => {
    httpMock.verify(); 
  });


  /**
   * Test case to check if the service is created successfully.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  /**
   * Test case to verify that the service can successfully send a password reset email.
   * The test checks that the correct HTTP POST request is made with the provided email.
   */
  it('should send password reset email', () => {
    const mockResponse = { success: true };
    const email = 'test@example.com';

    service.sendPasswordResetEmail(email).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://127.0.0.1:8000/password-reset/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email });
    req.flush(mockResponse); 
  });


  /**
   * Test case to verify that the service can reset a user's password.
   * It ensures that the correct HTTP POST request is made with the appropriate parameters for resetting the password.
   */
  it('should reset the password', () => {
    const mockResponse = { success: true };
    const uid = 'test-uid';
    const token = 'test-token';
    const password = 'Password123';
    const confirmPassword = 'Password123';

    service.resetPassword(uid, token, password, confirmPassword).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://127.0.0.1:8000/reset-password/${uid}/${token}/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      password,
      confirm_password: confirmPassword
    });
    req.flush(mockResponse); 
  });
});
