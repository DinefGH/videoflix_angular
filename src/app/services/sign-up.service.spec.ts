import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SignUpService } from './sign-up.service';


/**
 * Unit tests for the SignUpService.
 * These tests verify that the service correctly handles user registration
 * by interacting with the backend API.
 */
describe('SignUpService', () => {
  let service: SignUpService;
  let httpTestingController: HttpTestingController;


  /**
   * Sets up the testing environment, initializing the SignUpService and HttpTestingController.
   * The HttpClientTestingModule is used to mock HTTP requests during tests.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  
      providers: [SignUpService]
    });

    service = TestBed.inject(SignUpService);  
    httpTestingController = TestBed.inject(HttpTestingController);  
  });


  /**
   * Verifies that no outstanding HTTP requests remain after each test.
   */
  afterEach(() => {
    httpTestingController.verify();
  });


  /**
   * Test to check if the service is created successfully.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  /**
   * Test to verify that the register method sends the correct HTTP POST request
   * to register a user and processes the response successfully.
   */
  it('should register a user successfully', () => {
    const mockResponse = { message: 'User registered successfully!' };
    const email = 'test@example.com';
    const password = 'password123';

    service.register(email, password).subscribe(response => {
      expect(response).toEqual(mockResponse); 
    });

    const req = httpTestingController.expectOne('http://127.0.0.1:8000/register/');
    expect(req.request.method).toBe('POST');

    expect(req.request.body).toEqual(JSON.stringify({ email, password }));

    req.flush(mockResponse);
  });


  /**
   * Test to verify that the service handles registration errors properly.
   * The test simulates a failed registration response from the server.
   */
  it('should handle error during registration', () => {
    const email = 'test@example.com';
    const password = 'password123';
    const errorMessage = 'Registration failed';

    service.register(email, password).subscribe(
      () => fail('should have failed with an error'),
      (error) => {
        expect(error.status).toBe(400);
        expect(error.error).toBe(errorMessage);
      }
    );

    const req = httpTestingController.expectOne('http://127.0.0.1:8000/register/');
    expect(req.request.method).toBe('POST');

    req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
  });
});