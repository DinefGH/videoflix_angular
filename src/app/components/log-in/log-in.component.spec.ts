import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { LogInComponent } from './log-in.component';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';


/**
 * DummyComponent is used as a placeholder in the Router configuration for testing.
 */
@Component({
  selector: 'app-dummy',
  standalone: true,
  template: ''
})
class DummyComponent {}


/**
 * Test suite for LogInComponent.
 */
describe('LogInComponent', () => {
  let component: LogInComponent;
  let fixture: ComponentFixture<LogInComponent>;
  let loginServiceMock: jasmine.SpyObj<LoginService>;
  let routerMock: Router;


  /**
   * Runs before each test case to set up the testing environment.
   * Initializes the component, mocks services, and configures the test bed.
   */
  beforeEach(async () => {
    const loginServiceSpy = jasmine.createSpyObj('LoginService', ['getCsrfToken', 'login']);

    await TestBed.configureTestingModule({
      imports: [LogInComponent, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        { provide: LoginService, useValue: loginServiceSpy },
        provideHttpClientTesting(),
        provideRouter([
          { path: 'video-list', component: DummyComponent }
        ])
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LogInComponent);
    component = fixture.componentInstance;
    loginServiceMock = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    routerMock = TestBed.inject(Router);

    spyOn(routerMock, 'navigate').and.returnValue(Promise.resolve(true));

    loginServiceMock.login.and.returnValue(of({ success: true }));

    fixture.detectChanges();
  });


  /**
   * Verifies that the loginServiceMock.login method is a spy.
   */
  it('loginServiceMock.login should be a spy', () => {
    expect(jasmine.isSpy(loginServiceMock.login)).toBeTrue();
  });


  /**
   * Tests if the LogInComponent is successfully created.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });


  /**
   * Tests if the login form initializes with empty fields and default values.
   */
  it('should initialize the form with empty fields and default values', () => {
    const loginForm = component.loginForm;
    expect(loginForm).toBeTruthy();
    expect(loginForm.get('email')?.value).toBe('');
    expect(loginForm.get('password')?.value).toBe('');
    expect(loginForm.get('rememberMe')?.value).toBe(false);
  });


  /**
   * Tests form validation for invalid email input and ensures the error message is displayed.
   */
  it('should display error message when email is invalid', fakeAsync(() => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    emailControl?.markAsTouched();
    fixture.detectChanges();
    tick();
    flush();

    expect(emailControl?.hasError('email')).toBeTrue();
    expect(component.errorMessage()).toBe('Not a valid email');
  }));


  /**
   * Tests the successful form submission and calls the login service.
   */
  it('should call login service on valid form submission', fakeAsync(() => {
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');
    emailControl?.setValue('test@example.com');
    passwordControl?.setValue('password123');
    component.loginForm.get('rememberMe')?.setValue(true);
  
    expect(component.loginForm.valid).toBeTrue();
  
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'accessToken') return 'mockAccessToken';
      if (key === 'refreshToken') return 'mockRefreshToken';
      return null;
    });
  
    component.onLogin();
    tick();
  
    expect(loginServiceMock.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/video-list']);
    expect(component.loginFailed).toBeFalse();
    expect(component.errorMessage()).toBe('');
  }));

  

  
  /**
   * Tests if the correct error message is set for invalid email input.
   */
  it('should set correct error message for invalid email', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setErrors({ email: true });
    component.updateErrorMessage();
    
    expect(component.errorMessage()).toBe('Not a valid email');
  });
  

  /**
   * Tests if the correct error message is returned for missing password input.
   */
  it('should return password required error', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setErrors({ required: true });
  
    expect(component.getPasswordErrorMessage()).toBe('Password is required');
  });


  /**
   * Tests the visibility toggle for the password field when the clickEvent method is called.
   */
  it('should toggle password visibility when clickEvent is called', () => {
    const mockEvent = new MouseEvent('click');
    spyOn(mockEvent, 'stopPropagation');
  
    component.clickEvent(mockEvent);
  
    expect(component.hide()).toBeFalse(); 
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });


  /**
   * Tests the behavior when the form submission is attempted with invalid inputs.
   */
  it('should display form validation error when form is invalid', () => {
    component.loginForm.get('email')?.setValue('');
    component.loginForm.get('password')?.setValue('');
  
    component.onLogin();
  
    expect(component.errorMessage()).toBe('Please fill out the form correctly.');
    expect(component.loginFailed).toBeTrue();
  });


  
  /**
   * Tests the error handling for invalid login credentials (e.g., incorrect email/password).
   */
  it('should handle invalid login credentials', () => {
    const errorResponse = { status: 400 };
    component.handleLoginError(errorResponse);
  
    expect(component.errorMessage()).toBe('Invalid login credentials.');
    expect(component.loginFailed).toBeTrue();
  });


  
  /**
   * Tests the error handling for general login errors (e.g., server issues).
   */
  it('should handle general login error', fakeAsync(() => {
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');
    
    emailControl?.setValue('test@example.com');
    passwordControl?.setValue('password123');
    
    expect(component.loginForm.valid).toBeTrue();
  
    loginServiceMock.login.and.returnValue(throwError({ status: 500 }));
  
    component.onLogin();
    tick();
  
    expect(loginServiceMock.login).toHaveBeenCalled();
    expect(component.loginFailed).toBeTrue();
    expect(component.errorMessage()).toBe('An error occurred during login.');
  }));
});
