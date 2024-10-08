import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './reset-password.component';
import { PasswordResetService } from 'src/app/services/password-reset.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { fakeAsync, tick } from '@angular/core/testing';



/**
 * Test suite for the ResetPasswordComponent.
 */
describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let passwordResetServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;


  /**
   * Setup the test environment and create mocks for services and ActivatedRoute.
   * Also, set up the component's TestBed.
   */
  beforeEach(async () => {
    passwordResetServiceMock = {
      resetPassword: jasmine.createSpy('resetPassword').and.returnValue(of({ success: true })),
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.callFake((param: string) => {
            if (param === 'uid') return 'test-uid';
            if (param === 'token') return 'test-token';
            return null;
          }),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ResetPasswordComponent, 
        NoopAnimationsModule,    
      ],
      providers: [
        { provide: PasswordResetService, useValue: passwordResetServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });


  /**
   * Ensure that the component is created successfully.
   */
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  
  /**
   * Test to ensure that the component initializes with the 'uid' and 'token' from route parameters.
   */
  it('should initialize with uid and token from route params', () => {
    expect(activatedRouteMock.snapshot.paramMap.get).toHaveBeenCalledWith('uid');
    expect(activatedRouteMock.snapshot.paramMap.get).toHaveBeenCalledWith('token');
    expect(component['uid']).toBe('test-uid');
    expect(component['token']).toBe('test-token');
  });


  /**
   * Test to ensure that required validation errors are shown when the password and confirm password fields are empty.
   */
  it('should show required error if password or confirm password is empty', () => {
    const passwordControl = component.form.get('password');
    const confirmPasswordControl = component.form.get('confirmPassword');
    passwordControl?.setValue('');
    confirmPasswordControl?.setValue('');
    fixture.detectChanges();

    expect(passwordControl?.hasError('required')).toBeTrue();
    expect(confirmPasswordControl?.hasError('required')).toBeTrue();
  });


  /**
   * Test to ensure that a password mismatch error is shown when the password and confirm password fields do not match.
   */
  it('should show password mismatch error if passwords do not match', fakeAsync(() => {
    const passwordControl = component.form.get('password');
    const confirmPasswordControl = component.form.get('confirmPassword');
    
    passwordControl?.setValue('Password123');
    confirmPasswordControl?.setValue('Password456');
  
    fixture.detectChanges();
  
    tick();
  
    fixture.detectChanges();
  
    expect(component.passwordsMatch).toBeFalse(); 
    expect(component.getPasswordErrorMessageMatch()).toBe('Passwords must match');
  }));



  /**
   * Test to ensure that the password reset service is called with the correct values when the form is submitted.
   */
  it('should call password reset service with correct values on form submit', () => {
    const passwordControl = component.form.get('password');
    const confirmPasswordControl = component.form.get('confirmPassword');
    passwordControl?.setValue('Password123');
    confirmPasswordControl?.setValue('Password123');
    fixture.detectChanges();

    component.onSubmit();

    expect(passwordResetServiceMock.resetPassword).toHaveBeenCalledWith(
      'test-uid',
      'test-token',
      'Password123',
      'Password123'
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });


  /**
   * Test to handle a failure in the password reset service and ensure the error message is displayed.
   */
  it('should handle password reset service failure', () => {
    passwordResetServiceMock.resetPassword.and.returnValue(throwError({ error: 'Error resetting password' }));

    const passwordControl = component.form.get('password');
    const confirmPasswordControl = component.form.get('confirmPassword');
    passwordControl?.setValue('Password123');
    confirmPasswordControl?.setValue('Password123');
    fixture.detectChanges();

    component.onSubmit();

    expect(passwordResetServiceMock.resetPassword).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Failed to reset password. Please try again.');
  });


  /**
   * Test to ensure that the password reset service is not called if the form is invalid.
   */
  it('should not call password reset service if form is invalid', () => {
    const passwordControl = component.form.get('password');
    const confirmPasswordControl = component.form.get('confirmPassword');
    passwordControl?.setValue('Password123');
    confirmPasswordControl?.setValue('Password456'); 
    fixture.detectChanges();

    component.onSubmit();

    expect(passwordResetServiceMock.resetPassword).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Please fill out the form correctly.');
  });
});
